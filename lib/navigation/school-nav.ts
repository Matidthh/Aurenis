import {
  Award,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS, type PermissionCode } from "@/lib/constants/permissions";

/**
 * Claves serializables de iconos (no JSX).
 * El componente Lucide se resuelve en el módulo que renderiza vía SCHOOL_NAV_ICONS.
 */
export const SCHOOL_NAV_ICONS = {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Award,
  CalendarCheck,
  Settings,
} as const satisfies Record<string, LucideIcon>;

export type SchoolNavIconName = keyof typeof SCHOOL_NAV_ICONS;

export type SchoolNavGroupId =
  | "resumen"
  | "personas"
  | "academico"
  | "seguimiento"
  | "institucion";

export interface SchoolNavItemDefinition {
  id: string;
  label: string;
  /** Segmento de ruta existente, p. ej. "dashboard" → /{schoolSlug}/dashboard */
  pathSegment: string;
  icon: SchoolNavIconName;
  /**
   * `null` = visible para cualquier usuario con acceso al tenant (Dashboard).
   * El resto replica las condiciones actuales del layout institucional.
   */
  permission: PermissionCode | null;
}

export interface SchoolNavGroupDefinition {
  id: SchoolNavGroupId;
  label: string;
  items: SchoolNavItemDefinition[];
}

/** Ítem ya resuelto y serializable (apto para pasar de Server a Client). */
export interface SchoolNavItem {
  id: string;
  label: string;
  href: string;
  icon: SchoolNavIconName;
}

export interface SchoolNavGroup {
  id: SchoolNavGroupId;
  label: string;
  items: SchoolNavItem[];
}

export interface SchoolNavFilterContext {
  roleName: string;
  permissions: string[];
}

export function buildSchoolNavHref(schoolSlug: string, pathSegment: string): string {
  return `/${schoolSlug}/${pathSegment}`;
}

/**
 * Catálogo institucional. Rutas e iconos iguales a `app/[schoolSlug]/layout.tsx`.
 * Permisos idénticos a ese layout (Profesores = Estudiantes, Asignaturas = Cursos).
 */
export const SCHOOL_NAV_GROUPS: SchoolNavGroupDefinition[] = [
  {
    id: "resumen",
    label: "Resumen",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        pathSegment: "dashboard",
        icon: "LayoutDashboard",
        permission: null,
      },
    ],
  },
  {
    id: "personas",
    label: "Personas",
    items: [
      {
        id: "students",
        label: "Estudiantes",
        pathSegment: "students",
        icon: "Users",
        permission: PERMISSIONS.PEOPLE_STUDENTS_MANAGE,
      },
      {
        id: "teachers",
        label: "Profesores",
        pathSegment: "teachers",
        icon: "GraduationCap",
        permission: PERMISSIONS.PEOPLE_STUDENTS_MANAGE,
      },
    ],
  },
  {
    id: "academico",
    label: "Académico",
    items: [
      {
        id: "courses",
        label: "Cursos",
        pathSegment: "courses",
        icon: "BookOpen",
        permission: PERMISSIONS.ACADEMIC_COURSES_MANAGE,
      },
      {
        id: "subjects",
        label: "Asignaturas",
        pathSegment: "subjects",
        icon: "Layers",
        permission: PERMISSIONS.ACADEMIC_COURSES_MANAGE,
      },
    ],
  },
  {
    id: "seguimiento",
    label: "Seguimiento",
    items: [
      {
        id: "grades",
        label: "Calificaciones",
        pathSegment: "grades",
        icon: "Award",
        permission: PERMISSIONS.GRADES_VIEW,
      },
      {
        id: "attendance",
        label: "Asistencia",
        pathSegment: "attendance",
        icon: "CalendarCheck",
        permission: PERMISSIONS.ATTENDANCE_VIEW,
      },
    ],
  },
  {
    id: "institucion",
    label: "Institución",
    items: [
      {
        id: "settings",
        label: "Configuración",
        pathSegment: "settings",
        icon: "Settings",
        permission: PERMISSIONS.SCHOOL_SETTINGS_VIEW,
      },
    ],
  },
];

function canSeeSchoolNavItem(
  item: SchoolNavItemDefinition,
  context: SchoolNavFilterContext
): boolean {
  if (item.permission === null) {
    return true;
  }

  return (
    context.roleName === "SYSTEM_ADMIN" || hasPermission(context, item.permission)
  );
}

/**
 * Filtra el catálogo en el Server Component (sesión + tenant + permisos).
 * El resultado no incluye componentes React: solo strings serializables.
 */
export function getVisibleSchoolNav(
  schoolSlug: string,
  context: SchoolNavFilterContext
): SchoolNavGroup[] {
  return SCHOOL_NAV_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    items: group.items
      .filter((item) => canSeeSchoolNavItem(item, context))
      .map((item) => ({
        id: item.id,
        label: item.label,
        href: buildSchoolNavHref(schoolSlug, item.pathSegment),
        icon: item.icon,
      })),
  })).filter((group) => group.items.length > 0);
}
