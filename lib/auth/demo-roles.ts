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
    roleTitle: "Director",
    roleSystemName: "SCHOOL_ADMIN",
    badgeLabel: "Admin Escolar",
    name: "Carlos Mendoza",
    email: "director@sanjose.cl",
    pass: "AdminCSJ2026!",
    description: "Gestión directiva y académica de la institución",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    activeColor: "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100",
    targetUrl: "/colegio-san-jose/dashboard",
  },
  {
    id: "demo-profesor",
    roleKey: "profesor",
    roleTitle: "Docente",
    roleSystemName: "TEACHER",
    badgeLabel: "Profesor",
    name: "Roberto Gómez",
    email: "profesor.matematica@sanjose.cl",
    pass: "Profesor2026!",
    description: "Libro de clases digital, notas y asistencia",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    activeColor: "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100",
    targetUrl: "/colegio-san-jose/dashboard",
  },
  {
    id: "demo-alumno",
    roleKey: "alumno",
    roleTitle: "Alumno",
    roleSystemName: "STUDENT",
    badgeLabel: "Estudiante",
    name: "Sofía Valenzuela",
    email: "sofia.valenzuela@sanjose.cl",
    pass: "Estudiante2026!",
    description: "Visualización de calificaciones y asignaturas",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    activeColor: "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-100",
    targetUrl: "/colegio-san-jose/dashboard",
  },
  {
    id: "demo-superadmin",
    roleKey: "superadmin",
    roleTitle: "SuperAdmin",
    roleSystemName: "SYSTEM_ADMIN",
    badgeLabel: "Global",
    name: "SuperAdmin Aurenis",
    email: "admin@aurenis.com",
    pass: "AurenisSuperAdmin2026!",
    description: "Panel de control global y gestión de instituciones",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    activeColor: "ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100",
    targetUrl: "/system/dashboard",
  },
  {
    id: "demo-apoderado",
    roleKey: "apoderado",
    roleTitle: "Apoderado",
    roleSystemName: "GUARDIAN",
    badgeLabel: "Familia",
    name: "María González",
    email: "maria.gonzalez@sanjose.cl",
    pass: "Apoderado2026!",
    description: "Seguimiento pedagógico de pupilos e hijos",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    activeColor: "ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100",
    targetUrl: "/colegio-san-jose/dashboard",
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
