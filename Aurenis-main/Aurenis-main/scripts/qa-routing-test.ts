/**
 * Aurenis - Suite de Validación de Enrutamiento Dinámico y Breadcrumbs
 * Tarea: Malcom S - Enrutamiento dinámico en React Router / Next App Router con resaltado de sección activa y breadcrumbs superiores
 *
 * Criterios de Aceptación (DoD):
 * 1. Rutas públicas y privadas definidas
 * 2. Enlace dinámico según ruta actual
 * 3. Migas de pan (breadcrumbs) funcionales
 */

import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  SYSTEM_ROUTES,
  TENANT_SECTIONS,
  isPublicRoute,
  isPrivateRoute,
  isSystemRoute,
  isRouteActive,
  generateBreadcrumbs,
  buildTenantPath,
} from "../lib/navigation/routes";

let passedCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail: string) {
  totalCount++;
  if (condition) {
    passedCount++;
    console.log(`✅ PASS: ${testName}`);
    console.log(`   Detalle: ${detail}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    console.error(`   Detalle: ${detail}`);
    process.exitCode = 1;
  }
}

console.log("================================================================================");
console.log("🧭 AURENIS - SUITE DE VALIDACIÓN: ENRUTAMIENTO DINÁMICO & BREADCRUMBS");
console.log("    Responsable: Malcom S (Frontend Architecture & Dynamic Routing)");
console.log("================================================================================\n");

// -----------------------------------------------------------------------------
// CRITERIO 1: Rutas públicas y privadas definidas
// -----------------------------------------------------------------------------
console.log("--- 1. CRITERIO 1: Definición de Rutas Públicas y Privadas ---");

assert(
  isPublicRoute("/") === true &&
  isPublicRoute("/login") === true &&
  isPublicRoute("/forgot-password") === true &&
  isPublicRoute("/api/auth/login") === true &&
  isPublicRoute("/api/auth/logout") === true,
  "Identificación de rutas públicas institucionales",
  "Todas las rutas públicas base ('/', '/login', '/forgot-password', etc.) no requieren sesión."
);

assert(
  isPrivateRoute("/select-school") === true &&
  isPrivateRoute("/colegio-san-jose/dashboard") === true &&
  isPrivateRoute("/colegio-san-jose/students") === true &&
  isPrivateRoute("/colegio-san-jose/courses") === true &&
  isPrivateRoute("/system/dashboard") === true &&
  isPrivateRoute("/system/schools") === true,
  "Identificación estricta de rutas privadas y protegidas",
  "Rutas multi-tenant, intermedias y de SuperAdmin requieren sesión verificada en middleware."
);

assert(
  isSystemRoute("/system") === true &&
  isSystemRoute("/system/dashboard") === true &&
  isSystemRoute("/system/schools/new") === true &&
  isSystemRoute("/api/system/audit") === true &&
  isSystemRoute("/colegio-san-jose/dashboard") === false,
  "Aislamiento de rutas de SuperAdmin (/system/*)",
  "Las rutas globales de supervisión están catalogadas y diferenciadas de los tenants escolares."
);

assert(
  Object.keys(TENANT_SECTIONS).length >= 8 &&
  TENANT_SECTIONS.courses.title === "Cursos" &&
  TENANT_SECTIONS.students.title === "Estudiantes" &&
  TENANT_SECTIONS.grades.title === "Calificaciones",
  "Catálogo de módulos y secciones multi-tenant configurado",
  `8 secciones escolares registradas: ${Object.keys(TENANT_SECTIONS).join(", ")}.`
);

// -----------------------------------------------------------------------------
// CRITERIO 2: Enlace dinámico según ruta actual (Active State Highlighting)
// -----------------------------------------------------------------------------
console.log("\n--- 2. CRITERIO 2: Enlace Dinámico y Resaltado de Sección Activa ---");

// Coincidencia exacta
assert(
  isRouteActive("/colegio-san-jose/courses", "/colegio-san-jose/courses") === true,
  "Resaltado activo en coincidencia exacta de sección",
  "Ruta actual '/colegio-san-jose/courses' activa el enlace de Cursos."
);

// Coincidencia jerárquica / sub-recurso (ej: ver detalle de un curso específico)
assert(
  isRouteActive("/colegio-san-jose/courses/1ro-medio-a", "/colegio-san-jose/courses") === true,
  "Resaltado activo de sección padre en rutas anidadas",
  "Estando en '/colegio-san-jose/courses/1ro-medio-a', la sección padre 'Cursos' permanece activa."
);

// Coincidencia jerárquica con estudiantes
assert(
  isRouteActive("/colegio-san-jose/students/estudiante-789", "/colegio-san-jose/students") === true,
  "Resaltado activo de sección Estudiantes en ficha de alumno",
  "La sección 'Estudiantes' se mantiene resaltada al visualizar el detalle de un estudiante."
);

// No activación en secciones hermanas diferentes
assert(
  isRouteActive("/colegio-san-jose/teachers", "/colegio-san-jose/courses") === false &&
  isRouteActive("/colegio-san-jose/attendance", "/colegio-san-jose/grades") === false,
  "Discriminación precisa de secciones no activas",
  "Estando en 'teachers', la sección 'courses' permanece inactiva sin falsos positivos."
);

// Home exact match
assert(
  isRouteActive("/", "/", true) === true &&
  isRouteActive("/login", "/", true) === false,
  "Comportamiento exacto en ruta raíz '/'",
  "La ruta raíz no activa erróneamente páginas hijas cuando se evalúa con coincidencia estricta."
);

// Sistema admin: /system/schools/new activa /system/schools
assert(
  isRouteActive("/system/schools/new", "/system/schools") === true,
  "Resaltado jerárquico en panel de administración global",
  "La creación de un colegio en '/system/schools/new' resalta la sección 'Colegios e Instituciones'."
);

// Helper canónico buildTenantPath
assert(
  buildTenantPath("san-jose", "courses") === "/san-jose/courses" &&
  buildTenantPath("san-jose") === "/san-jose/dashboard",
  "Generador dinámico de rutas canónicas por tenant",
  "Generación de enlaces canónicos a partir del slug del colegio y sección."
);

// -----------------------------------------------------------------------------
// CRITERIO 3: Migas de pan (breadcrumbs) funcionales
// -----------------------------------------------------------------------------
console.log("\n--- 3. CRITERIO 3: Migas de Pan (Breadcrumbs) Funcionales ---");

// Caso A: Dashboard principal del colegio
const crumbsDashboard = generateBreadcrumbs("/colegio-san-jose/dashboard", {
  schoolName: "Colegio San José",
  schoolSlug: "colegio-san-jose",
});

assert(
  crumbsDashboard.length === 1 &&
  crumbsDashboard[0].label === "Colegio San José" &&
  crumbsDashboard[0].href === "/colegio-san-jose/dashboard" &&
  crumbsDashboard[0].isCurrent === true,
  "Breadcrumb en Dashboard principal del colegio",
  `Genera 1 nivel activo: "${crumbsDashboard[0].label}" (isCurrent: true)`
);

// Caso B: Sección estándar (ej: Cursos)
const crumbsCourses = generateBreadcrumbs("/colegio-san-jose/courses", {
  schoolName: "Colegio San José",
  schoolSlug: "colegio-san-jose",
});

assert(
  crumbsCourses.length === 2 &&
  crumbsCourses[0].label === "Colegio San José" &&
  crumbsCourses[0].isCurrent === false &&
  crumbsCourses[1].label === "Cursos" &&
  crumbsCourses[1].href === "/colegio-san-jose/courses" &&
  crumbsCourses[1].isCurrent === true,
  "Breadcrumb en sección de primer nivel (Cursos)",
  `Nivel 0: "${crumbsCourses[0].label}" (enlace), Nivel 1: "${crumbsCourses[1].label}" (activo)`
);

// Caso C: Ruta anidada con ID/slug de curso
const crumbsNested = generateBreadcrumbs("/colegio-san-jose/courses/1ro-medio-a", {
  schoolName: "Colegio San José",
  schoolSlug: "colegio-san-jose",
});

assert(
  crumbsNested.length === 3 &&
  crumbsNested[0].isCurrent === false &&
  crumbsNested[1].isCurrent === false &&
  crumbsNested[1].label === "Cursos" &&
  crumbsNested[1].href === "/colegio-san-jose/courses" &&
  crumbsNested[2].isCurrent === true &&
  crumbsNested[2].label === "1ro Medio A",
  "Breadcrumb en ruta anidada con sub-recurso (/courses/1ro-medio-a)",
  `Jerarquía generada: ${crumbsNested.map(c => c.label).join(" > ")}`
);

// Caso D: Rutas del Panel Global de SuperAdmin (/system/schools/new)
const crumbsSystemNew = generateBreadcrumbs("/system/schools/new");

assert(
  crumbsSystemNew.length === 3 &&
  crumbsSystemNew[0].label === "Panel Global" &&
  crumbsSystemNew[0].href === "/system/dashboard" &&
  crumbsSystemNew[1].label === "Instituciones" &&
  crumbsSystemNew[1].href === "/system/schools" &&
  crumbsSystemNew[2].label === "Nuevo Colegio" &&
  crumbsSystemNew[2].isCurrent === true,
  "Breadcrumb en flujo de creación de colegio del SuperAdmin",
  `Jerarquía generada: ${crumbsSystemNew.map(c => c.label).join(" > ")}`
);

// Caso E: Ruta intermedia de selección de colegio (/select-school)
const crumbsSelectSchool = generateBreadcrumbs("/select-school");

assert(
  crumbsSelectSchool.length === 2 &&
  crumbsSelectSchool[0].label === "Inicio" &&
  crumbsSelectSchool[0].href === "/" &&
  crumbsSelectSchool[1].label === "Selección de Institución" &&
  crumbsSelectSchool[1].isCurrent === true,
  "Breadcrumb en selector de colegios de usuario multi-institución",
  `Jerarquía generada: ${crumbsSelectSchool.map(c => c.label).join(" > ")}`
);

console.log("\n================================================================================");
console.log(`📊 RESULTADO FINAL SUITE DE ENRUTAMIENTO: ${passedCount}/${totalCount} PRUEBAS EXITOSAS (${Math.round((passedCount/totalCount)*100)}%)`);
console.log("================================================================================\n");

if (passedCount !== totalCount) {
  process.exit(1);
}
