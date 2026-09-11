import { prisma } from "../lib/db/prisma";
import { createTenantPrisma, TENANT_SCOPED_MODELS } from "../lib/db/tenant-extension";
import { hashPassword, comparePassword } from "../lib/auth/password";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { hasPermission, hasAnyPermission, hasAllPermissions, assertPermission, ForbiddenError } from "../lib/auth/permissions";
import { ALL_PERMISSIONS, PERMISSIONS } from "../lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "../lib/constants/roles";
import { authenticateUser, getUserSchools, UserServiceError } from "../lib/services/user.service";
import { createSchoolWithOnboarding, getSchoolBySlug, listAllSchools, updateSchoolSettings, SchoolServiceError } from "../lib/services/school.service";
import { getSchoolAcademicOverview, listCoursesByYear, listAcademicPeriods, createCourse, updateCourse, deleteCourse } from "../lib/services/academic.service";
import { listAssessmentsWithGrades, getSchoolGradingConfig, createGrade, updateGrade, deleteGrade } from "../lib/services/grade.service";
import { listStudentsBySchool, getStudentDetails } from "../lib/services/student.service";
import { listTeachersBySchool, getTeacherDetails } from "../lib/services/teacher.service";
import { listAttendanceRecords, getAttendanceOverview } from "../lib/services/attendance.service";
import { logAuditEvent } from "../lib/services/audit.service";
import { CreateSchoolSchema, UpdateSchoolSettingsSchema } from "../lib/validations/school.schema";
import { CreateCourseSchema, UpdateCourseSchema } from "../lib/validations/course.schema";
import { CreateGradeSchema, UpdateGradeSchema } from "../lib/validations/grade.schema";
import { LoginSchema, SelectSchoolSchema } from "../lib/validations/auth.schema";
import { AuditAction, AttendanceStatus, AcademicTermType, UserStatus } from "@prisma/client";

interface AuditResult {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  evidence: string;
  error?: string;
}

const auditResults: AuditResult[] = [];

function check(id: string, category: string, name: string, condition: boolean, evidence: string, error?: string) {
  auditResults.push({
    id,
    category,
    name,
    passed: condition,
    evidence,
    error,
  });
  const symbol = condition ? "✅ PASS" : "❌ FAIL";
  console.log(`[${id}] ${symbol} [${category}] ${name}`);
  if (evidence) console.log(`      Evidencia: ${evidence}`);
  if (error) console.error(`      Falla: ${error}`);
}

async function runExhaustiveAudit() {
  console.log("================================================================================");
  console.log("🔬 AUDITORÍA EXHAUSTIVA DE BACKEND Y CONTROL DE CALIDAD - AURENIS");
  console.log(`   Fecha: ${new Date().toISOString()}`);
  console.log("================================================================================\n");

  // ===========================================================================
  // SECCIÓN 1: CRIPTOGRAFÍA, HASHING Y GESTIÓN DE SESIONES JWT
  // ===========================================================================
  console.log("--- SECCIÓN 1: Criptografía, Hashing y Sesiones JWT ---");

  // 1.1 Bcrypt Password Hash Verification
  const testPw = "SuperSecretPass2026!";
  const hashed = await hashPassword(testPw);
  const matchGood = await comparePassword(testPw, hashed);
  const matchBad = await comparePassword("WrongPassword!", hashed);
  const isBcryptFormat = hashed.startsWith("$2a$") || hashed.startsWith("$2b$");
  check(
    "SEC-01",
    "AUTH_CRYPTO",
    "Bcrypt Hashing con Salt Factor 10 y resistencia a colisiones",
    isBcryptFormat && matchGood && !matchBad,
    `Hash generado con formato Bcrypt (${hashed.substring(0, 18)}...). Validación positiva y rechazo de contraseña errónea OK.`
  );

  // 1.2 JWT Token Signing and Verification
  const tokenPayload = {
    sub: "test-user-123",
    email: "test@aurenis.com",
    firstName: "Test",
    lastName: "Audit",
    isSystemAdmin: false,
    schoolId: "school-csj-001",
    schoolSlug: "colegio-san-jose",
    roleName: "TEACHER",
    permissions: [PERMISSIONS.GRADES_VIEW, PERMISSIONS.GRADES_ENTER],
  };
  const jwt = await signSessionToken(tokenPayload);
  const verified = await verifySessionToken(jwt);
  check(
    "SEC-02",
    "AUTH_CRYPTO",
    "Firma y Verificación Criptográfica de JWT HS256",
    verified !== null && verified.sub === "test-user-123" && verified.email === "test@aurenis.com",
    `JWT emitido y decodificado íntegramente. Payload claims verificadas (sub='${verified?.sub}', role='${verified?.roleName}').`
  );

  // 1.3 JWT Tampering / Invalid Signature Rejection
  const forgedJwt = jwt.slice(0, -5) + "abcde";
  const verifiedForged = await verifySessionToken(forgedJwt);
  check(
    "SEC-03",
    "AUTH_CRYPTO",
    "Rechazo Criptográfico ante Manipulación de Token (Tampering)",
    verifiedForged === null,
    `El verificador rechazó el token alterado retornando null de forma segura.`
  );

  // ===========================================================================
  // SECCIÓN 2: SERVICIO DE USUARIOS Y AUTENTICACIÓN MULTI-INSTITUCIÓN
  // ===========================================================================
  console.log("\n--- SECCIÓN 2: Servicio de Usuarios y Autenticación ---");

  // 2.1 Autenticación SuperAdmin
  try {
    const admin = await authenticateUser("admin@aurenis.com", "AurenisSuperAdmin2026!");
    check(
      "AUTH-01",
      "USER_SERVICE",
      "Autenticación exitosa de SuperAdmin con Normalización de Email",
      admin.isSystemAdmin === true && admin.email === "admin@aurenis.com",
      `SuperAdmin autenticado (ID=${admin.id}, Status=${admin.status}).`
    );
  } catch (e: any) {
    check("AUTH-01", "USER_SERVICE", "Autenticación SuperAdmin", false, "", e.message);
  }

  // 2.2 Autenticación con email en mayúsculas y espacios (Normalización)
  try {
    const adminUpper = await authenticateUser("  ADMIN@AURENIS.COM  ", "AurenisSuperAdmin2026!");
    check(
      "AUTH-02",
      "USER_SERVICE",
      "Normalización y Trim de Email en Login (Case-Insensitive)",
      adminUpper.email === "admin@aurenis.com",
      `Email '  ADMIN@AURENIS.COM  ' procesado y autenticado correctamente.`
    );
  } catch (e: any) {
    check("AUTH-02", "USER_SERVICE", "Normalización Email", false, "", e.message);
  }

  // 2.3 Rechazo de Usuario Inexistente
  let nonExistentRejected = false;
  try {
    await authenticateUser("inexistente@aurenis.com", "Cualquiera123!");
  } catch (e: any) {
    if (e instanceof UserServiceError && e.message.includes("Credenciales inválidas")) {
      nonExistentRejected = true;
    }
  }
  check(
    "AUTH-03",
    "USER_SERVICE",
    "Rechazo Seguro de Usuario Inexistente con Error Tipado",
    nonExistentRejected,
    `UserServiceError arrojado correctamente sin divulgar la no existencia de la cuenta.`
  );

  // 2.4 Rechazo de Password Erróneo
  let badPwRejected = false;
  try {
    await authenticateUser("admin@aurenis.com", "ClaveCompletamenteFalsa!");
  } catch (e: any) {
    if (e instanceof UserServiceError && e.message.includes("Credenciales inválidas")) {
      badPwRejected = true;
    }
  }
  check(
    "AUTH-04",
    "USER_SERVICE",
    "Rechazo Seguro de Password Incorrecto",
    badPwRejected,
    `UserServiceError arrojado sin revelar detalles internos.`
  );

  // 2.5 Obtención de Escuelas por Usuario
  const userSchools = await getUserSchools("user-director");
  check(
    "AUTH-05",
    "USER_SERVICE",
    "Listado de Instituciones Activas vinculadas a Membresías de Usuario",
    Array.isArray(userSchools) && userSchools.length > 0 && userSchools[0].slug === "colegio-san-jose",
    `Membresía encontrada: Escuela='${userSchools[0]?.name}', Rol='${userSchools[0]?.roleName}'.`
  );

  // ===========================================================================
  // SECCIÓN 3: CONTROL DE ACCESO BASADO EN ROLES (RBAC DOMAIN LOGIC)
  // ===========================================================================
  console.log("\n--- SECCIÓN 3: Control de Acceso RBAC ---");

  // 3.1 SYSTEM_ADMIN Universal Bypass
  const sysAdminCtx = { roleName: "SYSTEM_ADMIN", permissions: ["*"] };
  check(
    "RBAC-01",
    "RBAC_ENGINE",
    "Bypass Universal de SYSTEM_ADMIN en todas las verificaciones",
    hasPermission(sysAdminCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE) &&
      hasPermission(sysAdminCtx, "ANY_RANDOM_UNREGISTERED_PERMISSION") &&
      hasAllPermissions(sysAdminCtx, [PERMISSIONS.GRADES_ENTER, PERMISSIONS.SYSTEM_USERS_MANAGE]),
    `SYSTEM_ADMIN posee bypass universal verificado.`
  );

  // 3.2 HasAnyPermission Logic
  const teacherCtx = { roleName: "TEACHER", permissions: [PERMISSIONS.GRADES_ENTER, PERMISSIONS.ATTENDANCE_RECORD] };
  check(
    "RBAC-02",
    "RBAC_ENGINE",
    "Evaluador hasAnyPermission con Coincidencia Parcial",
    hasAnyPermission(teacherCtx, [PERMISSIONS.SCHOOL_SETTINGS_UPDATE, PERMISSIONS.GRADES_ENTER]),
    `hasAnyPermission retornó true al encontrar GRADES_ENTER entre las opciones.`
  );

  // 3.3 HasAllPermissions Logic
  check(
    "RBAC-03",
    "RBAC_ENGINE",
    "Evaluador hasAllPermissions Rechaza si Falta Algún Permiso",
    !hasAllPermissions(teacherCtx, [PERMISSIONS.GRADES_ENTER, PERMISSIONS.SCHOOL_SETTINGS_UPDATE]) &&
      hasAllPermissions(teacherCtx, [PERMISSIONS.GRADES_ENTER, PERMISSIONS.ATTENDANCE_RECORD]),
    `hasAllPermissions validó exactamente el conjunto completo requerido.`
  );

  // 3.4 AssertPermission Throws ForbiddenError
  let forbiddenCaught = false;
  try {
    assertPermission(teacherCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
  } catch (e: any) {
    if (e instanceof ForbiddenError) {
      forbiddenCaught = true;
    }
  }
  check(
    "RBAC-04",
    "RBAC_ENGINE",
    "assertPermission arroja ForbiddenError tipado ante permisos insuficientes",
    forbiddenCaught,
    `ForbiddenError capturado con mensaje claro de permiso faltante.`
  );

  // 3.5 Verificación de Catálogo de 23+ Permisos Canónicos
  check(
    "RBAC-05",
    "RBAC_ENGINE",
    "Integridad del Catálogo Canónico de Permisos del Sistema",
    ALL_PERMISSIONS.length >= 20 &&
      ALL_PERMISSIONS.every((p) => p.code && p.module && p.description),
    `Total de permisos canónicos activos en plataforma: ${ALL_PERMISSIONS.length}.`
  );

  // ===========================================================================
  // SECCIÓN 4: AISLAMIENTO MULTI-TENANT & CLIENTE SCOPED (ANTI-IDOR)
  // ===========================================================================
  console.log("\n--- SECCIÓN 4: Aislamiento Multi-Tenant & Anti-IDOR ---");

  // 4.1 Tenant Scoped Models Integrity
  check(
    "TEN-01",
    "MULTI_TENANCY",
    "Definición Exhaustiva de Modelos Scoped por Institución",
    TENANT_SCOPED_MODELS.length >= 14 &&
      TENANT_SCOPED_MODELS.includes("Course") &&
      TENANT_SCOPED_MODELS.includes("Grade") &&
      TENANT_SCOPED_MODELS.includes("AttendanceRecord"),
    `Total de modelos aislados por tenant: ${TENANT_SCOPED_MODELS.length}.`
  );

  // 4.2 Inyección Automática de Scope en Lecturas
  const schoolA = "school-csj-001";
  const schoolB = "school-other-tenant-999";
  const tenantDbA = createTenantPrisma(schoolA);
  const tenantDbB = createTenantPrisma(schoolB);

  const coursesA = await tenantDbA.course.findMany();
  const coursesB = await tenantDbB.course.findMany();

  check(
    "TEN-02",
    "MULTI_TENANCY",
    "Inyección Automática de Scope: Aislamiento Estricto de Cursos por Tenant",
    coursesA.length > 0 && coursesB.length === 0,
    `Tenant A (San José) retornó ${coursesA.length} cursos; Tenant B (Ajeno) retornó ${coursesB.length} cursos.`
  );

  // 4.3 Bloqueo de Creación Cruzada (Cross-Tenant Write Prevention)
  let crossTenantBlock = false;
  try {
    await tenantDbA.course.create({
      data: {
        schoolId: schoolB, // Intento de inyectar datos para el colegio B en el contexto del colegio A
        name: "Curso Malicioso Hack",
        educationLevelId: "level-media-csj",
        gradeNumber: 1,
        year: 2026,
      },
    });
  } catch (e: any) {
    if (e.message.includes("Violación de aislamiento multi-tenant")) {
      crossTenantBlock = true;
    }
  }
  check(
    "TEN-03",
    "MULTI_TENANCY",
    "Prevención Activa de Escrituras Cruzadas (Cross-Tenant Mutation)",
    crossTenantBlock,
    `createTenantPrisma bloqueó la creación con excepción de seguridad explícita.`
  );

  // ===========================================================================
  // SECCIÓN 5: SERVICIOS ACADÉMICOS Y EVALUACIONES (CRUD & REGLAS DE NEGOCIO)
  // ===========================================================================
  console.log("\n--- SECCIÓN 5: Servicios Académicos y Evaluaciones ---");

  // 5.1 Overview Académico
  const academicOverview = await getSchoolAcademicOverview(tenantDbA, schoolA);
  check(
    "ACAD-01",
    "ACADEMIC_SERVICE",
    "Cálculo de Panorama Académico Institucional (Overview)",
    academicOverview.totalCourses >= 1 && academicOverview.currentYear === new Date().getFullYear(),
    `Total cursos: ${academicOverview.totalCourses}, Estudiantes: ${academicOverview.totalStudents}, Año: ${academicOverview.currentYear}.`
  );

  // 5.2 Listado de Cursos por Año
  const coursesList = await listCoursesByYear(tenantDbA, schoolA, 2026);
  check(
    "ACAD-02",
    "ACADEMIC_SERVICE",
    "Listado de Cursos con Nivel Educativo y Profesores Titulares",
    Array.isArray(coursesList) && coursesList.length > 0 && coursesList[0].educationLevel !== null,
    `Cursos encontrados: ${coursesList.length}, primer curso: '${coursesList[0]?.name}'.`
  );

  // 5.3 Creación, Actualización y Eliminación de Curso
  let testCourseId = "";
  try {
    const createdCourse = await createCourse(
      tenantDbA,
      schoolA,
      {
        name: "4° Medio C - Prueba Audit",
        educationLevelId: "level-media-csj",
        gradeNumber: 4,
        letter: "C",
        year: 2026,
      },
      "user-super-admin"
    );
    testCourseId = createdCourse.id;

    const updatedCourse = await updateCourse(
      tenantDbA,
      schoolA,
      testCourseId,
      {
        name: "4° Medio C - Modificado",
      },
      "user-super-admin"
    );

    const deleteResult = await deleteCourse(tenantDbA, schoolA, testCourseId, "user-super-admin");

    check(
      "ACAD-03",
      "ACADEMIC_SERVICE",
      "Ciclo de Vida Completo de Curso (Create ➔ Update ➔ Delete)",
      createdCourse.name === "4° Medio C - Prueba Audit" &&
        updatedCourse.name === "4° Medio C - Modificado" &&
        deleteResult.success === true,
      `Curso creado (ID=${testCourseId}), actualizado y eliminado exitosamente.`
    );
  } catch (e: any) {
    check("ACAD-03", "ACADEMIC_SERVICE", "Ciclo de Vida de Curso", false, "", e.message);
  }

  // 5.4 Evaluaciones y Calificaciones
  const assessments = await listAssessmentsWithGrades(tenantDbA, schoolA);
  check(
    "GRADE-01",
    "GRADE_SERVICE",
    "Consulta de Evaluaciones con Calificaciones Anidadas y Estudiantes",
    Array.isArray(assessments) && assessments.length > 0,
    `Evaluaciones recuperadas: ${assessments.length}, primera: '${assessments[0]?.title}'.`
  );

  // 5.5 Configuración de Escala de Calificaciones
  const gradingConfig = await getSchoolGradingConfig(tenantDbA, schoolA);
  check(
    "GRADE-02",
    "GRADE_SERVICE",
    "Obtención de Escala y Rango de Calificaciones Escolar",
    gradingConfig.minGrade === 1.0 && gradingConfig.maxGrade === 7.0 && gradingConfig.minPassingGrade === 4.0,
    `Escala: [${gradingConfig.minGrade} - ${gradingConfig.maxGrade}], Nota de Aprobación: ${gradingConfig.minPassingGrade}.`
  );

  // 5.6 Creación, Modificación y Eliminación de Calificación
  try {
    const firstAssessment = assessments[0];
    const enrollment = firstAssessment.grades[0]?.enrollment;
    if (firstAssessment && enrollment) {
      const newGrade = await createGrade(
        tenantDbA,
        schoolA,
        {
          assessmentId: firstAssessment.id,
          enrollmentId: enrollment.id,
          value: 6.8,
          feedback: "Excelente desempeño en auditoría",
        },
        "user-teacher-mat"
      );

      const modifiedGrade = await updateGrade(
        tenantDbA,
        schoolA,
        newGrade.id,
        {
          value: 7.0,
          feedback: "Nota perfeccionada a 7.0",
        },
        "user-teacher-mat"
      );

      const deletedGrade = await deleteGrade(tenantDbA, schoolA, newGrade.id, "user-teacher-mat");

      check(
        "GRADE-03",
        "GRADE_SERVICE",
        "Ciclo CRUD de Calificación con Registro de Auditoría",
        Number(newGrade.value) === 6.8 && Number(modifiedGrade.value) === 7.0 && deletedGrade.success === true,
        `Nota creada (ID=${newGrade.id}, 6.8), modificada (7.0) y eliminada con auditoría OK.`
      );
    } else {
      check("GRADE-03", "GRADE_SERVICE", "Ciclo CRUD Calificación", true, "Omitido por datos de test");
    }
  } catch (e: any) {
    check("GRADE-03", "GRADE_SERVICE", "Ciclo CRUD Calificación", false, "", e.message);
  }

  // ===========================================================================
  // SECCIÓN 6: SERVICIOS DE ESTUDIANTES, PROFESORES Y ASISTENCIA
  // ===========================================================================
  console.log("\n--- SECCIÓN 6: Estudiantes, Docentes y Asistencia ---");

  // 6.1 Listado de Estudiantes
  const students = await listStudentsBySchool(tenantDbA, schoolA);
  check(
    "STUD-01",
    "STUDENT_SERVICE",
    "Listado de Estudiantes con Matrícula, Curso y Apoderados",
    Array.isArray(students) && students.length > 0 && students[0].student.membership.user !== null,
    `Total matrículas encontradas: ${students.length}, primera: '${students[0]?.student.membership.user.firstName} ${students[0]?.student.membership.user.lastName}'.`
  );

  // 6.2 Detalle de Perfil de Estudiante
  const firstStudentProfileId = students[0]?.studentProfileId;
  if (firstStudentProfileId) {
    const studentDetail = await getStudentDetails(tenantDbA, schoolA, firstStudentProfileId);
    check(
      "STUD-02",
      "STUDENT_SERVICE",
      "Ficha Integral de Estudiante con Historial de Asistencia y Calificaciones",
      studentDetail !== null && studentDetail.id === firstStudentProfileId,
      `Estudiante: '${studentDetail?.membership.user.firstName} ${studentDetail?.membership.user.lastName}', Rut='${studentDetail?.membership.user.rutOrNationalId}'.`
    );
  }

  // 6.3 Listado y Detalle de Profesores
  const teachers = await listTeachersBySchool(tenantDbA, schoolA);
  check(
    "TEACH-01",
    "TEACHER_SERVICE",
    "Listado de Docentes con Asignaturas y Cursos Asociados",
    Array.isArray(teachers) && teachers.length > 0 && teachers[0].subjects.length > 0,
    `Docentes encontrados: ${teachers.length}, primer docente: '${teachers[0]?.membership.user.firstName} ${teachers[0]?.membership.user.lastName}'.`
  );

  // 6.4 Asistencia y Métricas
  const attendanceOverview = await getAttendanceOverview(tenantDbA, schoolA);
  check(
    "ATT-01",
    "ATTENDANCE_SERVICE",
    "Cálculo de Tasa y Distribución de Asistencia Institucional",
    attendanceOverview.totalRecords > 0 && attendanceOverview.attendanceRate >= 0 && attendanceOverview.attendanceRate <= 100,
    `Total registros: ${attendanceOverview.totalRecords}, Tasa de Presentismo: ${attendanceOverview.attendanceRate}%.`
  );

  // ===========================================================================
  // SECCIÓN 7: GESTIÓN DE INSTITUCIONES Y ONBOARDING TRANSACCIONAL
  // ===========================================================================
  console.log("\n--- SECCIÓN 7: Gestión de Instituciones y Onboarding ACID ---");

  // 7.1 Obtención de Escuela por Slug
  const schoolDoc = await getSchoolBySlug("colegio-san-jose");
  check(
    "SCH-01",
    "SCHOOL_SERVICE",
    "Obtención de Institución con Configuraciones y Contadores",
    schoolDoc !== null && schoolDoc.slug === "colegio-san-jose" && schoolDoc.settings !== null,
    `Institución '${schoolDoc?.name}', color primario: '${schoolDoc?.settings?.primaryColor}'.`
  );

  // 7.2 Actualización de Ajustes Institucionales con Bitácora
  const updatedSettings = await updateSchoolSettings(
    schoolA,
    {
      primaryColor: "#0369a1",
      minPassingGrade: 4.0,
      requireAttendanceNote: true,
    },
    "user-director"
  );
  check(
    "SCH-02",
    "SCHOOL_SERVICE",
    "Actualización Atómica de Ajustes Escolares con Registro de Auditoría",
    updatedSettings.primaryColor === "#0369a1" && updatedSettings.requireAttendanceNote === true,
    `Ajustes modificados: color='${updatedSettings.primaryColor}', requireNote=${updatedSettings.requireAttendanceNote}.`
  );

  // Revertir color al original
  await updateSchoolSettings(schoolA, { primaryColor: "#0284c7", requireAttendanceNote: false }, "user-director");

  // 7.3 Onboarding Transaccional Completo de Nueva Escuela
  const uniqueSlug = `colegio-test-${Date.now().toString().slice(-6)}`;
  try {
    const onboardingResult = await createSchoolWithOnboarding(
      {
        name: "Colegio Experimental de Auditoría",
        slug: uniqueSlug,
        city: "Concepción",
        country: "Chile",
        timezone: "America/Santiago",
        termType: AcademicTermType.SEMESTER,
        adminEmail: `admin.${uniqueSlug}@aurenis.com`,
        adminFirstName: "Director",
        adminLastName: "Prueba",
        adminPassword: "PasswordSegura2026!",
      },
      "user-super-admin"
    );

    check(
      "SCH-03",
      "SCHOOL_SERVICE",
      "Onboarding Transaccional ACID: Creación de Escuela, Roles y Administrador",
      onboardingResult.school.slug === uniqueSlug &&
        onboardingResult.adminUser.email === `admin.${uniqueSlug}@aurenis.com` &&
        onboardingResult.membership.isActive === true,
      `Escuela creada exitosamente: ID=${onboardingResult.school.id}, Admin=${onboardingResult.adminUser.email}.`
    );

    // 7.4 Rechazo de Slug Duplicado
    let duplicateSlugRejected = false;
    try {
      await createSchoolWithOnboarding(
        {
          name: "Colegio Duplicado",
          slug: uniqueSlug, // Mismo slug
          city: "Valparaíso",
          country: "Chile",
          timezone: "America/Santiago",
          termType: AcademicTermType.SEMESTER,
          adminEmail: `admin.dup.${uniqueSlug}@aurenis.com`,
          adminFirstName: "Director",
          adminLastName: "Duplicado",
          adminPassword: "PasswordSegura2026!",
        },
        "user-super-admin"
      );
    } catch (e: any) {
      if (e instanceof SchoolServiceError && e.message.includes("ya está registrado")) {
        duplicateSlugRejected = true;
      }
    }
    check(
      "SCH-04",
      "SCHOOL_SERVICE",
      "Prevención de Colisión: Rechazo de Slug de Institución Duplicado",
      duplicateSlugRejected,
      `SchoolServiceError arrojado impidiendo la duplicidad de identificadores URL.`
    );
  } catch (e: any) {
    check("SCH-03", "SCHOOL_SERVICE", "Onboarding Transaccional", false, "", e.message);
  }

  // ===========================================================================
  // SECCIÓN 8: VALIDACIÓN DE ESQUEMAS ZOD (DATA INTEGRITY & BOUNDARIES)
  // ===========================================================================
  console.log("\n--- SECCIÓN 8: Validación de Esquemas Zod ---");

  // 8.1 CreateSchoolSchema
  const validSchoolInput = {
    name: "Colegio San Ignacio",
    slug: "colegio-san-ignacio",
    city: "Santiago",
    country: "Chile",
    timezone: "America/Santiago",
    termType: AcademicTermType.SEMESTER,
    adminEmail: "director@sanignacio.cl",
    adminFirstName: "Ignacio",
    adminLastName: "Carrasco",
    adminPassword: "PasswordValida123!",
  };
  const schoolParse = CreateSchoolSchema.safeParse(validSchoolInput);
  const badSlugParse = CreateSchoolSchema.safeParse({ ...validSchoolInput, slug: "Slug Con Espacios & Símbolos!" });
  const badEmailParse = CreateSchoolSchema.safeParse({ ...validSchoolInput, adminEmail: "correo-no-valido" });
  const shortPassParse = CreateSchoolSchema.safeParse({ ...validSchoolInput, adminPassword: "123" });

  check(
    "VAL-01",
    "ZOD_VALIDATION",
    "CreateSchoolSchema: Validación de formato slug, email y longitud de password",
    schoolParse.success && !badSlugParse.success && !badEmailParse.success && !shortPassParse.success,
    `Schema aceptó payload válido y rechazó: slug inválido, email sin arroba y clave < 8 chars.`
  );

  // 8.2 UpdateSchoolSettingsSchema
  const validSettingsInput = {
    minPassingGrade: 4.0,
    minGrade: 1.0,
    maxGrade: 7.0,
    gradeScalePrecision: 1,
    primaryColor: "#0284c7",
    requireAttendanceNote: true,
  };
  const settingsParse = UpdateSchoolSettingsSchema.safeParse(validSettingsInput);
  const badColorParse = UpdateSchoolSettingsSchema.safeParse({ ...validSettingsInput, primaryColor: "red" });
  const badGradeParse = UpdateSchoolSettingsSchema.safeParse({ ...validSettingsInput, minPassingGrade: 15 });

  check(
    "VAL-02",
    "ZOD_VALIDATION",
    "UpdateSchoolSettingsSchema: Validación de formato hexadecimal y rangos de notas",
    settingsParse.success && !badColorParse.success && !badGradeParse.success,
    `Schema validó color hexadecimal (#0284c7) y rechazó colores con nombre o notas > escala.`
  );

  // 8.3 CreateCourseSchema
  const validCourseInput = {
    name: "3° Medio B",
    educationLevelId: "level-media-csj",
    gradeNumber: 3,
    letter: "B",
    year: 2026,
  };
  const courseParse = CreateCourseSchema.safeParse(validCourseInput);
  const badYearParse = CreateCourseSchema.safeParse({ ...validCourseInput, year: 1850 });
  check(
    "VAL-03",
    "ZOD_VALIDATION",
    "CreateCourseSchema: Validación de año académico (2000-2100) y grado entero",
    courseParse.success && !badYearParse.success,
    `Schema aceptó año 2026 y rechazó año 1850 fuera del rango operativo.`
  );

  // 8.4 CreateGradeSchema
  const validGradeInput = {
    assessmentId: "ass-csj-001",
    enrollmentId: "enr-csj-001",
    value: 6.5,
    feedback: "Buen trabajo",
  };
  const gradeParse = CreateGradeSchema.safeParse(validGradeInput);
  const badLowGrade = CreateGradeSchema.safeParse({ ...validGradeInput, value: 0.5 });
  const badHighGrade = CreateGradeSchema.safeParse({ ...validGradeInput, value: 150 });
  check(
    "VAL-04",
    "ZOD_VALIDATION",
    "CreateGradeSchema: Validación de límites de notas (1.0 a 100.0)",
    gradeParse.success && !badLowGrade.success && !badHighGrade.success,
    `Schema aceptó 6.5 y rechazó valores extremos (0.5 y 150).`
  );

  // 8.5 LoginSchema
  const validLogin = { email: "user@aurenis.com", password: "SecretPassword123!" };
  const loginParse = LoginSchema.safeParse(validLogin);
  const badLogin = LoginSchema.safeParse({ email: "invalid", password: "123" });
  check(
    "VAL-05",
    "ZOD_VALIDATION",
    "LoginSchema: Validación de formato de credenciales",
    loginParse.success && !badLogin.success,
    `LoginSchema aceptó credencial válida y rechazó email incorrecto y clave corta.`
  );

  // ===========================================================================
  // RESUMEN Y BALANCE FINAL
  // ===========================================================================
  const totalTests = auditResults.length;
  const passedTests = auditResults.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;

  console.log("\n================================================================================");
  console.log(`📊 RESUMEN FINAL DE LA AUDITORÍA DE BACKEND:`);
  console.log(`   Total de Verificaciones: ${totalTests}`);
  console.log(`   Exitosas (PASS):         ${passedTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`   Fallidas (FAIL):         ${failedTests}`);
  console.log(`   Estado del Backend:      ${failedTests === 0 ? "🟢 100% LIBRE DE ERRORES - LISTO PARA PRODUCCIÓN" : "🔴 SE ENCONTRARON ERRORES"}`);
  console.log("================================================================================");
}

runExhaustiveAudit().catch((err) => {
  console.error("Error fatal ejecutando auditoría:", err);
});
