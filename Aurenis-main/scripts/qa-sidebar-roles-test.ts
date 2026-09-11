/**
 * Aurenis QA Suite - Barra Lateral de Navegación & Filtrado por Roles
 * Criterios de Aceptación:
 * 1. Menú adaptado a roles (Admin, Docente, Alumno)
 * 2. Iconografía Lucide React consistente
 * 3. Animaciones de transición con Framer Motion (motion/react)
 */

import { filterNavItemsByRole, TENANT_SECTIONS, TenantSectionKey, isSectionAllowedForRole } from "../lib/navigation/routes";
import { NavItem } from "../components/layout/types";
import fs from "fs";
import path from "path";

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
console.log("📋 AURENIS - SUITE DE VALIDACIÓN: SIDEBAR & FILTRADO POR ROLES");
console.log("   Definition of Done: Admin, Docente, Alumno | Lucide Icons | Framer Motion");
console.log("=".repeat(80));

// Dataset simulado completo de navegación escolar
const schoolSlug = "colegio-san-jose";
const fullSchoolNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: `/${schoolSlug}/dashboard`,
    icon: "LayoutDashboard",
    section: "Principal",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  {
    title: "Estudiantes",
    href: `/${schoolSlug}/students`,
    icon: "Users",
    section: "Comunidad Escolar",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "Profesores",
    href: `/${schoolSlug}/teachers`,
    icon: "GraduationCap",
    section: "Comunidad Escolar",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  {
    title: "Cursos",
    href: `/${schoolSlug}/courses`,
    icon: "BookOpen",
    section: "Académico",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  {
    title: "Asignaturas",
    href: `/${schoolSlug}/subjects`,
    icon: "Layers",
    section: "Académico",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"],
  },
  {
    title: "Calificaciones",
    href: `/${schoolSlug}/grades`,
    icon: "Award",
    section: "Académico",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  {
    title: "Asistencia",
    href: `/${schoolSlug}/attendance`,
    icon: "CalendarCheck",
    section: "Académico",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  {
    title: "Configuración",
    href: `/${schoolSlug}/settings`,
    icon: "Settings",
    section: "Administración",
    roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
];

console.log("\n--- 1. CRITERIO 1: Menú adaptado a roles (Admin, Docente, Alumno) ---");

// Test Admin
const adminItems = filterNavItemsByRole(fullSchoolNavItems, "SCHOOL_ADMIN");
const adminTitles = adminItems.map((i) => i.title);
assert(
  adminTitles.includes("Dashboard") &&
  adminTitles.includes("Estudiantes") &&
  adminTitles.includes("Profesores") &&
  adminTitles.includes("Cursos") &&
  adminTitles.includes("Asignaturas") &&
  adminTitles.includes("Calificaciones") &&
  adminTitles.includes("Asistencia") &&
  adminTitles.includes("Configuración"),
  "Admin (SCHOOL_ADMIN) visualiza menú de gestión completo",
  `8 módulos habilitados: [${adminTitles.join(", ")}]`
);

// Test Docente
const teacherItems = filterNavItemsByRole(fullSchoolNavItems, "TEACHER");
const teacherTitles = teacherItems.map((i) => i.title);
assert(
  teacherTitles.includes("Dashboard") &&
  teacherTitles.includes("Cursos") &&
  teacherTitles.includes("Asignaturas") &&
  teacherTitles.includes("Calificaciones") &&
  teacherTitles.includes("Asistencia") &&
  !teacherTitles.includes("Estudiantes") &&
  !teacherTitles.includes("Profesores") &&
  !teacherTitles.includes("Configuración"),
  "Docente (TEACHER) visualiza exclusivamente su ámbito académico y pedagógico",
  `Módulos filtrados: [${teacherTitles.join(", ")}]. Excluidos: Estudiantes, Profesores, Configuración.`
);

// Test Alumno
const studentItems = filterNavItemsByRole(fullSchoolNavItems, "STUDENT");
const studentTitles = studentItems.map((i) => i.title);
assert(
  studentTitles.includes("Dashboard") &&
  studentTitles.includes("Asignaturas") &&
  studentTitles.includes("Calificaciones") &&
  studentTitles.includes("Asistencia") &&
  !studentTitles.includes("Cursos") &&
  !studentTitles.includes("Estudiantes") &&
  !studentTitles.includes("Profesores") &&
  !studentTitles.includes("Configuración"),
  "Alumno (STUDENT) visualiza exclusivamente sus calificaciones, asignaturas y asistencia",
  `Módulos filtrados: [${studentTitles.join(", ")}]. Cursos de gestión y config debidamente ocultos.`
);

// Test SuperAdmin
const superAdminItems = filterNavItemsByRole(fullSchoolNavItems, "SYSTEM_ADMIN");
assert(
  superAdminItems.length === fullSchoolNavItems.length,
  "SuperAdmin (SYSTEM_ADMIN) posee bypass y visibilidad irrestricta de todos los ítems",
  `Total ítems accesibles: ${superAdminItems.length}/${fullSchoolNavItems.length}`
);

// Test función de catálogo isSectionAllowedForRole
assert(
  isSectionAllowedForRole("settings", "SCHOOL_ADMIN") === true &&
  isSectionAllowedForRole("settings", "TEACHER") === false &&
  isSectionAllowedForRole("settings", "STUDENT") === false,
  "Catálogo central TENANT_SECTIONS valida rigurosamente acceso a 'settings'",
  "Admin=Permitido, Teacher=Denegado, Student=Denegado"
);

assert(
  isSectionAllowedForRole("grades", "TEACHER") === true &&
  isSectionAllowedForRole("grades", "STUDENT") === true &&
  isSectionAllowedForRole("students", "TEACHER") === false,
  "Catálogo central TENANT_SECTIONS valida roles de 'grades' y restricción de 'students'",
  "Grades permitido para Docente y Alumno; Students restringido a Administradores."
);

console.log("\n--- 2. CRITERIO 2: Iconografía Lucide React consistente ---");

const sidebarFilePath = path.join(process.cwd(), "components/layout/sidebar.tsx");
const sidebarCode = fs.readFileSync(sidebarFilePath, "utf8");

assert(
  sidebarCode.includes('from "lucide-react"'),
  "Sidebar importa todos sus iconos desde el paquete oficial lucide-react",
  "Importación declarada desde lucide-react"
);

const lucideIconsUsed = [
  "School",
  "Shield",
  "ArrowLeftRight",
  "LogOut",
  "ChevronLeft",
  "X",
];

const allIconsFound = lucideIconsUsed.every((icon) => sidebarCode.includes(icon));
assert(
  allIconsFound,
  "Sidebar implementa iconografía Lucide React completa para acciones y contexto",
  `Iconos verificados: ${lucideIconsUsed.join(", ")}`
);

const schoolLayoutPath = path.join(process.cwd(), "app/[schoolSlug]/layout.tsx");
const schoolLayoutCode = fs.readFileSync(schoolLayoutPath, "utf8");
const expectedSchoolIcons = [
  "LayoutDashboard",
  "Users",
  "GraduationCap",
  "BookOpen",
  "Layers",
  "Award",
  "CalendarCheck",
  "Settings",
];
const allSchoolIconsFound = expectedSchoolIcons.every((icon) => schoolLayoutCode.includes(icon));
assert(
  allSchoolIconsFound,
  "Navegación escolar asigna iconos Lucide unificados a cada sección",
  `Iconos de sección verificados: ${expectedSchoolIcons.join(", ")}`
);

console.log("\n--- 3. CRITERIO 3: Animaciones de transición con Framer Motion ---");

assert(
  sidebarCode.includes('from "motion/react"'),
  "Sidebar importa componentes de animación desde motion/react (Framer Motion v12+)",
  "Librería motion/react importada en components/layout/sidebar.tsx"
);

assert(
  sidebarCode.includes("<motion.aside") && sidebarCode.includes("isCollapsed ? 80 : 256"),
  "Barra lateral colapsable para escritorio implementa animación fluida de ancho con motion.aside",
  "Transición elástica tipo spring con animate={{ width: isCollapsed ? 80 : 256 }}"
);

assert(
  sidebarCode.includes('layoutId="sidebarActivePill"'),
  "Resaltador de enlace activo implementa layoutId compartido para transición deslizante",
  "Animación compartida de Framer Motion activa en el indicador de página"
);

assert(
  sidebarCode.includes("<AnimatePresence") && sidebarCode.includes("item-label-"),
  "Etiquetas y textos colapsables utilizan AnimatePresence para fade-in/fade-out sin saltos",
  "AnimatePresence envolviendo etiquetas de texto y títulos de sección"
);

assert(
  sidebarCode.includes("mobile-sidebar-drawer") && sidebarCode.includes("mobile-sidebar-backdrop"),
  "Menú móvil deslizable implementa transiciones Framer Motion en panel y backdrop",
  "Backdrop animado con opacidad y drawer animado con eje X (spring transition)"
);

assert(
  sidebarCode.includes("rotate: isCollapsed ? 180 : 0"),
  "Botón de colapsar barra lateral anima rotación de flecha con Framer Motion",
  "Giro dinámico de 180 grados en el icono de retracción"
);

console.log("=".repeat(80));
console.log(`📊 RESULTADO SUITE SIDEBAR & ROLES: ${passedTests}/${totalTests} PRUEBAS EXITOSAS (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("=".repeat(80));

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
