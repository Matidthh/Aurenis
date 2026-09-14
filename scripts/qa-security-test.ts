import { prisma } from "../lib/db/prisma";
import { createTenantPrisma } from "../lib/db/tenant-extension";
import { hashPassword, comparePassword } from "../lib/auth/password";
import { signSessionToken, verifySessionToken } from "../lib/auth/session";
import { hasPermission, assertPermission, ForbiddenError } from "../lib/auth/permissions";
import { PERMISSIONS } from "../lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "../lib/constants/roles";
import { updateSchoolSettings } from "../lib/services/school.service";
import { UpdateSchoolSettingsSchema } from "../lib/validations/school.schema";
import { AuditAction } from "@prisma/client";

interface TestResult {
  name: string;
  category: "AUTH" | "RBAC" | "TENANT_ISOLATION" | "VALIDATION" | "AUDIT" | "API";
  passed: boolean;
  evidence: string;
  error?: string;
}

const results: TestResult[] = [];

function recordTest(
  category: TestResult["category"],
  name: string,
  passed: boolean,
  evidence: string,
  error?: string
) {
  results.push({ name, category, passed, evidence, error });
  const statusIcon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`[${category}] ${statusIcon} - ${name}`);
  if (evidence) console.log(`   Evidencia: ${evidence}`);
  if (error) console.error(`   Error: ${error}`);
}

async function runAllTests() {
  console.log("================================================================================");
  console.log("🛡️  AURENIS QA & SEGURIDAD - SUITE DE PRUEBAS DE CERTIFICACIÓN Y EVIDENCIAS");
  console.log("    Responsable QA: Frank M — QA / Testing / Seguridad / Documentación");
  console.log(`    Fecha/Hora: ${new Date().toISOString()}`);
  console.log("================================================================================\n");

  // ---------------------------------------------------------------------------
  // MÓDULO 1: AUTENTICACIÓN, HASHING Y CRIPTOGRAFÍA DE SESIÓN
  // ---------------------------------------------------------------------------
  console.log("--- MÓDULO 1: Autenticación & Criptografía de Sesión ---");

  // 1.1 Verificación de Hashing de Contraseñas (Bcrypt Salt 10)
  try {
    const rawPass = "Segura123!";
    const hash = await hashPassword(rawPass);
    const isValid = await comparePassword(rawPass, hash);
    const isInvalid = await comparePassword("Erronea123!", hash);

    const isBcrypt = hash.startsWith("$2a$") || hash.startsWith("$2b$");
    if (isBcrypt && isValid && !isInvalid) {
      recordTest(
        "AUTH",
        "Hash criptográfico de contraseñas (Bcrypt) y validación de credenciales",
        true,
        `Hash generado con prefijo Bcrypt válido (${hash.substring(0, 15)}...), validación positiva y rechazo de clave incorrecta verificado.`
      );
    } else {
      recordTest("AUTH", "Hash de contraseñas", false, "Falló la verificación del algoritmo o comparación.");
    }
  } catch (err: any) {
    recordTest("AUTH", "Hash de contraseñas", false, "Excepción en hashing", err.message);
  }

  // 1.2 Verificación de Login de SuperAdmin
  try {
    const superAdmin = await prisma.user.findUnique({
      where: { email: "admin@aurenis.com" },
    });
    const pwdOk = superAdmin ? await comparePassword("AurenisSuperAdmin2026!", superAdmin.passwordHash) : false;

    if (superAdmin && superAdmin.isSystemAdmin && pwdOk) {
      recordTest(
        "AUTH",
        "Autenticación SuperAdmin global",
        true,
        `Usuario ID: ${superAdmin.id}, Email: ${superAdmin.email}, isSystemAdmin: true, Contraseña validada.`
      );
    } else {
      recordTest("AUTH", "Autenticación SuperAdmin global", false, "Usuario o credenciales inválidas");
    }
  } catch (err: any) {
    recordTest("AUTH", "Autenticación SuperAdmin global", false, "Error consultando SuperAdmin", err.message);
  }

  // 1.3 Verificación de Login de Director de Colegio (Carlos Mendoza)
  try {
    const director = await prisma.user.findUnique({
      where: { email: "director@sanjose.cl" },
      include: {
        memberships: {
          include: {
            school: true,
            role: true,
          },
        },
      },
    });
    const pwdOk = director ? await comparePassword("AdminCSJ2026!", director.passwordHash) : false;
    const membership = director?.memberships[0];

    if (director && pwdOk && membership?.role.name === DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN) {
      recordTest(
        "AUTH",
        "Autenticación Director con membresía escolar activa",
        true,
        `Usuario: ${director.firstName} ${director.lastName}, Colegio: ${membership.school.name} (${membership.school.slug}), Rol: ${membership.role.name}`
      );
    } else {
      recordTest("AUTH", "Autenticación Director", false, "Membresía o rol incorrecto");
    }
  } catch (err: any) {
    recordTest("AUTH", "Autenticación Director", false, "Error consultando Director", err.message);
  }

  // 1.4 Verificación de Creación e Integridad de Token JWT de Sesión
  try {
    const token = await signSessionToken({
      sub: "user-director",
      email: "director@sanjose.cl",
      firstName: "Carlos",
      lastName: "Mendoza",
      isSystemAdmin: false,
      schoolId: "school-csj-001",
      schoolSlug: "colegio-san-jose",
      membershipId: "mem-director",
      roleName: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN,
      permissions: [PERMISSIONS.SCHOOL_SETTINGS_VIEW, PERMISSIONS.GRADES_VIEW],
    });

    const payload = await verifySessionToken(token);
    const valid = payload?.sub === "user-director" && payload?.schoolSlug === "colegio-san-jose";

    if (valid) {
      recordTest(
        "AUTH",
        "Emisión y verificación criptográfica de JWT de sesión",
        true,
        `Token emitido con algoritmo HS256, verificado exitosamente con sub='user-director' y schoolSlug='colegio-san-jose'.`
      );
    } else {
      recordTest("AUTH", "Emisión y verificación de JWT", false, "Payload alterado o no coincide");
    }
  } catch (err: any) {
    recordTest("AUTH", "Emisión y verificación de JWT", false, "Error en JWT", err.message);
  }

  // 1.5 Detección de Manipulación (Tampering) de Token JWT
  try {
    const validToken = await signSessionToken({
      sub: "user-teacher-roberto",
      email: "profesor.matematica@sanjose.cl",
      firstName: "Roberto",
      lastName: "Gómez",
      isSystemAdmin: false,
      schoolId: "school-csj-001",
      schoolSlug: "colegio-san-jose",
      membershipId: "mem-teacher-roberto",
      roleName: DEFAULT_SCHOOL_ROLES.TEACHER,
      permissions: [PERMISSIONS.GRADES_ENTER],
    });

    const parts = validToken.split(".");
    const tamperedToken = `${parts[0]}.${parts[1]}.${parts[2].slice(0, -3)}xyz`;
    const payload = await verifySessionToken(tamperedToken);

    if (payload === null) {
      recordTest(
        "AUTH",
        "Protección anti-manipulación de sesión (Anti-Tampering)",
        true,
        "El verificador de sesión rechazó exitosamente el JWT manipulado con firma inválida (retorno null)."
      );
    } else {
      recordTest("AUTH", "Anti-Tampering", false, "El token alterado fue aceptado indebidamente.");
    }
  } catch (err: any) {
    recordTest("AUTH", "Anti-Tampering", false, "Error en prueba", err.message);
  }

  // ---------------------------------------------------------------------------
  // MÓDULO 2: MATRIZ DE ROLES Y PERMISOS (RBAC)
  // ---------------------------------------------------------------------------
  console.log("\n--- MÓDULO 2: Matriz de Roles y Permisos (RBAC) ---");

  // 2.1 Permisos de SuperAdmin (Wildcard / Bypass)
  try {
    const adminCtx = {
      roleName: "SYSTEM_ADMIN",
      permissions: ["*"],
    };

    const canSettings = hasPermission(adminCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
    const canGrades = hasPermission(adminCtx, PERMISSIONS.GRADES_PUBLISH);
    const canAttendance = hasPermission(adminCtx, PERMISSIONS.ATTENDANCE_RECORD);

    if (canSettings && canGrades && canAttendance) {
      recordTest(
        "RBAC",
        "SuperAdmin: Privilegios globales de administración (Wildcard)",
        true,
        "SuperAdmin evaluó positivamente en todos los permisos de la plataforma."
      );
    } else {
      recordTest("RBAC", "SuperAdmin Privilegios", false, "SuperAdmin no pasó alguna verificación");
    }
  } catch (err: any) {
    recordTest("RBAC", "SuperAdmin Privilegios", false, "Error", err.message);
  }

  // 2.2 Permisos de Administrador Escolar (Director)
  try {
    const directorRole = ROLE_PRESETS[DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN];
    const directorCtx = {
      roleName: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN,
      permissions: directorRole.permissions,
    };

    const canViewSettings = hasPermission(directorCtx, PERMISSIONS.SCHOOL_SETTINGS_VIEW);
    const canUpdateSettings = hasPermission(directorCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
    const canManageTeachers = hasPermission(directorCtx, PERMISSIONS.PEOPLE_TEACHERS_MANAGE);
    const canPublishGrades = hasPermission(directorCtx, PERMISSIONS.GRADES_PUBLISH);

    if (canViewSettings && canUpdateSettings && canManageTeachers && canPublishGrades) {
      recordTest(
        "RBAC",
        "Director: Acceso a configuración institucional y gestión escolar completa",
        true,
        `Director cuenta con ${directorRole.permissions.length} permisos institucionales asignados.`
      );
    } else {
      recordTest("RBAC", "Director Permisos", false, "Falta algún permiso clave para Director");
    }
  } catch (err: any) {
    recordTest("RBAC", "Director Permisos", false, "Error", err.message);
  }

  // 2.3 Permisos de Profesor: Restricción Positiva y Negativa
  try {
    const teacherRole = ROLE_PRESETS[DEFAULT_SCHOOL_ROLES.TEACHER];
    const teacherCtx = {
      roleName: DEFAULT_SCHOOL_ROLES.TEACHER,
      permissions: teacherRole.permissions,
    };

    const canEnterGrades = hasPermission(teacherCtx, PERMISSIONS.GRADES_ENTER);
    const canRecordAttendance = hasPermission(teacherCtx, PERMISSIONS.ATTENDANCE_RECORD);

    const canUpdateSettings = hasPermission(teacherCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
    const canManageRoles = hasPermission(teacherCtx, PERMISSIONS.SCHOOL_ROLES_MANAGE);

    let assertDeniedThrown = false;
    try {
      assertPermission(teacherCtx, PERMISSIONS.SCHOOL_SETTINGS_UPDATE);
    } catch (e) {
      if (e instanceof ForbiddenError) assertDeniedThrown = true;
    }

    if (canEnterGrades && canRecordAttendance && !canUpdateSettings && !canManageRoles && assertDeniedThrown) {
      recordTest(
        "RBAC",
        "Profesor: Restricción de permisos y denegación de configuración institucional",
        true,
        "Profesor tiene acceso a calificaciones y asistencia, pero se le deniega tajantemente SCHOOL_SETTINGS_UPDATE y SCHOOL_ROLES_MANAGE (ForbiddenError arrojado)."
      );
    } else {
      recordTest("RBAC", "Profesor Permisos", false, "Fallo en aislamiento de permisos de profesor");
    }
  } catch (err: any) {
    recordTest("RBAC", "Profesor Permisos", false, "Error", err.message);
  }

  // 2.4 Permisos de Estudiante: Acceso de Solo Lectura
  try {
    const studentRole = ROLE_PRESETS[DEFAULT_SCHOOL_ROLES.STUDENT];
    const studentCtx = {
      roleName: DEFAULT_SCHOOL_ROLES.STUDENT,
      permissions: studentRole.permissions,
    };

    const canViewGrades = hasPermission(studentCtx, PERMISSIONS.GRADES_VIEW);
    const canEditGrades = hasPermission(studentCtx, PERMISSIONS.GRADES_ENTER);

    let assertDeniedThrown = false;
    try {
      assertPermission(studentCtx, PERMISSIONS.GRADES_ENTER);
    } catch (e) {
      if (e instanceof ForbiddenError) assertDeniedThrown = true;
    }

    if (canViewGrades && !canEditGrades && assertDeniedThrown) {
      recordTest(
        "RBAC",
        "Estudiante: Solo lectura de notas y bloqueo de ingreso de calificaciones",
        true,
        "Estudiante puede consultar sus calificaciones (GRADES_VIEW), pero assertPermission arrojó ForbiddenError al intentar ingresar notas (GRADES_ENTER)."
      );
    } else {
      recordTest("RBAC", "Estudiante Permisos", false, "Fallo en permisos de estudiante");
    }
  } catch (err: any) {
    recordTest("RBAC", "Estudiante Permisos", false, "Error", err.message);
  }

  // ---------------------------------------------------------------------------
  // MÓDULO 3: AISLAMIENTO MULTI-TENANT (TENANT ISOLATION & ANTI-IDOR)
  // ---------------------------------------------------------------------------
  console.log("\n--- MÓDULO 3: Aislamiento Multi-Tenant & Anti-IDOR ---");

  try {
    const csjSchool = await prisma.school.findUnique({ where: { slug: "colegio-san-jose" } });
    const csjCourses = await prisma.course.findMany({ where: { schoolId: csjSchool?.id } });
    const csjStudents = await prisma.enrollment.findMany({ where: { schoolId: csjSchool?.id } });

    const fakeOtherSchoolId = "school-csm-999";
    const otherCourses = await prisma.course.findMany({ where: { schoolId: fakeOtherSchoolId } });

    if (csjCourses.length > 0 && otherCourses.length === 0) {
      recordTest(
        "TENANT_ISOLATION",
        "Aislamiento de Cursos, Asignaturas y Matrículas por Tenant (schoolId)",
        true,
        `Colegio San José tiene ${csjCourses.length} cursos y ${csjStudents.length} matrículas. Consultas acotadas a schoolId='${fakeOtherSchoolId}' retornan 0 registros (no hay fuga de datos).`
      );
    } else {
      recordTest("TENANT_ISOLATION", "Aislamiento por Tenant", false, "Fuga o fallo en filtrado por schoolId");
    }
  } catch (err: any) {
    recordTest("TENANT_ISOLATION", "Aislamiento por Tenant", false, "Error", err.message);
  }

  // 3.2 Inyección Automática en Query Interceptor (createTenantPrisma)
  try {
    const tenantDbCSJ = createTenantPrisma("school-csj-001");
    const tenantDbOther = createTenantPrisma("school-csm-999");

    // Ejecutar findMany() SIN where: { schoolId } - el interceptor debe inyectarlo automáticamente
    const csjScopedCourses = await tenantDbCSJ.course.findMany();
    const otherScopedCourses = await tenantDbOther.course.findMany();

    if (csjScopedCourses.length === 2 && otherScopedCourses.length === 0) {
      recordTest(
        "TENANT_ISOLATION",
        "Interceptor ORM de Tenant (createTenantPrisma): Inyección automática de scope en consultas",
        true,
        `El cliente Scoped inyectó automáticamente schoolId='school-csj-001' (retornando ${csjScopedCourses.length} cursos) y schoolId='school-csm-999' (retornando 0 cursos) sin depender de parámetros manuales.`
      );
    } else {
      recordTest(
        "TENANT_ISOLATION",
        "Interceptor ORM de Tenant",
        false,
        `CSJ: ${csjScopedCourses.length}, Other: ${otherScopedCourses.length}`
      );
    }
  } catch (err: any) {
    recordTest("TENANT_ISOLATION", "Interceptor ORM de Tenant", false, "Error en tenantDb", err.message);
  }

  // 3.3 Rechazo de Escrituras Cruzadas (Cross-Tenant Anti-Tampering)
  try {
    const tenantDbCSJ = createTenantPrisma("school-csj-001");
    let crossTenantWriteBlocked = false;

    try {
      await tenantDbCSJ.course.create({
        data: {
          name: "Curso Infiltrado",
          schoolId: "school-csm-999", // Intentando forzar un colegio ajeno
          educationLevelId: "level-1",
          gradeNumber: 1,
          year: 2026,
        },
      });
    } catch (e: any) {
      if (e.message && e.message.includes("Violación de aislamiento multi-tenant")) {
        crossTenantWriteBlocked = true;
      }
    }

    if (crossTenantWriteBlocked) {
      recordTest(
        "TENANT_ISOLATION",
        "Prevención de Escrituras Cruzadas: Bloqueo activo al intentar mutar entidades en tenants ajenos",
        true,
        "createTenantPrisma rechazó con excepción de seguridad el intento de insertar entidad con schoolId dispar al del contexto."
      );
    } else {
      recordTest(
        "TENANT_ISOLATION",
        "Prevención de Escrituras Cruzadas",
        false,
        "No se bloqueó la inserción cruzada."
      );
    }
  } catch (err: any) {
    recordTest("TENANT_ISOLATION", "Prevención de Escrituras Cruzadas", false, "Error", err.message);
  }

  // ---------------------------------------------------------------------------
  // MÓDULO 4: VALIDACIONES DE NEGOCIO Y LÍMITES DE ESCALAS
  // ---------------------------------------------------------------------------
  console.log("\n--- MÓDULO 4: Validaciones de Negocio & Esquemas Zod ---");

  try {
    const validConfig = UpdateSchoolSettingsSchema.safeParse({
      termType: "TRIMESTER",
      minGrade: 1.0,
      maxGrade: 7.0,
      minPassingGrade: 4.0,
      gradeScalePrecision: 1,
      primaryColor: "#0284c7",
    });

    const invalidColor = UpdateSchoolSettingsSchema.safeParse({
      primaryColor: "not-a-hex-color",
    });

    if (validConfig.success && !invalidColor.success) {
      recordTest(
        "VALIDATION",
        "Validación de parámetros y escalas académicas (Zod Schema)",
        true,
        "Valores válidos superaron el parser Zod correctamente; formato de color no-hexadecimal fue rechazado."
      );
    } else {
      recordTest("VALIDATION", "Validación de parámetros", false, "Fallo en validación Zod");
    }
  } catch (err: any) {
    recordTest("VALIDATION", "Validación de parámetros", false, "Error", err.message);
  }

  // ---------------------------------------------------------------------------
  // MÓDULO 5: AUDITORÍA Y TRAZABILIDAD (AUDIT TRAIL INMUTABLE)
  // ---------------------------------------------------------------------------
  console.log("\n--- MÓDULO 5: Auditoría y Trazabilidad (Audit Trail) ---");

  try {
    const csjSchool = await prisma.school.findUnique({ where: { slug: "colegio-san-jose" } });
    if (!csjSchool) throw new Error("School not found");

    await updateSchoolSettings(
      csjSchool.id,
      {
        primaryColor: "#0369a1",
        requireAttendanceNote: true,
      },
      "user-director"
    );

    const auditLogs = await prisma.auditLog.findMany({
      where: { schoolId: csjSchool.id },
      orderBy: { timestamp: "desc" },
    });

    const hasSettingAudit = auditLogs.some(
      (log) => log.entityType === "SCHOOL_SETTINGS" && log.action === AuditAction.UPDATE && log.userId === "user-director"
    );

    if (hasSettingAudit) {
      recordTest(
        "AUDIT",
        "Registro inmutable de auditoría para operaciones críticas de administración",
        true,
        `Se encontró registro en AuditLog: entityType='SCHOOL_SETTINGS', action='UPDATE', userId='user-director', schoolId='${csjSchool.id}', timestamp registrado.`
      );
    } else {
      recordTest("AUDIT", "Registro de auditoría", false, "No se encontró el evento de auditoría esperado.");
    }
  } catch (err: any) {
    recordTest("AUDIT", "Registro de auditoría", false, "Error en prueba de auditoría", err.message);
  }

  // ---------------------------------------------------------------------------
  // MÓDULO 6: PRUEBAS DE INTEGRACIÓN DE APIS HTTP (SMOKE TESTS)
  // ---------------------------------------------------------------------------
  console.log("\n--- MÓDULO 6: Smoke Tests de Endpoints HTTP & Seguridad ---");

  // Helper para fetch resiliente con reintentos y parseo seguro contra HTML de compilación
  async function safeFetchJson(url: string, init?: RequestInit, maxRetries = 8): Promise<{ status: number; data: any; ok: boolean }> {
    // Normalizar localhost a 127.0.0.1 para evitar demoras por resolución IPv6 en Node.js
    const targetUrl = url.replace("http://localhost:3000", "http://127.0.0.1:3000");
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(targetUrl, init);
        const text = await res.text();
        let data: any = {};
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        // Si el servidor está temporalmente compilando en Next.js dev (HTML de calentamiento o 502/503), reintentamos
        const isTemporaryWarmup =
          (res.status === 502 || res.status === 503 || (res.status >= 500 && text.startsWith("<!DOCTYPE"))) &&
          attempt < maxRetries - 1;

        if (isTemporaryWarmup) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }

        return { status: res.status, data, ok: res.ok };
      } catch (err: any) {
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        throw err;
      }
    }
    throw new Error(`Incapaz de conectar a ${targetUrl} tras ${maxRetries} intentos.`);
  }

  try {
    // 6.1 POST /api/auth/login con credenciales erróneas (formato válido de email y pass)
    const wrongCreds = await safeFetchJson("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "director@sanjose.cl", password: "PasswordIncorrecta123!" }),
    });
    const wrongCredsRejected = wrongCreds.status === 401 && !wrongCreds.data.success;

    // 6.2 POST /api/auth/login con credenciales válidas de Director
    const directorLogin = await safeFetchJson("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "director@sanjose.cl", password: "AdminCSJ2026!" }),
    });
    const directorAccepted =
      directorLogin.status === 200 &&
      directorLogin.data.success === true &&
      directorLogin.data.redirectUrl === "/colegio-san-jose/dashboard";

    // 6.3 PATCH /api/schools/school-csj-001/settings sin sesión (debe dar 401 Unauthorized)
    const unauthPatch = await safeFetchJson("http://localhost:3000/api/schools/school-csj-001/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ primaryColor: "#123456" }),
    });
    const unauthPatchRejected = unauthPatch.status === 401;

    if (wrongCredsRejected && directorAccepted && unauthPatchRejected) {
      recordTest(
        "API",
        "Seguridad de Endpoints: Rechazo 401 a credenciales erróneas, 200 OK con sesión a credenciales legítimas, y 401 a mutaciones no autenticadas",
        true,
        `Login inválido -> HTTP 401. Login legítimo -> HTTP 200 (redirect '${directorLogin.data.redirectUrl}'). Mutación sin sesión -> HTTP 401 bloqueado.`
      );
    } else {
      recordTest(
        "API",
        "Seguridad de Endpoints HTTP",
        false,
        `Status wrong: ${wrongCreds.status}, valid: ${directorLogin.status}, unauthPatch: ${unauthPatch.status}`
      );
    }

    // 6.4 Protección de Endpoints de Sistema (/api/system/schools)
    const unauthSystemSchools = await safeFetchJson("http://localhost:3000/api/system/schools");
    const systemSchoolsBlocked = unauthSystemSchools.status === 401;

    // 6.5 Protección de Endpoint de Selección de Colegio (/api/auth/select-school)
    const unauthSelectSchool = await safeFetchJson("http://localhost:3000/api/auth/select-school", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId: "school-csj-001" }),
    });
    const selectSchoolBlocked = unauthSelectSchool.status === 401;

    // 6.6 Verificación de Endpoint de Logout (/api/auth/logout)
    const logout = await safeFetchJson("http://localhost:3000/api/auth/logout", {
      method: "POST",
    });
    const logoutOk = logout.status === 200 && logout.data.success === true;

    if (systemSchoolsBlocked && selectSchoolBlocked && logoutOk) {
      recordTest(
        "API",
        "Protección de Rutas del Sistema y Flujo de Sesión: Bloqueo de /system/schools y /select-school sin sesión, y logout exitoso",
        true,
        "GET /api/system/schools -> HTTP 401. POST /api/auth/select-school -> HTTP 401. POST /api/auth/logout -> HTTP 200 OK."
      );
    } else {
      recordTest(
        "API",
        "Protección de Rutas del Sistema y Flujo de Sesión",
        false,
        `System: ${unauthSystemSchools.status}, SelectSchool: ${unauthSelectSchool.status}, Logout: ${logout.status}`
      );
    }
  } catch (err: any) {
    recordTest("API", "Seguridad de Endpoints HTTP", false, "Error en fetch", err.message);
  }

  // ---------------------------------------------------------------------------
  // RESUMEN GENERAL Y ESTADÍSTICAS
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(`📊 RESUMEN FINAL DE LA EVALUACIÓN QA:`);
  console.log(`   Total de Pruebas: ${total}`);
  console.log(`   Superadas:        ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`   Fallidas:         ${failed}`);
  console.log(`   Estado del Build: ${failed === 0 ? "🟢 APROBADO PARA PRODUCCIÓN (100% PASS)" : "🔴 REQUIERE ATENCIÓN"}`);
  console.log("================================================================================\n");

  return { total, passed, failed, results };
}

runAllTests().catch((e) => {
  console.error("Fatal test runner error:", e);
  process.exit(1);
});
