export interface DemoRoleAccount {
  id: string;
  roleKey: "director" | "profesor" | "alumno" | "superadmin" | "apoderado";
  roleTitle: string;
  roleSystemName: "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "SYSTEM_ADMIN" | "GUARDIAN";
  badgeLabel: string;
  name: string;
  email: string;
  pass: string;
  description: string;
  badgeColor: string;
  activeColor: string;
  targetUrl: string;
}

export const DEMO_ROLES: DemoRoleAccount[] = [
  {
    id: "demo-director",
    roleKey: "director",
    roleTitle: "Director / Admin Escolar",
    roleSystemName: "SCHOOL_ADMIN",
    badgeLabel: "Admin LPMM",
    name: "Dirección Liceo Marga Marga",
    email: "director@lpmm.cl",
    pass: "AdminLPMM2026!",
    description: "Gestión directiva, libro digital de clases y métricas de desempeño",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    activeColor: "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
    targetUrl: "/lpmm/dashboard",
  },
  {
    id: "demo-profesor",
    roleKey: "profesor",
    roleTitle: "Docente Jefatura",
    roleSystemName: "TEACHER",
    badgeLabel: "Profesor LPMM",
    name: "Rodrigo Castro Díaz",
    email: "profesor.rodrigo@lpmm.cl",
    pass: "ProfesorLpmm2026!",
    description: "Libro de clases digital official LPMM, notas 1° Medio A y asistencia",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    activeColor: "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100",
    targetUrl: "/lpmm/dashboard",
  },
  {
    id: "demo-alumno",
    roleKey: "alumno",
    roleTitle: "Estudiante 1° Medio A",
    roleSystemName: "STUDENT",
    badgeLabel: "Estudiante LPMM",
    name: "Yamir Alonso Ahumada",
    email: "estudiante.1@lpmm.cl",
    pass: "EstudianteLpmm2026!",
    description: "Visualización de calificaciones y asistencia sincronizadas con libro digital",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    activeColor: "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-100",
    targetUrl: "/lpmm/dashboard",
  },
  {
    id: "demo-apoderado",
    roleKey: "apoderado",
    roleTitle: "Apoderada LPMM",
    roleSystemName: "GUARDIAN",
    badgeLabel: "Familia LPMM",
    name: "María Belén Ahumada",
    email: "apoderado.1@lpmm.cl",
    pass: "ApoderadoLpmm2026!",
    description: "Seguimiento pedagógico de pupilos, citaciones y notas en vivo",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    activeColor: "ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100",
    targetUrl: "/lpmm/dashboard",
  },
  {
    id: "demo-superadmin",
    roleKey: "superadmin",
    roleTitle: "SuperAdmin Global",
    roleSystemName: "SYSTEM_ADMIN",
    badgeLabel: "Platform Admin",
    name: "SuperAdmin Aurenis",
    email: "admin@aurenis.com",
    pass: "AurenisSuperAdmin2026!",
    description: "Panel de control central y administración del sistema",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    activeColor: "ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100",
    targetUrl: "/system/dashboard",
  },
];

/**
 * Función que determina qué cuenta demo coincide con la sesión actual
 */
export function findMatchingDemoRole(email?: string, roleName?: string): DemoRoleAccount | undefined {
  if (!email && !roleName) return undefined;
  return DEMO_ROLES.find(
    (role) => (email && role.email.toLowerCase() === email.toLowerCase()) || (roleName && role.roleSystemName === roleName)
  );
}

/**
 * Función para ejecutar el cambio de sesión a una cuenta demo
 */
export async function executeRoleSwitch(account: DemoRoleAccount): Promise<string> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: account.email, password: account.pass }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "No se pudo cambiar al rol seleccionado.");
  }

  return data.redirectUrl || account.targetUrl;
}
