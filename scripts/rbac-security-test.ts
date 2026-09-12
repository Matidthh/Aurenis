/**
 * Script de Auditoría de Seguridad RBAC y Verificación de Permisos
 * Valida la matriz de control de acceso por perfiles en Aurenis
 * Ejecuta pruebas para los 4 roles principales (Director, Profesor, Estudiante, Apoderado) y SuperAdmin
 * Confirmación de respuestas HTTP 403 Forbidden y aislamiento multi-tenant
 */

interface TestCase {
  name: string;
  role: string;
  userEmail: string;
  userPass: string;
  method: string;
  url: string;
  payload?: any;
  expectedStatus: number;
  expectedErrorSubstring?: string;
  category: "RBAC_ENFORCEMENT" | "MULTI_TENANT_ISOLATION" | "SUPERADMIN_PRIVILEGE";
}

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const TEST_CASES: TestCase[] = [
  // 1. ROL: PROFESOR (Docente)
  {
    name: "Profesor intenta crear cursos (Permiso ACADEMIC_COURSES_MANAGE reservado para Director/Escuela)",
    role: "Profesor",
    userEmail: "profesor@sanjose.cl",
    userPass: "Profesor2026!",
    method: "POST",
    url: "/api/schools/sch_sanjose_demo/courses",
    payload: {
      name: "Curso No Autorizado",
      letter: "B",
      gradeNumber: 3,
      year: 2026,
      educationLevelId: "level-media",
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Se requieren privilegios de administración de cursos",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Profesor intenta modificar ajustes institucionales (Permiso SCHOOL_SETTINGS_UPDATE)",
    role: "Profesor",
    userEmail: "profesor@sanjose.cl",
    userPass: "Profesor2026!",
    method: "PATCH",
    url: "/api/schools/sch_sanjose_demo/settings",
    payload: { minPassingGrade: 5.0 },
    expectedStatus: 403,
    expectedErrorSubstring: "No posees el permiso para modificar la configuración del colegio",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Profesor intenta ejecutar acción de SuperAdmin (Creación de colegios)",
    role: "Profesor",
    userEmail: "profesor@sanjose.cl",
    userPass: "Profesor2026!",
    method: "POST",
    url: "/api/system/schools",
    payload: { name: "Escuela Ilegal", slug: "escuela-ilegal" },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Se requieren privilegios de SuperAdmin",
    category: "SUPERADMIN_PRIVILEGE",
  },

  // 2. ROL: ESTUDIANTE (Alumno)
  {
    name: "Estudiante intenta ingresar o alterar notas académicas (Permiso GRADES_ENTER)",
    role: "Estudiante",
    userEmail: "estudiante@sanjose.cl",
    userPass: "Estudiante2026!",
    method: "POST",
    url: "/api/schools/sch_sanjose_demo/grades",
    payload: {
      assessmentId: "ass-1",
      studentProfileId: "sp-1",
      value: 7.0,
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Permisos insuficientes para ingresar o crear calificaciones",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Estudiante intenta crear cursos académicos (Permiso ACADEMIC_COURSES_MANAGE)",
    role: "Estudiante",
    userEmail: "estudiante@sanjose.cl",
    userPass: "Estudiante2026!",
    method: "POST",
    url: "/api/schools/sch_sanjose_demo/courses",
    payload: {
      name: "Curso Hackeado",
      letter: "X",
      gradeNumber: 4,
      year: 2026,
      educationLevelId: "level-media",
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Se requieren privilegios de administración de cursos",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Estudiante intenta modificar ajustes del colegio (Permiso SCHOOL_SETTINGS_UPDATE)",
    role: "Estudiante",
    userEmail: "estudiante@sanjose.cl",
    userPass: "Estudiante2026!",
    method: "PATCH",
    url: "/api/schools/sch_sanjose_demo/settings",
    payload: { minPassingGrade: 1.0 },
    expectedStatus: 403,
    expectedErrorSubstring: "No posees el permiso para modificar la configuración del colegio",
    category: "RBAC_ENFORCEMENT",
  },

  // 3. ROL: APODERADO / TUTOR (Guardian)
  {
    name: "Apoderado intenta ingresar o crear calificaciones (Permiso GRADES_ENTER)",
    role: "Apoderado",
    userEmail: "apoderado@sanjose.cl",
    userPass: "Apoderado2026!",
    method: "POST",
    url: "/api/schools/sch_sanjose_demo/grades",
    payload: {
      assessmentId: "ass-1",
      studentProfileId: "sp-1",
      value: 7.0,
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Permisos insuficientes para ingresar o crear calificaciones",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Apoderado intenta crear cursos (Permiso ACADEMIC_COURSES_MANAGE)",
    role: "Apoderado",
    userEmail: "apoderado@sanjose.cl",
    userPass: "Apoderado2026!",
    method: "POST",
    url: "/api/schools/sch_sanjose_demo/courses",
    payload: {
      name: "Curso Apoderado",
      letter: "A",
      gradeNumber: 1,
      year: 2026,
      educationLevelId: "level-media",
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Se requieren privilegios de administración de cursos",
    category: "RBAC_ENFORCEMENT",
  },
  {
    name: "Apoderado intenta alterar configuración escolar (Permiso SCHOOL_SETTINGS_UPDATE)",
    role: "Apoderado",
    userEmail: "apoderado@sanjose.cl",
    userPass: "Apoderado2026!",
    method: "PATCH",
    url: "/api/schools/sch_sanjose_demo/settings",
    payload: { maxGrade: 10.0 },
    expectedStatus: 403,
    expectedErrorSubstring: "No posees el permiso para modificar la configuración del colegio",
    category: "RBAC_ENFORCEMENT",
  },

  // 4. ROL: DIRECTOR / SCHOOL ADMIN
  {
    name: "Director intenta ejecutar acción global de SuperAdmin (Creación de colegios)",
    role: "Director",
    userEmail: "director@sanjose.cl",
    userPass: "AdminCSJ2026!",
    method: "POST",
    url: "/api/system/schools",
    payload: { name: "Colegio Ficticio", slug: "colegio-ficticio" },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado. Se requieren privilegios de SuperAdmin",
    category: "SUPERADMIN_PRIVILEGE",
  },
  {
    name: "Director intenta gestionar recursos de otra institución escolar (Aislamiento Multi-Tenant)",
    role: "Director",
    userEmail: "director@sanjose.cl",
    userPass: "AdminCSJ2026!",
    method: "POST",
    url: "/api/schools/school-csm-999/courses",
    payload: {
      name: "Curso en Otra Institución",
      letter: "A",
      gradeNumber: 2,
      year: 2026,
      educationLevelId: "level-media",
    },
    expectedStatus: 403,
    expectedErrorSubstring: "Acceso denegado a esta institución",
    category: "MULTI_TENANT_ISOLATION",
  },
];

async function loginAndGetCookie(email: string, pass: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass }),
  });

  if (!res.ok) {
    throw new Error(`Login failed for ${email}: ${res.status} ${res.statusText}`);
  }

  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error(`No set-cookie returned for ${email}`);
  }

  // Extraer el valor de la cookie aurenis_session
  const match = setCookie.match(/aurenis_session=([^;]+)/);
  if (!match) {
    return setCookie.split(";")[0];
  }
  return `aurenis_session=${match[1]}`;
}

async function runRBACTests() {
  console.log("================================================================================");
  console.log("  AURENIS SCHOOL SUITE - AUDITORÍA DE PERMISOS Y CONTROL DE ACCESO (RBAC)");
  console.log("================================================================================");
  console.log(`Endpoint Base: ${BASE_URL}`);
  console.log(`Fecha de Ejecución: ${new Date().toISOString()}`);
  console.log("");

  const cookieCache = new Map<string, string>();
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < TEST_CASES.length; i++) {
    const test = TEST_CASES[i];
    process.stdout.write(`[${i + 1}/${TEST_CASES.length}] ${test.role.toUpperCase()} -> ${test.name}... `);

    try {
      let cookie = cookieCache.get(test.userEmail);
      if (!cookie) {
        cookie = await loginAndGetCookie(test.userEmail, test.userPass);
        cookieCache.set(test.userEmail, cookie);
      }

      const options: RequestInit = {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      };

      if (test.payload) {
        options.body = JSON.stringify(test.payload);
      }

      const res = await fetch(`${BASE_URL}${test.url}`, options);
      const resText = await res.text();
      let resJson: any = null;
      try {
        resJson = JSON.parse(resText);
      } catch {
        resJson = { raw: resText };
      }

      const statusMatches = res.status === test.expectedStatus;
      const errorMatches = test.expectedErrorSubstring
        ? (resJson.error || resJson.message || resText).toLowerCase().includes(test.expectedErrorSubstring.toLowerCase())
        : true;

      if (statusMatches && errorMatches) {
        console.log(`\x1b[32mPASSED (HTTP ${res.status} Forbidden)\x1b[0m`);
        passedCount++;
      } else {
        console.log(`\x1b[31mFAILED\x1b[0m`);
        console.log(`   Esperado: HTTP ${test.expectedStatus}, Recibido: HTTP ${res.status}`);
        console.log(`   Cuerpo de respuesta: ${resText}`);
        failedCount++;
      }
    } catch (err: any) {
      console.log(`\x1b[31mERROR: ${err.message}\x1b[0m`);
      failedCount++;
    }
  }

  // Caso Positivo: Director creando un curso legítimo
  process.stdout.write(`\n[AUTORIZADO] DIRECTOR -> Creación legítima de curso en su colegio... `);
  try {
    let directorCookie = cookieCache.get("director@sanjose.cl");
    if (!directorCookie) {
      directorCookie = await loginAndGetCookie("director@sanjose.cl", "AdminCSJ2026!");
    }
    const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: directorCookie,
      },
      body: JSON.stringify({
        name: "4° Medio Científico",
        letter: "C",
        gradeNumber: 4,
        year: 2026,
        educationLevelId: "level-media",
      }),
    });
    if (res.status === 201) {
      console.log(`\x1b[32mPASSED (HTTP 201 Created)\x1b[0m`);
      passedCount++;
    } else {
      console.log(`\x1b[31mFAILED (HTTP ${res.status})\x1b[0m`);
      failedCount++;
    }
  } catch (err: any) {
    console.log(`\x1b[31mERROR: ${err.message}\x1b[0m`);
    failedCount++;
  }

  // Caso Positivo: SuperAdmin consultando colegios
  process.stdout.write(`[AUTORIZADO] SUPERADMIN -> Acceso global a colegios en /api/system/schools... `);
  try {
    let adminCookie = cookieCache.get("admin@aurenis.com");
    if (!adminCookie) {
      adminCookie = await loginAndGetCookie("admin@aurenis.com", "AurenisSuperAdmin2026!");
    }
    const res = await fetch(`${BASE_URL}/api/system/schools`, {
      method: "GET",
      headers: {
        Cookie: adminCookie,
      },
    });
    if (res.status === 200) {
      console.log(`\x1b[32mPASSED (HTTP 200 OK)\x1b[0m`);
      passedCount++;
    } else {
      console.log(`\x1b[31mFAILED (HTTP ${res.status})\x1b[0m`);
      failedCount++;
    }
  } catch (err: any) {
    console.log(`\x1b[31mERROR: ${err.message}\x1b[0m`);
    failedCount++;
  }

  console.log("\n================================================================================");
  console.log(`  RESUMEN DE AUDITORÍA: ${passedCount} APROBADAS / ${failedCount} FALLIDAS`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runRBACTests();
