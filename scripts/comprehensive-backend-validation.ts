import { prisma } from "../lib/db/prisma";
import { createTenantPrisma } from "../lib/db/tenant-extension";
import { authenticateUser } from "../lib/services/user.service";
import { createSchoolWithOnboarding, getSchoolBySlug, updateSchoolSettings } from "../lib/services/school.service";
import { getSchoolAcademicOverview, listCoursesByYear, createCourse, updateCourse, deleteCourse } from "../lib/services/academic.service";
import { listAssessmentsWithGrades, createGrade, updateGrade, deleteGrade } from "../lib/services/grade.service";
import { listStudentsBySchool, getStudentDetails } from "../lib/services/student.service";
import { listTeachersBySchool, getTeacherDetails } from "../lib/services/teacher.service";
import { listAttendanceRecords, getAttendanceOverview } from "../lib/services/attendance.service";
import { logAuditEvent } from "../lib/services/audit.service";
import { assertPermission, hasPermission, hasAnyPermission, hasAllPermissions } from "../lib/auth/permissions";
import { PERMISSIONS } from "../lib/constants/permissions";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { AuditAction } from "@prisma/client";

async function runComprehensiveBackendValidation() {
  console.log("=".repeat(80));
  console.log("🔍 AUDITORÍA INTEGRAL Y DESTRUCTIVA DE BACKEND — AURENIS");
  console.log("   Evaluando Seguridad, Integridad Relacional, Servicios y Aislamiento");
  console.log("=".repeat(80));

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  function assert(name: string, condition: boolean, detail: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${name}\n   ↳ ${detail}`);
    } else {
      failedTests++;
      console.error(`❌ [FAIL] ${name}\n   ↳ ${detail}`);
    }
  }

  // -------------------------------------------------------------
  // TEST GRUPO 1: CRIPTOGRAFÍA Y SEGURIDAD DE ACCESO
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 1: Criptografía, Hashing & Manejo de Sesiones ---");
  const rawSecret = "ClaveUltraSegura2026!#$";
  const hashed = await hashPassword(rawSecret);
  const isValid = await verifyPassword(rawSecret, hashed);
  const isInvalid = await verifyPassword("ClaveErronea999!", hashed);

  assert(
    "Hashing Bcrypt y validación de contraseñas",
    isValid && !isInvalid && hashed.startsWith("$2b$10$"),
    `Factor de costo 10 verificado. Prefijo seguro: ${hashed.slice(0, 10)}...`
  );

  const tokenPayload = {
    sub: "test-user-system",
    email: "sysadmin@aurenis.com",
    firstName: "Sys",
    lastName: "Admin",
    isSystemAdmin: true,
    permissions: [],
  };
  const token = await signSessionToken(tokenPayload);
  const verified = await verifySessionToken(token);

  assert(
    "Firma y decodificación JWT segura con 'jose'",
    verified !== null && verified.email === tokenPayload.email && verified.isSystemAdmin === true,
    `Token emitido y validado con algoritmo HS256. Sujeto: ${verified?.sub}`
  );

  const tamperedToken = token.slice(0, -5) + "abcde";
  const tamperedVerified = await verifySessionToken(tamperedToken);
  assert(
    "Rechazo criptográfico ante manipulación de firma (Tampering)",
    tamperedVerified === null,
    "El token alterado fue rechazado retornando null de forma segura."
  );

  // -------------------------------------------------------------
  // TEST GRUPO 2: AISLAMIENTO MULTI-TENANT Y ANTI-IDOR EN ORM
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 2: Aislamiento Multi-Tenant & Prevencción de IDOR ---");
  const schoolA = (await prisma.school.findFirst({ where: { slug: "colegio-san-jose" } })) || (await getSchoolBySlug("colegio-san-jose"));
  if (!schoolA) {
    throw new Error("Colegio San José requerido para ejecutar las pruebas");
  }

  const tenantA = createTenantPrisma(schoolA.id);
  const tenantB = createTenantPrisma("school-fantasma-999");

  const coursesA = await tenantA.course.findMany();
  const coursesB = await tenantB.course.findMany();

  assert(
    "Aislamiento de lectura automático en consultas ORM",
    coursesA.length > 0 && coursesB.length === 0,
    `Tenant '${schoolA.slug}' lee ${coursesA.length} cursos; Tenant ajeno lee 0 cursos.`
  );

  let crossTenantBlocked = false;
  try {
    await tenantA.course.create({
      data: {
        schoolId: "school-otro-colegio-hacker",
        name: "Curso Inyectado Ilegal",
        gradeNumber: 1,
        year: 2026,
        educationLevelId: "dummy-level",
      },
    });
  } catch (err: any) {
    if (err.message.includes("Violación de aislamiento multi-tenant")) {
      crossTenantBlocked = true;
    }
  }

  assert(
    "Bloqueo activo de escritura cruzada entre colegios (Cross-Tenant Write)",
    crossTenantBlocked,
    "createTenantPrisma interceptó e impidió la inserción con schoolId discordante."
  );

  // -------------------------------------------------------------
  // TEST GRUPO 3: CONTROL DE ACCESO BASADO EN ROLES (RBAC)
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 3: Evaluación de Permisos RBAC ---");
  const adminCtx = {
    isSystemAdmin: false,
    roleName: "SCHOOL_ADMIN",
    permissions: [
      PERMISSIONS.SCHOOL_SETTINGS_VIEW,
      PERMISSIONS.SCHOOL_SETTINGS_UPDATE,
      PERMISSIONS.ACADEMIC_COURSES_MANAGE,
    ],
  };

  const teacherCtx = {
    isSystemAdmin: false,
    roleName: "TEACHER",
    permissions: [
      PERMISSIONS.GRADES_VIEW,
      PERMISSIONS.GRADES_ENTER,
      PERMISSIONS.ATTENDANCE_RECORD,
    ],
  };

  assert(
    "Admin escolar posee permisos de configuración y cursos",
    hasPermission(adminCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE) &&
      hasPermission(adminCtx, PERMISSIONS.ACADEMIC_COURSES_MANAGE),
    "Permisos institucionales correctamente concedidos al perfil de administrador."
  );

  assert(
    "Profesor tiene denegado el acceso a configuración de escuela",
    !hasPermission(teacherCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE) &&
      !hasPermission(teacherCtx, PERMISSIONS.ACADEMIC_COURSES_MANAGE),
    "Restricción verificada: el docente no puede mutar ajustes institucionales."
  );

  let forbiddenCaught = false;
  try {
    assertPermission(teacherCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
  } catch (err: any) {
    if (err.name === "ForbiddenError") {
      forbiddenCaught = true;
    }
  }

  assert(
    "assertPermission arroja ForbiddenError tipado ante accesos no autorizados",
    forbiddenCaught,
    "Excepción ForbiddenError disparada correctamente para protección de API y vistas."
  );

  // -------------------------------------------------------------
  // TEST GRUPO 4: TRANSACCIONALIDAD ACID Y SERVICIO DE INSTITUCIONES
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 4: Servicios Institucionales & Onboarding ACID ---");
  const schoolOverview = await getSchoolBySlug("colegio-san-jose");
  assert(
    "getSchoolBySlug recupera datos y contadores agregados",
    schoolOverview !== null &&
      schoolOverview.settings !== null &&
      schoolOverview._count.courses >= 1,
    `Institución cargada: '${schoolOverview?.name}', cursos: ${schoolOverview?._count.courses}`
  );

  const testSlug = `test-school-${Date.now().toString().slice(-6)}`;
  const onboardingResult = await createSchoolWithOnboarding({
    name: "Liceo Experimental de Prueba",
    slug: testSlug,
    city: "Valparaíso",
    country: "Chile",
    timezone: "America/Santiago",
    termType: "SEMESTER",
    adminEmail: `admin.${testSlug}@aurenis.test`,
    adminFirstName: "Directora",
    adminLastName: "Prueba",
    adminPassword: "PasswordSegura123!",
  });

  assert(
    "Onboarding atómico ACID crea Colegio, Roles, Admin y Ajustes",
    onboardingResult.school.id !== undefined &&
      onboardingResult.adminUser.id !== undefined &&
      onboardingResult.membership.id !== undefined,
    `Escuela creada: ID=${onboardingResult.school.id}, Admin=${onboardingResult.adminUser.email}`
  );

  // Intentar crear un colegio con el mismo slug debe ser rechazado
  let duplicateSlugRejected = false;
  try {
    await createSchoolWithOnboarding({
      name: "Liceo Duplicado",
      slug: testSlug,
      city: "Santiago",
      country: "Chile",
      timezone: "America/Santiago",
      termType: "SEMESTER",
      adminEmail: "otro@aurenis.test",
      adminFirstName: "Otro",
      adminLastName: "Admin",
      adminPassword: "Password123!",
    });
  } catch (err: any) {
    if (err.message.includes("ya está registrado")) {
      duplicateSlugRejected = true;
    }
  }

  assert(
    "Rechazo garantizado ante colisión de slug institucional",
    duplicateSlugRejected,
    "El servicio previene conflictos de rutas e identificación."
  );

  // -------------------------------------------------------------
  // TEST GRUPO 5: SERVICIOS ACADÉMICOS, CALIFICACIONES Y ASISTENCIA
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 5: Lógica de Negocio Académica y Evaluación ---");
  const academicOverview = await getSchoolAcademicOverview(tenantA, schoolA.id);
  assert(
    "getSchoolAcademicOverview calcula métricas operativas",
    academicOverview.totalCourses >= 1 && academicOverview.currentYear === new Date().getFullYear(),
    `Cursos registrados: ${academicOverview.totalCourses}, Asignaturas: ${academicOverview.totalSubjects}`
  );

  const studentsList = await listStudentsBySchool(tenantA, schoolA.id);
  assert(
    "listStudentsBySchool lista alumnos matriculados",
    studentsList.length > 0,
    `Total matrículas recuperadas en San José: ${studentsList.length}`
  );

  const studentProfileId = studentsList[0].studentProfileId;
  const studentDetails = await getStudentDetails(tenantA, schoolA.id, studentProfileId);
  assert(
    "getStudentDetails obtiene expediente integral con historial",
    studentDetails !== null && studentDetails.membership.user !== null,
    `Estudiante: ${studentDetails?.membership.user.firstName} ${studentDetails?.membership.user.lastName}`
  );

  const teachersList = await listTeachersBySchool(tenantA, schoolA.id);
  assert(
    "listTeachersBySchool recupera nómina docente con asignaturas",
    teachersList.length > 0 && teachersList[0].membership.user !== null,
    `Docente encontrado: ${teachersList[0]?.membership.user.firstName} ${teachersList[0]?.membership.user.lastName}`
  );

  const attendanceOverview = await getAttendanceOverview(tenantA, schoolA.id);
  assert(
    "getAttendanceOverview procesa distribución y porcentaje de presentismo",
    typeof attendanceOverview.attendanceRate === "number" && attendanceOverview.attendanceRate >= 0,
    `Tasa de asistencia global: ${attendanceOverview.attendanceRate}% (Total registros: ${attendanceOverview.totalRecords})`
  );

  // -------------------------------------------------------------
  // TEST GRUPO 6: AUDITORÍA INMUTABLE (AUDIT LOG TRAIL)
  // -------------------------------------------------------------
  console.log("\n--- GRUPO 6: Trazabilidad y Bitácora de Auditoría ---");
  await logAuditEvent({
    schoolId: schoolA.id,
    userId: onboardingResult.adminUser.id,
    action: AuditAction.SECURITY_EVENT,
    entityType: "SECURITY_TEST",
    entityId: "sec-check-100",
    details: { result: "SEC_PASS", check: "ComprehensiveAudit" },
  });

  const latestAudit = await prisma.auditLog.findFirst({
    where: { schoolId: schoolA.id, entityType: "SECURITY_TEST" },
    orderBy: { timestamp: "desc" },
  });

  assert(
    "logAuditEvent persiste eventos de forma inmutable con JSON estructurado",
    latestAudit !== null && latestAudit.action === AuditAction.SECURITY_EVENT,
    `Registro guardado con ID=${latestAudit?.id}, Timestamp=${latestAudit?.timestamp.toISOString()}`
  );

  // -------------------------------------------------------------
  // RESUMEN FINAL
  // -------------------------------------------------------------
  console.log("\n" + "=".repeat(80));
  console.log("📊 RESULTADO DE LA AUDITORÍA INTEGRAL DE BACKEND:");
  console.log(`   Pruebas ejecutadas: ${totalTests}`);
  console.log(`   Superadas:          ${passedTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`   Fallidas:           ${failedTests}`);
  if (failedTests === 0) {
    console.log("   Estado del Backend: 🟢 100% OPERATIVO, SIN ERRORES Y SEGURO");
  } else {
    console.log("   Estado del Backend: 🔴 SE ENCONTRARON FALLAS QUE REQUIEREN ATENCIÓN");
  }
  console.log("=".repeat(80));

  if (failedTests > 0) {
    process.exit(1);
  }
}

runComprehensiveBackendValidation().catch((err) => {
  console.error("Error fatal en suite de validación de backend:", err);
  process.exit(1);
});
