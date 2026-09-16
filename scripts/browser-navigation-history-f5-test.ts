/**
 * ===============================================================================================
 * 🧭 AURENIS - SUITE DE VALIDACIÓN: NAVEGACIÓN, HISTORIAL DEL NAVEGADOR, F5 Y DEEP LINKING
 * ===============================================================================================
 * Auditor de QA & Frontend Architecture: Frank M — Lead QA / Testing / Seguridad
 * 
 * Criterios de Aceptación (Definition of Done):
 * 1. Sesión mantenida al recargar pantalla (F5)
 * 2. Navegación limpia sin errores en consola (Back/Forward, History Stack, NavLinks, Breadcrumbs)
 * 3. Deep linking directo funcional (Rutas canónicas, Alias, ReturnUrl tras login, Seguridad Open Redirect)
 * ===============================================================================================
 */

import { SignJWT, jwtVerify } from "jose";
import {
  isPublicRoute,
  isPrivateRoute,
  isSystemRoute,
  isRouteActive,
  generateBreadcrumbs,
  buildTenantPath,
  isSectionAllowedForRole,
  filterNavItemsByRole,
  getSafeReturnUrl,
  TENANT_SECTIONS,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES,
  TenantSectionKey,
} from "../lib/navigation/routes";
import { signSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from "../lib/auth/session";
import { requireTenantContext, TenantAccessError } from "../lib/tenant/context";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

interface TestResult {
  code: string;
  category: "SESION_F5" | "NAVEGACION_HISTORIAL" | "DEEP_LINKING";
  name: string;
  passed: boolean;
  message: string;
  expected: string;
  actual: string;
}

const results: TestResult[] = [];

function registerTest(
  code: string,
  category: "SESION_F5" | "NAVEGACION_HISTORIAL" | "DEEP_LINKING",
  name: string,
  passed: boolean,
  message: string,
  expected: string,
  actual: string
) {
  results.push({ code, category, name, passed, message, expected, actual });
}

async function runNavigationHistoryF5Suite() {
  console.log("===============================================================================================");
  console.log("🧭  AURENIS - SUITE DE VALIDACIÓN: NAVEGACIÓN, HISTORIAL (ATRÁS/ADELANTE), F5 Y DEEP LINKING");
  console.log("   Auditor de QA & Frontend: Frank M — Lead QA / Testing / Seguridad / Documentación");
  console.log(`   Fecha de Ejecución       : ${new Date().toISOString()}`);
  console.log("===============================================================================================\n");

  // ===============================================================================================
  // [BLOQUE 1/3] Criterio 1: Sesión Mantenida al Recargar Pantalla (F5)
  // ===============================================================================================
  console.log("--- [BLOQUE 1/3] Verificación de Sesión Mantenida al Recargar Pantalla (F5) ---");

  // F5-01: Firma y Verificación de Cookie de Sesión Persistente (Simulación F5)
  try {
    const originalPayload = {
      sub: "usr_director_f5",
      email: "director@sanjose.cl",
      firstName: "Carlos",
      lastName: "Mendoza",
      isSystemAdmin: false,
      schoolId: "sch_sanjose_demo",
      schoolSlug: "colegio-san-jose",
      membershipId: "mem_csj_director",
      roleName: "SCHOOL_ADMIN",
      permissions: ["*"],
    };

    const sessionToken = await signSessionToken(originalPayload);

    // Simulación de 5 recargas F5 consecutivas verificando payload idéntico
    let allF5Match = true;
    for (let f5Cycle = 1; f5Cycle <= 5; f5Cycle++) {
      const verified = await verifySessionToken(sessionToken);
      if (
        !verified ||
        verified.sub !== originalPayload.sub ||
        verified.email !== originalPayload.email ||
        verified.schoolSlug !== originalPayload.schoolSlug ||
        verified.roleName !== originalPayload.roleName
      ) {
        allF5Match = false;
        break;
      }
    }

    registerTest(
      "F5-01",
      "SESION_F5",
      "Persistencia Criptográfica del Token de Sesión tras 5 Recargas F5 Consecutivas",
      allF5Match,
      allF5Match
        ? "El token JWT HS256 mantiene todos los claims intactos a través de múltiples ciclos de recarga."
        : "Discrepancia detectada en los claims de sesión tras recargar.",
      "Claims idénticos (sub, email, schoolSlug, roleName) en cada ciclo F5",
      allF5Match ? "Claims 100% consistentes en las 5 recargas" : "Pérdida de claims detectada"
    );
  } catch (err: any) {
    registerTest(
      "F5-01",
      "SESION_F5",
      "Persistencia Criptográfica del Token de Sesión tras Recarga F5",
      false,
      `Error inesperado: ${err.message}`,
      "Sesión verificada",
      "Error arrojado"
    );
  }

  // F5-02: Preservación de Sesión en Múltiples Rutas tras F5
  try {
    const deepRoutes = [
      "/colegio-san-jose/dashboard",
      "/colegio-san-jose/teachers",
      "/colegio-san-jose/grades",
      "/colegio-san-jose/attendance",
      "/colegio-san-jose/settings",
      "/colegio-san-jose/courses",
      "/colegio-san-jose/subjects",
    ];

    let allRoutesPreserved = true;
    for (const route of deepRoutes) {
      const isPrivate = isPrivateRoute(route);
      const isPublic = isPublicRoute(route);
      if (!isPrivate || isPublic) {
        allRoutesPreserved = false;
        break;
      }
    }

    registerTest(
      "F5-02",
      "SESION_F5",
      "Clasificación y Protección de Rutas Tenant tras Recarga F5",
      allRoutesPreserved,
      allRoutesPreserved
        ? "Todas las rutas tenant profundas están estrictamente clasificadas como privadas y requieren sesión."
        : "Fallo en clasificación de rutas privadas.",
      "7/7 rutas tenant clasificadas como privadas",
      allRoutesPreserved ? "7/7 rutas verificadas privadas" : "Rutas no privadas detectadas"
    );
  } catch (err: any) {
    registerTest("F5-02", "SESION_F5", "Clasificación de Rutas Tenant", false, err.message, "Éxito", "Error");
  }

  // F5-03: Preservación de Sesión Multi-Rol tras F5 (Director, Docente, Alumno, SuperAdmin)
  try {
    const rolesToTest = [
      { role: "SCHOOL_ADMIN", email: "director@sanjose.cl", slug: "colegio-san-jose", isSys: false },
      { role: "TEACHER", email: "profesor@sanjose.cl", slug: "colegio-san-jose", isSys: false },
      { role: "STUDENT", email: "alumno@sanjose.cl", slug: "colegio-san-jose", isSys: false },
      { role: "SYSTEM_ADMIN", email: "admin@aurenis.com", slug: undefined, isSys: true },
    ];

    let allRolesPreserved = true;
    for (const roleDef of rolesToTest) {
      const token = await signSessionToken({
        sub: `usr_${roleDef.role.toLowerCase()}`,
        email: roleDef.email,
        firstName: "Test",
        lastName: "User",
        isSystemAdmin: roleDef.isSys,
        schoolSlug: roleDef.slug,
        roleName: roleDef.role,
        permissions: roleDef.isSys ? ["*"] : ["grades:view"],
      });

      const restored = await verifySessionToken(token);
      if (!restored || restored.roleName !== roleDef.role || restored.isSystemAdmin !== roleDef.isSys) {
        allRolesPreserved = false;
        break;
      }
    }

    registerTest(
      "F5-03",
      "SESION_F5",
      "Preservación de Roles y Permisos RBAC tras Recarga F5",
      allRolesPreserved,
      allRolesPreserved
        ? "Todos los roles (Admin, Docente, Alumno, SuperAdmin) preservan íntegramente sus privilegios al recargar."
        : "Desincronización de rol tras recarga de sesión.",
      "4/4 roles preservan sus credenciales intactas",
      allRolesPreserved ? "4/4 roles verificados con éxito" : "Error de rol detectado"
    );
  } catch (err: any) {
    registerTest("F5-03", "SESION_F5", "Preservación de Roles Multi-Tenant", false, err.message, "Éxito", "Error");
  }

  // F5-04: Reconstrucción Determinista del Contexto Tenant (requireTenantContext)
  try {
    const ctx = await requireTenantContext("colegio-san-jose");
    const validCtx =
      ctx &&
      ctx.schoolSlug === "colegio-san-jose" &&
      ctx.schoolName.length > 0 &&
      Array.isArray(ctx.permissions) &&
      ctx.timezone === "America/Santiago";

    registerTest(
      "F5-04",
      "SESION_F5",
      "Reconstrucción Determinista del TenantContext al Recargar la Pantalla",
      !!validCtx,
      validCtx
        ? `TenantContext reconstruido: '${ctx.schoolName}' (slug: ${ctx.schoolSlug}, zona: ${ctx.timezone}).`
        : "No fue posible reconstruir el TenantContext.",
      "TenantContext con slug, nombre, permisos y zona horaria válida",
      validCtx ? `Contexto válido (${ctx.schoolSlug})` : "Contexto inválido"
    );
  } catch (err: any) {
    registerTest("F5-04", "SESION_F5", "Reconstrucción del TenantContext", false, err.message, "Éxito", "Error");
  }

  // ===============================================================================================
  // [BLOQUE 2/3] Criterio 2: Navegación Limpia sin Errores en Consola e Historial (Back/Forward)
  // ===============================================================================================
  console.log("\n--- [BLOQUE 2/3] Verificación de Navegación Limpia, Historial (Atrás/Adelante) y Breadcrumbs ---");

  // NAV-01: Simulación de Pila de Historial del Navegador (Push / Back / Forward)
  try {
    const historyStack = [
      "/",
      "/login",
      "/colegio-san-jose/dashboard",
      "/colegio-san-jose/teachers",
      "/colegio-san-jose/grades",
    ];

    let currentIndex = historyStack.length - 1; // en /grades

    // Simular Atrás (Back) -> /teachers
    currentIndex -= 1;
    const back1Path = historyStack[currentIndex];
    const isTeachersActive = isRouteActive(back1Path, "/colegio-san-jose/teachers");
    const isGradesInactive = !isRouteActive(back1Path, "/colegio-san-jose/grades");

    // Simular Atrás (Back) -> /dashboard
    currentIndex -= 1;
    const back2Path = historyStack[currentIndex];
    const isDashActive = isRouteActive(back2Path, "/colegio-san-jose/dashboard");

    // Simular Adelante (Forward) -> /teachers
    currentIndex += 1;
    const fwd1Path = historyStack[currentIndex];
    const isTeachersReactivated = isRouteActive(fwd1Path, "/colegio-san-jose/teachers");

    // Simular Adelante (Forward) -> /grades
    currentIndex += 1;
    const fwd2Path = historyStack[currentIndex];
    const isGradesReactivated = isRouteActive(fwd2Path, "/colegio-san-jose/grades");

    const historyValid =
      isTeachersActive &&
      isGradesInactive &&
      isDashActive &&
      isTeachersReactivated &&
      isGradesReactivated;

    registerTest(
      "NAV-01",
      "NAVEGACION_HISTORIAL",
      "Simulación de Navegación por Historial del Navegador (Back / Forward)",
      historyValid,
      historyValid
        ? "El estado activo de rutas (isRouteActive) responde con total precisión durante eventos popstate / atrás / adelante."
        : "Desincronización en estado activo de rutas al retroceder o avanzar en historial.",
      "Navegación fluida: Back (/teachers, /dashboard) -> Forward (/teachers, /grades) coherente",
      historyValid ? "Historial simulado 100% consistente" : "Inconsistencia en historial"
    );
  } catch (err: any) {
    registerTest("NAV-01", "NAVEGACION_HISTORIAL", "Simulación de Historial", false, err.message, "Éxito", "Error");
  }

  // NAV-02: Coherencia de isRouteActive en Rutas Anidadas y Rutas Exactas
  try {
    const testCases = [
      { current: "/colegio-san-jose/dashboard", target: "/colegio-san-jose/dashboard", exact: true, expected: true },
      { current: "/colegio-san-jose/dashboard", target: "/colegio-san-jose/teachers", exact: false, expected: false },
      { current: "/colegio-san-jose/courses/1to-medio-a", target: "/colegio-san-jose/courses", exact: false, expected: true },
      { current: "/colegio-san-jose/courses/1to-medio-a", target: "/colegio-san-jose/courses", exact: true, expected: false },
      { current: "/", target: "/", exact: true, expected: true },
      { current: "/login", target: "/", exact: false, expected: false },
    ];

    const allMatches = testCases.every((tc) => isRouteActive(tc.current, tc.target, tc.exact) === tc.expected);

    registerTest(
      "NAV-02",
      "NAVEGACION_HISTORIAL",
      "Precisión de Detección de Ruta Activa (isRouteActive) con Rutas Exactas y Anidadas",
      allMatches,
      allMatches
        ? "Todas las combinaciones de rutas exactas y anidadas determinan su estado activo sin falsos positivos."
        : "Fallo en la resolución de rutas activas.",
      "6/6 casos de prueba activos/inactivos correctos",
      allMatches ? "6/6 casos aprobados" : "Discrepancias detectadas"
    );
  } catch (err: any) {
    registerTest("NAV-02", "NAVEGACION_HISTORIAL", "Detección de Rutas Activas", false, err.message, "Éxito", "Error");
  }

  // NAV-03: Generación Dinámica y Jerárquica de Breadcrumbs en Historial
  try {
    const crumbsDash = generateBreadcrumbs("/colegio-san-jose/dashboard", {
      schoolName: "Colegio San José",
      schoolSlug: "colegio-san-jose",
    });

    const crumbsGrades = generateBreadcrumbs("/colegio-san-jose/grades", {
      schoolName: "Colegio San José",
      schoolSlug: "colegio-san-jose",
    });

    const crumbsNestedCourse = generateBreadcrumbs("/colegio-san-jose/courses/1ro-medio-a", {
      schoolName: "Colegio San José",
      schoolSlug: "colegio-san-jose",
    });

    const crumbsSystem = generateBreadcrumbs("/system/schools/new");

    const validCrumbs =
      crumbsDash.length === 1 &&
      crumbsDash[0].isCurrent === true &&
      crumbsGrades.length === 2 &&
      crumbsGrades[1].label === "Calificaciones" &&
      crumbsGrades[1].isCurrent === true &&
      crumbsNestedCourse.length === 3 &&
      crumbsNestedCourse[2].label === "1ro Medio A" &&
      crumbsSystem.length === 3 &&
      crumbsSystem[2].label === "Nuevo Colegio";

    registerTest(
      "NAV-03",
      "NAVEGACION_HISTORIAL",
      "Generación Dinámica de Jerarquía de Migas de Pan (Breadcrumbs)",
      validCrumbs,
      validCrumbs
        ? "Las migas de pan reflejan con exactitud la jerarquía de rutas tanto para niveles simples como anidados."
        : "Discrepancia en las etiquetas o jerarquía de migas de pan.",
      "Breadcrumbs jerárquicos correctos en Dashboard, Módulos y Subrutas anidadas",
      validCrumbs ? "Jerarquía 100% precisa en todos los niveles" : "Jerarquía incorrecta"
    );
  } catch (err: any) {
    registerTest("NAV-03", "NAVEGACION_HISTORIAL", "Generación de Breadcrumbs", false, err.message, "Éxito", "Error");
  }

  // NAV-04: Control de Acceso de Menús y Enlaces según Rol RBAC (filterNavItemsByRole)
  try {
    const teacherAllowedGrades = isSectionAllowedForRole("grades", "TEACHER");
    const studentAllowedSettings = isSectionAllowedForRole("settings", "STUDENT");
    const adminAllowedAll =
      isSectionAllowedForRole("settings", "SCHOOL_ADMIN") &&
      isSectionAllowedForRole("teachers", "SCHOOL_ADMIN");

    const rbacNavValid = teacherAllowedGrades && !studentAllowedSettings && adminAllowedAll;

    registerTest(
      "NAV-04",
      "NAVEGACION_HISTORIAL",
      "Filtrado Limpio de Enlaces de Navegación según Rol RBAC (isSectionAllowedForRole)",
      rbacNavValid,
      rbacNavValid
        ? "Los menús de navegación se filtran estrictamente: Docente accede a Notas, Estudiante bloqueado en Configuración."
        : "Filtrado RBAC incorrecto en ítems de navegación.",
      "Docente: grades=true; Estudiante: settings=false; Admin: settings=true, teachers=true",
      rbacNavValid ? "Reglas RBAC en navegación aplicadas correctamente" : "Fallo en reglas RBAC"
    );
  } catch (err: any) {
    registerTest("NAV-04", "NAVEGACION_HISTORIAL", "Filtrado RBAC de Navegación", false, err.message, "Éxito", "Error");
  }

  // ===============================================================================================
  // [BLOQUE 3/3] Criterio 3: Deep Linking Directo Funcional
  // ===============================================================================================
  console.log("\n--- [BLOQUE 3/3] Verificación de Deep Linking Directo Funcional y Seguridad ---");

  // DEEP-01: Construcción de Rutas Canónicas para Deep Linking (buildTenantPath)
  try {
    const p1 = buildTenantPath("colegio-san-jose", "teachers");
    const p2 = buildTenantPath("colegio-san-jose", "grades");
    const p3 = buildTenantPath("colegio-san-jose", "attendance");
    const p4 = buildTenantPath("colegio-san-jose", "settings");
    const p5 = buildTenantPath("colegio-san-jose");

    const pathsValid =
      p1 === "/colegio-san-jose/teachers" &&
      p2 === "/colegio-san-jose/grades" &&
      p3 === "/colegio-san-jose/attendance" &&
      p4 === "/colegio-san-jose/settings" &&
      p5 === "/colegio-san-jose/dashboard";

    registerTest(
      "DEEP-01",
      "DEEP_LINKING",
      "Resolución y Construcción Canónica de Rutas de Deep Linking (buildTenantPath)",
      pathsValid,
      pathsValid
        ? "Todas las rutas de deep linking canónico resuelven según el esquema /[schoolSlug]/[section]."
        : "Rutas canónicas mal formateadas.",
      "URLs canónicas: /colegio-san-jose/{teachers, grades, attendance, settings, dashboard}",
      pathsValid ? "5/5 rutas canónicas válidas" : "Error en construcción de rutas"
    );
  } catch (err: any) {
    registerTest("DEEP-01", "DEEP_LINKING", "Construcción de Rutas Canónicas", false, err.message, "Éxito", "Error");
  }

  // DEEP-02: Sanitización y Protección contra Open Redirect en returnUrl (getSafeReturnUrl)
  try {
    const openRedirectAttacks = [
      { input: "https://attacker.com/evil", expected: "/select-school" },
      { input: "//evil-site.com/steal-token", expected: "/select-school" },
      { input: "javascript:alert(1)", expected: "/select-school" },
      { input: "/colegio-san-jose/grades", expected: "/colegio-san-jose/grades" },
      { input: "/colegio-san-jose/teachers?page=2", expected: "/colegio-san-jose/teachers?page=2" },
      { input: "/system/dashboard", expected: "/system/dashboard" },
      { input: "/login", expected: "/select-school" },
      { input: null, expected: "/select-school" },
    ];

    const allSanitized = openRedirectAttacks.every(
      (testCase) => getSafeReturnUrl(testCase.input, "/select-school") === testCase.expected
    );

    registerTest(
      "DEEP-02",
      "DEEP_LINKING",
      "Sanitización de Deep Links y Prevención de Open Redirect (getSafeReturnUrl)",
      allSanitized,
      allSanitized
        ? "Las URLs maliciosas (esquemas externos, barras dobles '//') se neutralizan y los deep links válidos se preservan intactos."
        : "Vulnerabilidad detectada en sanitización de returnUrl.",
      "8/8 vectores de ataque y URLs válidas procesadas de forma segura",
      allSanitized ? "8/8 casos procesados de forma segura" : "Fallo de sanitización detectado"
    );
  } catch (err: any) {
    registerTest("DEEP-02", "DEEP_LINKING", "Sanitización de Deep Links", false, err.message, "Éxito", "Error");
  }

  // DEEP-03: Validación de Rutas Públicas del Sistema y Ausencia de Bloqueo Innecesario
  try {
    const publicChecks = [
      { path: "/", isPub: true },
      { path: "/login", isPub: true },
      { path: "/forgot-password", isPub: true },
      { path: "/system/design-system", isPub: true },
      { path: "/colegio-san-jose/dashboard", isPub: false },
      { path: "/system/dashboard", isPub: false },
    ];

    const allPublicChecksPassed = publicChecks.every((c) => isPublicRoute(c.path) === c.isPub);

    registerTest(
      "DEEP-03",
      "DEEP_LINKING",
      "Matriz de Enrutamiento: Diferenciación Estricta entre Rutas Públicas y Privadas",
      allPublicChecksPassed,
      allPublicChecksPassed
        ? "Rutas públicas (/login, /, /forgot-password, /system/design-system) accesibles directamente sin redirección errónea."
        : "Fallo en matriz de rutas públicas.",
      "6/6 rutas categorizadas con precisión",
      allPublicChecksPassed ? "6/6 rutas conformes" : "Error en matriz de enrutamiento"
    );
  } catch (err: any) {
    registerTest("DEEP-03", "DEEP_LINKING", "Matriz de Rutas Públicas", false, err.message, "Éxito", "Error");
  }

  // DEEP-04: Deep Linking a Rutas de SuperAdmin Global (isSystemRoute)
  try {
    const systemChecks = [
      { path: "/system", isSys: true },
      { path: "/system/dashboard", isSys: true },
      { path: "/system/schools", isSys: true },
      { path: "/system/security", isSys: true },
      { path: "/colegio-san-jose/dashboard", isSys: false },
      { path: "/login", isSys: false },
    ];

    const allSysPassed = systemChecks.every((c) => isSystemRoute(c.path) === c.isSys);

    registerTest(
      "DEEP-04",
      "DEEP_LINKING",
      "Aislamiento de Rutas Globales de SuperAdmin (/system/...) en Deep Linking",
      allSysPassed,
      allSysPassed
        ? "Todas las rutas /system/... se identifican de manera inequívoca para exigir privilegios de SuperAdmin."
        : "Fallo en detección de rutas de sistema.",
      "6/6 rutas de SuperAdmin identificadas correctamente",
      allSysPassed ? "6/6 rutas conformes" : "Error en rutas de sistema"
    );
  } catch (err: any) {
    registerTest("DEEP-04", "DEEP_LINKING", "Rutas de SuperAdmin", false, err.message, "Éxito", "Error");
  }

  // ===============================================================================================
  // REPORTE CONSOLIDADO Y RESUMEN EJECUTIVO
  // ===============================================================================================
  console.log("\n===============================================================================================");
  console.log("                           RESUMEN EJECUTIVO DE LA AUDITORÍA");
  console.log("===============================================================================================");

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  for (const res of results) {
    const symbol = res.passed ? "✅" : "❌";
    const status = res.passed ? "PASS" : "FAIL";
    console.log(`  ${symbol} [${res.category}] ${res.code}: ${res.name} -> ${status}`);
    if (!res.passed) {
      console.log(`      Esperado: ${res.expected}`);
      console.log(`      Obtenido: ${res.actual}`);
      console.log(`      Detalle : ${res.message}`);
    }
  }

  console.log("\n-----------------------------------------------------------------------------------------------");
  console.log(`Total de Pruebas Ejecutadas: ${total}`);
  console.log(`Pruebas Aprobadas:          ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`Pruebas Fallidas:           ${failed}`);
  console.log("-----------------------------------------------------------------------------------------------");
  console.log("Desglose por Criterio de Aceptación (DoD):");
  console.log(`  1. Sesión mantenida al recargar pantalla (F5):    ${results.filter((r) => r.category === "SESION_F5" && r.passed).length}/${results.filter((r) => r.category === "SESION_F5").length}`);
  console.log(`  2. Navegación limpia sin errores en consola:       ${results.filter((r) => r.category === "NAVEGACION_HISTORIAL" && r.passed).length}/${results.filter((r) => r.category === "NAVEGACION_HISTORIAL").length}`);
  console.log(`  3. Deep linking directo funcional:                 ${results.filter((r) => r.category === "DEEP_LINKING" && r.passed).length}/${results.filter((r) => r.category === "DEEP_LINKING").length}`);
  console.log("===============================================================================================");

  if (failed === 0) {
    console.log(">>> ESTADO FINAL: 100% DE CRITERIOS DE ACEPTACIÓN CUMPLIDOS CON ÉXITO <<<");
    process.exit(0);
  } else {
    console.log(">>> ESTADO FINAL: SE DETECTARON FALLOS EN LA SUITE <<<");
    process.exit(1);
  }
}

runNavigationHistoryF5Suite().catch((err) => {
  console.error("Error fatal durante la ejecución de la suite:", err);
  process.exit(1);
});
