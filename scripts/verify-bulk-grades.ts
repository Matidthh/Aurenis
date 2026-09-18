import { saveBulkMatrixGrades } from "../lib/services/grade.service";
import { createTenantPrisma } from "../lib/db/tenant-extension";
import { prisma } from "../lib/db/prisma";

async function runVerificationSuite() {
  console.log("================================================================================");
  console.log("🔒 AURENIS — SUITE DE PRUEBAS DE SEGURIDAD Y REGRESIÓN: SAVE_BULK_MATRIX_GRADES");
  console.log("================================================================================");

  const schoolId = "sch_colegio_san_jose_001";
  const tenantDb = createTenantPrisma(schoolId);
  const ts = Date.now();

  console.log("\n[SETUP] Creando entidades de prueba aisladas...");

  const school = await prisma.school.upsert({
    where: { id: schoolId },
    update: {},
    create: { id: schoolId, name: "Colegio San José Test", slug: "colegio-san-jose-test" },
  });

  const edLevel = await prisma.educationLevel.upsert({
    where: { id: `edl_${ts}` },
    update: {},
    create: { id: `edl_${ts}`, schoolId, name: `EMT ${ts}`, shortCode: `T${ts.toString().slice(-3)}` },
  });

  const courseA = await prisma.course.create({
    data: { id: `crs_${ts}_a`, schoolId, educationLevelId: edLevel.id, name: `Curso A ${ts}`, gradeNumber: 9, year: 2026 },
  });

  const courseB = await prisma.course.create({
    data: { id: `crs_${ts}_b`, schoolId, educationLevelId: edLevel.id, name: `Curso B ${ts}`, gradeNumber: 9, year: 2026 },
  });

  const userTeacherA = await prisma.user.create({
    data: { id: `usr_t_a_${ts}`, email: `teacher.a.${ts}@aurenis.test`, firstName: "Profesor", lastName: "Alfa", passwordHash: "hash" },
  });

  const userTeacherB = await prisma.user.create({
    data: { id: `usr_t_b_${ts}`, email: `teacher.b.${ts}@aurenis.test`, firstName: "Profesor", lastName: "Beta", passwordHash: "hash" },
  });

  const roleTeacher = await prisma.role.upsert({
    where: { schoolId_name: { schoolId, name: "TEACHER" } },
    update: {},
    create: { schoolId, name: "TEACHER", displayName: "Profesor", description: "Docente" },
  });

  const membA = await prisma.membership.create({
    data: { id: `memb_a_${ts}`, userId: userTeacherA.id, schoolId, roleId: roleTeacher.id, isActive: true },
  });

  const membB = await prisma.membership.create({
    data: { id: `memb_b_${ts}`, userId: userTeacherB.id, schoolId, roleId: roleTeacher.id, isActive: true },
  });

  const teacherProfileA = await prisma.teacherProfile.create({
    data: { id: `tch_a_${ts}`, membershipId: membA.id },
  });

  const teacherProfileB = await prisma.teacherProfile.create({
    data: { id: `tch_b_${ts}`, membershipId: membB.id },
  });

  const subjectA = await prisma.subject.create({
    data: { id: `sub_${ts}_a`, schoolId, courseId: courseA.id, name: "Matemáticas Test", teacherProfileId: teacherProfileA.id },
  });

  const subjectB = await prisma.subject.create({
    data: { id: `sub_${ts}_b`, schoolId, courseId: courseA.id, name: "Historia Test", teacherProfileId: teacherProfileB.id },
  });

  const period = await prisma.academicPeriod.upsert({
    where: { id: `per_${ts}` },
    update: {},
    create: { id: `per_${ts}`, schoolId, name: `Semestre ${ts}`, year: 2026, startDate: new Date("2026-03-01"), endDate: new Date("2026-07-01"), isCurrent: true },
  });

  const assessmentA = await prisma.assessment.create({
    data: { id: `ass_${ts}_a`, schoolId, subjectId: subjectA.id, academicPeriodId: period.id, title: "Evaluación A", date: new Date() },
  });

  const assessmentB = await prisma.assessment.create({
    data: { id: `ass_${ts}_b`, schoolId, subjectId: subjectB.id, academicPeriodId: period.id, title: "Evaluación B", date: new Date() },
  });

  const studentUser1 = await prisma.user.create({
    data: { id: `usr_stu1_${ts}`, email: `stu.1.${ts}@aurenis.test`, firstName: "Estudiante", lastName: "Uno", passwordHash: "hash" },
  });

  const studentUser2 = await prisma.user.create({
    data: { id: `usr_stu2_${ts}`, email: `stu.2.${ts}@aurenis.test`, firstName: "Estudiante", lastName: "Dos", passwordHash: "hash" },
  });

  const roleStudent = await prisma.role.upsert({
    where: { schoolId_name: { schoolId, name: "STUDENT" } },
    update: {},
    create: { schoolId, name: "STUDENT", displayName: "Estudiante", description: "Estudiante" },
  });

  const membStu1 = await prisma.membership.create({
    data: { id: `memb_stu1_${ts}`, userId: studentUser1.id, schoolId, roleId: roleStudent.id, isActive: true },
  });

  const membStu2 = await prisma.membership.create({
    data: { id: `memb_stu2_${ts}`, userId: studentUser2.id, schoolId, roleId: roleStudent.id, isActive: true },
  });

  const studentProfile1 = await prisma.studentProfile.create({
    data: { id: `sp1_${ts}`, membershipId: membStu1.id },
  });

  const studentProfile2 = await prisma.studentProfile.create({
    data: { id: `sp2_${ts}`, membershipId: membStu2.id },
  });

  const enrollment1 = await prisma.enrollment.create({
    data: { id: `enr_${ts}_1`, schoolId, courseId: courseA.id, studentProfileId: studentProfile1.id, year: 2026 },
  });

  const enrollment2CourseB = await prisma.enrollment.create({
    data: { id: `enr_${ts}_2`, schoolId, courseId: courseB.id, studentProfileId: studentProfile2.id, year: 2026 },
  });

  console.log("✅ [SETUP] Entidades de prueba creadas correctamente.");

  // TEST 1: Cross-Tenant
  console.log("\n[TEST 1] Probando rechazo de lote con enrollmentId cruzado (Cross-Tenant)...");
  try {
    await saveBulkMatrixGrades(
      tenantDb,
      schoolId,
      [
        { assessmentId: assessmentA.id, enrollmentId: enrollment1.id, value: 6.5 },
        { assessmentId: assessmentA.id, enrollmentId: "enr_external_school_fake", value: 7.0 },
      ],
      userTeacherA.id
    );
    console.error("❌ FALLÓ EL TEST 1: Se permitió un enrollmentId externo.");
    process.exit(1);
  } catch (err: any) {
    if (err.message && err.message.includes("Violación de seguridad multi-tenant")) {
      console.log(`✅ PASSED: El servicio bloqueó correctamente el lote cross-tenant.`);
      console.log(`   ↳ Mensaje capturado: ${err.message}`);
    } else {
      console.error("❌ Error inesperado en Test 1:", err);
      process.exit(1);
    }
  }

  // TEST 2: Cross-Course
  console.log("\n[TEST 2] Probando rechazo cuando un docente intenta calificar asignatura ajena (Cross-Course)...");
  try {
    await saveBulkMatrixGrades(
      tenantDb,
      schoolId,
      [
        { assessmentId: assessmentB.id, enrollmentId: enrollment1.id, value: 5.5 },
      ],
      userTeacherA.id // Profesor A no es titular de assessmentB
    );
    console.error("❌ FALLÓ EL TEST 2: Se permitió calificar asignatura ajena.");
    process.exit(1);
  } catch (err: any) {
    if (err.message && err.message.includes("No estás asignado como profesor titular")) {
      console.log(`✅ PASSED: El servicio bloqueó la operación no autorizada por profesor titular.`);
      console.log(`   ↳ Mensaje capturado: ${err.message}`);
    } else {
      console.error("❌ Error inesperado en Test 2:", err);
      process.exit(1);
    }
  }

  // TEST 3: Enrollment Course Mismatch
  console.log("\n[TEST 3] Probando rechazo por Enrollment Course Mismatch...");
  try {
    await saveBulkMatrixGrades(
      tenantDb,
      schoolId,
      [
        { assessmentId: assessmentA.id, enrollmentId: enrollment2CourseB.id, value: 6.0 },
      ],
      userTeacherA.id
    );
    console.error("❌ FALLÓ EL TEST 3: Se permitió mismatch de curso.");
    process.exit(1);
  } catch (err: any) {
    if (err.message && err.message.includes("no pertenece al curso correspondiente")) {
      console.log(`✅ PASSED: El servicio bloqueó correctamente el mismatch de curso.`);
      console.log(`   ↳ Mensaje capturado: ${err.message}`);
    } else {
      console.error("❌ Error inesperado en Test 3:", err);
      process.exit(1);
    }
  }

  // TEST 4: Regression & Skipped report
  console.log("\n[TEST 4] Probando guardado válido + reporte de notas fuera de rango (Skipped)...");
  try {
    const res = await saveBulkMatrixGrades(
      tenantDb,
      schoolId,
      [
        { assessmentId: assessmentA.id, enrollmentId: enrollment1.id, value: 6.8, feedback: "Excelente" },
        { assessmentId: assessmentA.id, enrollmentId: enrollment1.id, value: 12.0, feedback: "Inválida" },
      ],
      userTeacherA.id
    );

    const passedReg = res.success && res.savedCount === 1 && res.skipped.length === 1 && res.skipped[0].reason === "OUT_OF_RANGE";
    if (passedReg) {
      console.log(`✅ PASSED: Lote procesado con éxito.`);
      console.log(`   ↳ Guardadas: ${res.savedCount}`);
      console.log(`   ↳ Omitidas (skipped):`, res.skipped);
    } else {
      console.error("❌ FALLÓ EL TEST 4:", res);
      process.exit(1);
    }
  } catch (err: any) {
    console.error("❌ Error inesperado en Test 4:", err);
    process.exit(1);
  }

  console.log("\n✨ Todas las pruebas (Cross-Tenant, Cross-Course, Course Mismatch, Regresión y Skipped) completadas con éxito.");
}

runVerificationSuite().catch((e) => {
  console.error("❌ Error fatal en suite de verificación:", e);
  process.exit(1);
});
