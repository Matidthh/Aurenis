/**
 * Suite de Pruebas de Acceso No Autenticado y Seguridad de Navegación:
 * 1. Redirección inmediata a /login en cliente para URLs privadas sin sesión
 * 2. Rechazo HTTP 401 en backend para peticiones API sin token Bearer o cookie válida
 * 3. Ausencia de datos en caché del navegador (Validación de cabeceras Cache-Control: no-store, Pragma: no-cache, Expires: 0)
 * 4. Verificación de acceso autorizado con token Bearer válido
 */

import { SignJWT } from "jose";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

interface TestStep {
  name: string;
  category: "CLIENT_REDIRECT" | "BACKEND_401" | "CACHE_CONTROL" | "BEARER_AUTH";
  run: () => Promise<{ passed: boolean; message: string; status?: number; headers?: Record<string, string> }>;
}

const tests: TestStep[] = [
  // =========================================================================
  // CRITERIO 1: Redirección inmediata a /login en cliente
  // =========================================================================
  {
    name: "Navegación directa a Dashboard de Colegio sin sesión (/colegio-san-jose/dashboard)",
    category: "CLIENT_REDIRECT",
    run: async () => {
      // Usamos redirect: "manual" para inspeccionar el 307/302 de Next.js
      const res = await fetch(`${BASE_URL}/colegio-san-jose/dashboard`, {
        redirect: "manual",
      });
      const location = res.headers.get("location") || "";
      const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
      const pointsToLogin = location.includes("/login") && location.includes("returnUrl=%2Fcolegio-san-jose%2Fdashboard");
      return {
        passed: isRedirect && pointsToLogin,
        message: `HTTP ${res.status} -> Redirección a ${location}`,
        status: res.status,
      };
    },
  },
  {
    name: "Navegación directa a Módulo de Cursos sin sesión (/colegio-san-jose/courses)",
    category: "CLIENT_REDIRECT",
    run: async () => {
      const res = await fetch(`${BASE_URL}/colegio-san-jose/courses`, {
        redirect: "manual",
      });
      const location = res.headers.get("location") || "";
      const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
      const pointsToLogin = location.includes("/login");
      return {
        passed: isRedirect && pointsToLogin,
        message: `HTTP ${res.status} -> Redirección a ${location}`,
        status: res.status,
      };
    },
  },
  {
    name: "Navegación directa a Panel de SuperAdmin sin sesión (/system/dashboard)",
    category: "CLIENT_REDIRECT",
    run: async () => {
      const res = await fetch(`${BASE_URL}/system/dashboard`, {
        redirect: "manual",
      });
      const location = res.headers.get("location") || "";
      const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
      const pointsToLogin = location.includes("/login");
      return {
        passed: isRedirect && pointsToLogin,
        message: `HTTP ${res.status} -> Redirección a ${location}`,
        status: res.status,
      };
    },
  },
  {
    name: "Navegación directa a Selección de Escuela sin sesión (/select-school)",
    category: "CLIENT_REDIRECT",
    run: async () => {
      const res = await fetch(`${BASE_URL}/select-school`, {
        redirect: "manual",
      });
      const location = res.headers.get("location") || "";
      const isRedirect = res.status === 307 || res.status === 302 || res.status === 308;
      const pointsToLogin = location.includes("/login");
      return {
        passed: isRedirect && pointsToLogin,
        message: `HTTP ${res.status} -> Redirección a ${location}`,
        status: res.status,
      };
    },
  },

  // =========================================================================
  // CRITERIO 2: Rechazo 401 en backend sin token Bearer
  // =========================================================================
  {
    name: "Petición API Cursos sin token (GET /api/schools/sch_sanjose_demo/courses)",
    category: "BACKEND_401",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`);
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 401,
        message: `HTTP ${res.status} - Respuesta: ${JSON.stringify(body)}`,
        status: res.status,
      };
    },
  },
  {
    name: "Petición API Calificaciones sin token (GET /api/schools/sch_sanjose_demo/grades)",
    category: "BACKEND_401",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/grades`);
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 401,
        message: `HTTP ${res.status} - Respuesta: ${JSON.stringify(body)}`,
        status: res.status,
      };
    },
  },
  {
    name: "Petición API Configuración sin token (PATCH /api/schools/sch_sanjose_demo/settings)",
    category: "BACKEND_401",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minPassingGrade: 4.0 }),
      });
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 401,
        message: `HTTP ${res.status} - Respuesta: ${JSON.stringify(body)}`,
        status: res.status,
      };
    },
  },
  {
    name: "Petición API SuperAdmin sin token (GET /api/system/schools)",
    category: "BACKEND_401",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/system/schools`);
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 401,
        message: `HTTP ${res.status} - Respuesta: ${JSON.stringify(body)}`,
        status: res.status,
      };
    },
  },
  {
    name: "Petición API con Bearer Token inválido/malformado (Authorization: Bearer invalid.token.xyz)",
    category: "BACKEND_401",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Authorization: "Bearer invalid.token.xyz" },
      });
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 401,
        message: `HTTP ${res.status} - Respuesta: ${JSON.stringify(body)}`,
        status: res.status,
      };
    },
  },

  // =========================================================================
  // CRITERIO 3: Ausencia de datos en caché del navegador (Cabeceras Anti-Cache)
  // =========================================================================
  {
    name: "Directivas Anti-Caché en Redirección Privada (/colegio-san-jose/dashboard)",
    category: "CACHE_CONTROL",
    run: async () => {
      const res = await fetch(`${BASE_URL}/colegio-san-jose/dashboard`, {
        redirect: "manual",
      });
      const cacheControl = res.headers.get("cache-control") || "";
      const pragma = res.headers.get("pragma") || "";
      const expires = res.headers.get("expires") || "";
      const hasNoStore = cacheControl.includes("no-store") && cacheControl.includes("no-cache");
      return {
        passed: hasNoStore,
        message: `Cache-Control: "${cacheControl}", Pragma: "${pragma}", Expires: "${expires}"`,
        headers: { cacheControl, pragma, expires },
      };
    },
  },
  {
    name: "Directivas Anti-Caché en Respuesta API Rechazada 401 (/api/schools/.../courses)",
    category: "CACHE_CONTROL",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`);
      const cacheControl = res.headers.get("cache-control") || "";
      const pragma = res.headers.get("pragma") || "";
      const hasNoStore = cacheControl.includes("no-store");
      return {
        passed: hasNoStore,
        message: `Cache-Control: "${cacheControl}", Pragma: "${pragma}"`,
        headers: { cacheControl, pragma },
      };
    },
  },
  {
    name: "Directivas Anti-Caché en Respuesta API SuperAdmin (/api/system/schools)",
    category: "CACHE_CONTROL",
    run: async () => {
      const res = await fetch(`${BASE_URL}/api/system/schools`);
      const cacheControl = res.headers.get("cache-control") || "";
      const hasNoStore = cacheControl.includes("no-store");
      return {
        passed: hasNoStore,
        message: `Cache-Control: "${cacheControl}"`,
      };
    },
  },

  // =========================================================================
  // VERIFICACIÓN ADICIONAL: Soporte legítimo de Authorization: Bearer <token>
  // =========================================================================
  {
    name: "Petición autorizada con token Bearer legítimo (Authorization: Bearer <valid_jwt>)",
    category: "BEARER_AUTH",
    run: async () => {
      const validToken = await new SignJWT({
        sub: "usr_director_demo",
        email: "director@sanjose.cl",
        firstName: "Carlos",
        lastName: "Mendoza",
        isSystemAdmin: false,
        schoolId: "sch_sanjose_demo",
        schoolSlug: "colegio-san-jose",
        membershipId: "mem_director_demo",
        roleName: "SCHOOL_ADMIN",
        permissions: ["academic:courses:manage", "academic:courses:view"],
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

      const res = await fetch(`${BASE_URL}/api/schools/sch_sanjose_demo/courses`, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      const body = await res.json().catch(() => ({}));
      return {
        passed: res.status === 200 && Array.isArray(body.courses),
        message: `HTTP ${res.status} - Cursos encontrados: ${body.courses?.length ?? 0}`,
        status: res.status,
      };
    },
  },
];

async function runAllTests() {
  console.log("================================================================================");
  console.log("🔒  AURENIS SECURITY SUITE - ACCESO NO AUTENTICADO Y PROTECCIÓN DE RUTAS");
  console.log("================================================================================");
  console.log(`URL Base: ${BASE_URL}`);
  console.log(`Fecha de Evaluación: ${new Date().toISOString()}`);
  console.log("");

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    process.stdout.write(`[${i + 1}/${tests.length}] ${test.name}...\n`);
    try {
      const result = await test.run();
      if (result.passed) {
        console.log(`    \x1b[32m✔ PASSED\x1b[0m -> ${result.message}`);
        passed++;
      } else {
        console.log(`    \x1b[31m✖ FAILED\x1b[0m -> ${result.message}`);
        failed++;
      }
    } catch (err: any) {
      console.log(`    \x1b[31m✖ ERROR\x1b[0m -> ${err.message}`);
      failed++;
    }
  }

  console.log("\n================================================================================");
  console.log(`  RESUMEN DE AUDITORÍA: ${passed} APROBADAS / ${failed} FALLIDAS`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Error fatal ejecutando pruebas:", err);
  process.exit(1);
});
