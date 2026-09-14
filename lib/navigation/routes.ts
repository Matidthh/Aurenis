/**
 * Aurenis Navigation & Route Definitions
 * Fuente central de verdad para rutas públicas, privadas, permisos y metadatos de navegación.
 */

export type RouteScope = "public" | "auth" | "tenant" | "system" | "api";

export interface RouteMetadata {
  path: string;
  title: string;
  breadcrumbLabel: string;
  isPublic: boolean;
  scope: RouteScope;
  section?: string;
  iconName?: string;
  exactMatch?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
  iconName?: string;
}

/**
 * Catálogo de Rutas Públicas (no requieren sesión activa)
 */
export const PUBLIC_ROUTES: Record<string, RouteMetadata> = {
  HOME: {
    path: "/",
    title: "Inicio",
    breadcrumbLabel: "Inicio",
    isPublic: true,
    scope: "public",
    exactMatch: true,
  },
  LOGIN: {
    path: "/login",
    title: "Iniciar Sesión",
    breadcrumbLabel: "Acceso",
    isPublic: true,
    scope: "public",
  },
  FORGOT_PASSWORD: {
    path: "/forgot-password",
    title: "Recuperar Contraseña",
    breadcrumbLabel: "Recuperar Clave",
    isPublic: true,
    scope: "public",
  },
  API_AUTH_LOGIN: {
    path: "/api/auth/login",
    title: "API Login",
    breadcrumbLabel: "API Login",
    isPublic: true,
    scope: "api",
  },
  API_AUTH_LOGOUT: {
    path: "/api/auth/logout",
    title: "API Logout",
    breadcrumbLabel: "API Logout",
    isPublic: true,
    scope: "api",
  },
};

/**
 * Rutas de Autenticación Intermedia (requieren sesión pero pueden no tener tenant activo)
 */
export const AUTH_ROUTES: Record<string, RouteMetadata> = {
  SELECT_SCHOOL: {
    path: "/select-school",
    title: "Seleccionar Institución",
    breadcrumbLabel: "Seleccionar Institución",
    isPublic: false,
    scope: "auth",
  },
  API_AUTH_SELECT_SCHOOL: {
    path: "/api/auth/select-school",
    title: "API Seleccionar Colegio",
    breadcrumbLabel: "API Seleccionar Colegio",
    isPublic: false,
    scope: "api",
  },
};

/**
 * Rutas del Panel Global de Administración (SuperAdmin)
 */
export const SYSTEM_ROUTES: Record<string, RouteMetadata> = {
  SYSTEM_ROOT: {
    path: "/system",
    title: "Sistema Global",
    breadcrumbLabel: "Sistema",
    isPublic: false,
    scope: "system",
  },
  DASHBOARD: {
    path: "/system/dashboard",
    title: "Panel General",
    breadcrumbLabel: "Panel General",
    isPublic: false,
    scope: "system",
    section: "Supervisión Global",
    iconName: "Shield",
  },
  SECURITY: {
    path: "/system/security",
    title: "Seguridad y Auditoría",
    breadcrumbLabel: "Seguridad",
    isPublic: false,
    scope: "system",
    section: "Supervisión Global",
    iconName: "ShieldCheck",
  },
  SCHOOLS: {
    path: "/system/schools",
    title: "Colegios e Instituciones",
    breadcrumbLabel: "Colegios e Instituciones",
    isPublic: false,
    scope: "system",
    section: "Ecosistema Escolar",
    iconName: "Building2",
  },
  SCHOOLS_NEW: {
    path: "/system/schools/new",
    title: "Nuevo Colegio",
    breadcrumbLabel: "Nuevo Colegio",
    isPublic: false,
    scope: "system",
    section: "Ecosistema Escolar",
    iconName: "PlusCircle",
  },
  DESIGN_SYSTEM: {
    path: "/system/design-system",
    title: "Design System (Lucas)",
    breadcrumbLabel: "Design System",
    isPublic: false,
    scope: "system",
    section: "Ecosistema Escolar",
    iconName: "Palette",
  },
};

/**
 * Secciones y Módulos Multi-Tenant por Colegio
 * Ruta base: /[schoolSlug]/...
 */
export const TENANT_SECTIONS = {
  dashboard: {
    subPath: "dashboard",
    title: "Dashboard",
    breadcrumbLabel: "Dashboard",
    section: "Principal",
    iconName: "LayoutDashboard",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  students: {
    subPath: "students",
    title: "Estudiantes",
    breadcrumbLabel: "Estudiantes",
    section: "Comunidad Escolar",
    iconName: "Users",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  teachers: {
    subPath: "teachers",
    title: "Profesores",
    breadcrumbLabel: "Profesores",
    section: "Comunidad Escolar",
    iconName: "GraduationCap",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
  courses: {
    subPath: "courses",
    title: "Cursos",
    breadcrumbLabel: "Cursos",
    section: "Académico",
    iconName: "BookOpen",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
  },
  subjects: {
    subPath: "subjects",
    title: "Asignaturas",
    breadcrumbLabel: "Asignaturas",
    section: "Académico",
    iconName: "Layers",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"],
  },
  grades: {
    subPath: "grades",
    title: "Calificaciones",
    breadcrumbLabel: "Calificaciones",
    section: "Académico",
    iconName: "Award",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  attendance: {
    subPath: "attendance",
    title: "Asistencia",
    breadcrumbLabel: "Asistencia",
    section: "Académico",
    iconName: "CalendarCheck",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
  },
  settings: {
    subPath: "settings",
    title: "Configuración",
    breadcrumbLabel: "Configuración",
    section: "Administración",
    iconName: "Settings",
    allowedRoles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
  },
} as const;

export type TenantSectionKey = keyof typeof TENANT_SECTIONS;

/**
 * Verifica si una sección escolar está permitida para un rol específico
 */
export function isSectionAllowedForRole(sectionKey: TenantSectionKey, roleName?: string): boolean {
  if (!roleName) return false;
  if (roleName === "SYSTEM_ADMIN") return true;
  const section = TENANT_SECTIONS[sectionKey];
  if (!section) return false;
  return (section.allowedRoles as readonly string[]).includes(roleName);
}

/**
 * Filtra elementos de navegación según el rol del usuario conectado
 */
export function filterNavItemsByRole<T extends { roles?: string[] }>(items: T[], userRole?: string): T[] {
  if (!userRole) return items;
  if (userRole === "SYSTEM_ADMIN") return items;

  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  });
}

/**
 * Verifica si una ruta es pública y no requiere sesión
 */
export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname === "/forgot-password" || pathname.startsWith("/forgot-password/")) return true;
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") return true;
  if (pathname === "/_not-found" || pathname === "/404" || pathname === "/500" || pathname === "/_error") return true;
  return false;
}

/**
 * Verifica si una ruta es privada (requiere autenticación)
 */
export function isPrivateRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

/**
 * Verifica si una ruta corresponde al Panel de SuperAdmin Global
 */
export function isSystemRoute(pathname: string): boolean {
  return pathname.startsWith("/system") || pathname.startsWith("/api/system");
}

/**
 * Construye la URL canónica de un módulo tenant
 */
export function buildTenantPath(schoolSlug: string, section?: TenantSectionKey): string {
  if (!section) return `/${schoolSlug}/dashboard`;
  return `/${schoolSlug}/${TENANT_SECTIONS[section].subPath}`;
}

/**
 * Comprueba de forma robusta si un enlace o sección está activo en función de la ruta actual
 */
export function isRouteActive(currentPath: string, targetHref: string, exact: boolean = false): boolean {
  if (!currentPath || !targetHref) return false;

  // Normalizar removiendo slash final si existe (excepto si es "/")
  const normCurrent = currentPath.length > 1 && currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath;
  const normTarget = targetHref.length > 1 && targetHref.endsWith("/") ? targetHref.slice(0, -1) : targetHref;

  if (exact || normTarget === "/") {
    return normCurrent === normTarget;
  }

  // Coincidencia exacta
  if (normCurrent === normTarget) {
    return true;
  }

  // Coincidencia por prefijo (ej: /colegio/courses/123 activa /colegio/courses)
  if (normCurrent.startsWith(normTarget + "/")) {
    return true;
  }

  return false;
}

/**
 * Genera el array jerárquico de migas de pan (Breadcrumbs)
 * para cualquier ruta del sistema o tenant escolar.
 */
export function generateBreadcrumbs(
  pathname: string,
  context?: {
    schoolName?: string;
    schoolSlug?: string;
  }
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  // Rutas del Panel Global de SuperAdmin (/system/...)
  if (pathname.startsWith("/system")) {
    const isDashboard = pathname === "/system" || pathname === "/system/dashboard";
    crumbs.push({
      label: "Panel Global",
      href: "/system/dashboard",
      isCurrent: isDashboard,
      iconName: "Shield",
    });

    if (pathname.includes("/schools/new")) {
      crumbs.push({
        label: "Instituciones",
        href: "/system/schools",
        isCurrent: false,
      });
      crumbs.push({
        label: "Nuevo Colegio",
        href: "/system/schools/new",
        isCurrent: true,
      });
    } else if (pathname.includes("/schools")) {
      crumbs.push({
        label: "Colegios e Instituciones",
        href: "/system/schools",
        isCurrent: true,
      });
    } else if (pathname.includes("/design-system")) {
      crumbs.push({
        label: "Design System",
        href: "/system/design-system",
        isCurrent: true,
      });
    } else if (pathname.includes("/security")) {
      crumbs.push({
        label: "Seguridad y Auditoría",
        href: "/system/security",
        isCurrent: true,
      });
    }

    return crumbs;
  }

  // Ruta intermedia de selección de colegio
  if (pathname === "/select-school") {
    crumbs.push({
      label: "Inicio",
      href: "/",
      isCurrent: false,
      iconName: "Home",
    });
    crumbs.push({
      label: "Selección de Institución",
      href: "/select-school",
      isCurrent: true,
    });
    return crumbs;
  }

  // Rutas de Institución Escolar (/[schoolSlug]/...)
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0) {
    const slug = context?.schoolSlug || segments[0];
    const schoolDisplayName = context?.schoolName || "Institución Escolar";
    const isRootSchool = segments.length === 1 || (segments.length === 2 && segments[1] === "dashboard");

    crumbs.push({
      label: schoolDisplayName,
      href: `/${slug}/dashboard`,
      isCurrent: isRootSchool,
      iconName: "School",
    });

    if (segments.length >= 2 && segments[1] !== "dashboard") {
      const sectionKey = segments[1] as TenantSectionKey;
      const sectionMeta = TENANT_SECTIONS[sectionKey];
      const sectionLabel = sectionMeta ? sectionMeta.breadcrumbLabel : capitalize(segments[1]);
      const sectionHref = `/${slug}/${segments[1]}`;
      const isSectionCurrent = segments.length === 2;

      crumbs.push({
        label: sectionLabel,
        href: sectionHref,
        isCurrent: isSectionCurrent,
      });

      // Segmentos anidados adicionales (ej: /[schoolSlug]/courses/[courseId])
      if (segments.length > 2) {
        for (let i = 2; i < segments.length; i++) {
          const subSegment = segments[i];
          const subHref = `/${slug}/${segments.slice(1, i + 1).join("/")}`;
          const isCurrent = i === segments.length - 1;

          crumbs.push({
            label: formatSegmentLabel(subSegment),
            href: subHref,
            isCurrent,
          });
        }
      }
    }
  }

  return crumbs;
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

function formatSegmentLabel(segment: string): string {
  if (!segment) return "";
  if (segment === "new") return "Nuevo Registro";
  if (segment === "edit") return "Editar";
  
  // Convertir kebab-case o snake_case a Title Case por palabra (ej: 1ro-medio-a -> 1ro Medio A)
  return segment
    .split(/[-_]/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}
