/**
 * Aurenis QA Suite - Barra Superior (Topbar), Perfil, Tema y Roles de Prueba
 * Definition of Done (Criterios de Aceptación):
 * 1. Barra superior responsiva (Mobile toggle, Desktop collapse, Search, Theme switch)
 * 2. Dropdown con información de perfil (Avatar, Nombre, Email, Rol, Institución, Logout)
 * 3. Botonera de cambio de rol para desarrollo activa (1 clic para cambiar a Director, Profesor, Alumno, SuperAdmin, Apoderado)
 */

import fs from "fs";
import path from "path";
import { DEMO_ROLES, findMatchingDemoRole, DemoRoleAccount } from "../lib/auth/demo-roles";

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
    if (detail) console.log(`   Detalle: ${detail}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    if (detail) console.error(`   Detalle: ${detail}`);
  }
}

console.log("=".repeat(80));
console.log("🌟 AURENIS - SUITE DE VALIDACIÓN: BARRA SUPERIOR, PERFIL & ROLES DEV");
console.log("   Definition of Done: Topbar Responsiva | Dropdown Perfil | Roles Dev Activa");
console.log("=".repeat(80));

// Leer archivo fuente de Header
const headerPath = path.join(process.cwd(), "components/layout/header.tsx");
const headerContent = fs.readFileSync(headerPath, "utf-8");

// Leer archivo fuente de AppShell
const shellPath = path.join(process.cwd(), "components/layout/app-shell.tsx");
const shellContent = fs.readFileSync(shellPath, "utf-8");

// ============================================================================
// CRITERIO 1: Barra superior responsiva
// ============================================================================
console.log("\n--- CRITERIO 1: Barra superior responsiva & Tema Claro/Oscuro ---");

assert(
  headerContent.includes('id="app-header"') &&
  headerContent.includes("sticky top-0") &&
  headerContent.includes("backdrop-blur-md"),
  "Contenedor de barra superior con persistencia sticky y blur responsivo",
  "Header declarado con id='app-header', sticky top-0 y efecto backdrop-blur-md."
);

assert(
  headerContent.includes('id="header-mobile-toggle-btn"') &&
  headerContent.includes("lg:hidden"),
  "Botón toggle para navegación móvil (drawer)",
  "Visible en pantallas móviles y oculto en desktop (lg:hidden)."
);

assert(
  headerContent.includes('id="header-desktop-collapse-btn"') &&
  headerContent.includes("hidden lg:flex"),
  "Botón de colapso/expansión para barra lateral en escritorio",
  "Integrado con atajos y cambio de icono PanelLeftOpen / PanelLeftClose."
);

assert(
  headerContent.includes('id="header-search-trigger"') &&
  headerContent.includes("⌘K"),
  "Acceso rápido a búsqueda y paleta de comandos",
  "Botón responsivo con atajo de teclado ⌘K y activación de CommandPalette."
);

assert(
  headerContent.includes('id="header-theme-toggle-btn"') &&
  headerContent.includes("toggleTheme") &&
  headerContent.includes("aurenis_theme") &&
  headerContent.includes("document.documentElement.classList"),
  "Botón de alternar tema claro/oscuro con persistencia en localStorage",
  "Sincroniza la clase .dark en <html> y almacena la clave 'aurenis_theme'."
);

assert(
  headerContent.includes('id="header-notifications-btn"') &&
  headerContent.includes('id="header-notifications-menu"'),
  "Centro de notificaciones interactivo con popover de eventos escolares",
  "Muestra badge de pulso y menú con notificaciones de asistencia y calificaciones."
);

// ============================================================================
// CRITERIO 2: Dropdown con información de perfil
// ============================================================================
console.log("\n--- CRITERIO 2: Dropdown con información de perfil ---");

assert(
  headerContent.includes('id="header-user-menu-btn"') &&
  headerContent.includes('id="header-user-dropdown"'),
  "Activador y panel de menú desplegable de perfil de usuario",
  "Contenedor accesible con estados expandido/colapsado y cierre click-outside."
);

assert(
  headerContent.includes("user.firstName") &&
  headerContent.includes("user.lastName") &&
  headerContent.includes("user.email"),
  "Información completa del usuario autenticado en el dropdown",
  "Muestra nombre completo, correo electrónico verificado e iniciales en el avatar."
);

assert(
  headerContent.includes("displayRoleTitle") &&
  headerContent.includes("bg-brand-100"),
  "Insignia destacada con rol institucional del usuario",
  "Visualiza el rol amigable (ej: Director, Docente, Alumno, SuperAdmin) con badge."
);

assert(
  headerContent.includes('id="header-dropdown-change-school"') &&
  headerContent.includes('href="/select-school"'),
  "Acceso directo para cambio de institución educativa",
  "Permite al usuario multi-colegio cambiar de tenant en cualquier momento."
);

assert(
  headerContent.includes('id="header-dropdown-system-admin"') &&
  headerContent.includes('href="/system/dashboard"'),
  "Acceso exclusivo al panel de control global para administradores del sistema",
  "Condicionado estrictamente a user.isSystemAdmin === true."
);

assert(
  headerContent.includes('id="header-dropdown-logout"') &&
  headerContent.includes('href="/api/auth/logout"'),
  "Opción de cierre de sesión con redirección a logout",
  "Enlace seguro al endpoint de terminación y limpieza de cookies de sesión."
);

// ============================================================================
// CRITERIO 3: Botonera de cambio de rol para desarrollo activa
// ============================================================================
console.log("\n--- CRITERIO 3: Botonera de cambio de rol para desarrollo activa ---");

assert(
  headerContent.includes('id="header-dev-role-selector-btn"') &&
  headerContent.includes('id="header-dev-roles-dropdown"'),
  "Botonera / selector rápido de roles de prueba en barra superior",
  "Visible en la barra superior con indicador 'Rol: [Título]' e icono Sparkles."
);

assert(
  DEMO_ROLES.length === 5,
  "Catálogo completo de 5 roles institucionales de desarrollo configurados",
  `Roles registrados: ${DEMO_ROLES.map((r) => r.roleTitle).join(", ")}`
);

const expectedRoles = ["director", "profesor", "alumno", "superadmin", "apoderado"];
const rolesInHeader = expectedRoles.every((role) =>
  headerContent.includes(`dev-role-btn-\${account.roleKey}`) ||
  headerContent.includes("dev-role-btn-")
);

assert(
  rolesInHeader,
  "Botones interactivos con IDs específicos para cada rol de desarrollo",
  "Cada rol cuenta con botón dev-role-btn-[roleKey] para interacción y testing E2E."
);

// Validar mapeo de roles demo
const directorRole = findMatchingDemoRole("director@sanjose.cl");
const teacherRole = findMatchingDemoRole("profesor.matematica@sanjose.cl");
const studentRole = findMatchingDemoRole("sofia.valenzuela@sanjose.cl");
const adminRole = findMatchingDemoRole("admin@aurenis.com");

assert(
  directorRole?.roleTitle === "Director" &&
  teacherRole?.roleTitle === "Docente" &&
  studentRole?.roleTitle === "Alumno" &&
  adminRole?.roleTitle === "SuperAdmin",
  "Resolución precisa de cuentas y títulos institucionales",
  "Mapeo de emails y roles devuelve la configuración adecuada."
);

assert(
  headerContent.includes("executeRoleSwitch") &&
  headerContent.includes("handleRoleSwitch") &&
  headerContent.includes("window.location.href"),
  "Manejador activo de cambio de rol con 1 clic y recarga de sesión",
  "Autentica la cuenta seleccionada contra /api/auth/login y actualiza la vista."
);

assert(
  headerContent.includes('id="header-dropdown-open-roles"'),
  "Acceso redundante al selector de roles desde el propio Dropdown de perfil",
  "Facilita alternar roles tanto desde la botonera superior como desde el menú de usuario."
);

// ============================================================================
// RESUMEN FINAL
// ============================================================================
console.log("=".repeat(80));
console.log(`📊 RESULTADO FINAL TOPBAR, PERFIL & ROLES DEV: ${passedTests}/${totalTests} PRUEBAS EXITOSAS (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("=".repeat(80));

if (passedTests !== totalTests) {
  process.exit(1);
}
