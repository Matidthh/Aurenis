import { Building2, Shield, type LucideIcon } from "lucide-react";

/**
 * Claves serializables de iconos (no JSX).
 * El componente Lucide se resuelve vía SYSTEM_NAV_ICONS en quien renderice.
 */
export const SYSTEM_NAV_ICONS = {
  Shield,
  Building2,
} as const satisfies Record<string, LucideIcon>;

export type SystemNavIconName = keyof typeof SYSTEM_NAV_ICONS;

export type SystemNavGroupId = "panel" | "instituciones";

export interface SystemNavItemDefinition {
  id: string;
  label: string;
  href: string;
  icon: SystemNavIconName;
}

export interface SystemNavGroupDefinition {
  id: SystemNavGroupId;
  label: string;
  items: SystemNavItemDefinition[];
}

export type SystemNavItem = SystemNavItemDefinition;

export interface SystemNavGroup {
  id: SystemNavGroupId;
  label: string;
  items: SystemNavItem[];
}

/**
 * Catálogo del Control Plane.
 * Rutas e iconos alineados con `app/system/layout.tsx`.
 * `/system/schools/new` no forma parte del menú permanente.
 */
export const SYSTEM_NAV_GROUPS: SystemNavGroupDefinition[] = [
  {
    id: "panel",
    label: "Panel",
    items: [
      {
        id: "dashboard",
        label: "Panel General",
        href: "/system/dashboard",
        icon: "Shield",
      },
    ],
  },
  {
    id: "instituciones",
    label: "Instituciones",
    items: [
      {
        id: "schools",
        label: "Colegios e Instituciones",
        href: "/system/schools",
        icon: "Building2",
      },
    ],
  },
];

/**
 * El layout de sistema ya exige isSystemAdmin.
 * Este helper deja el mismo contrato serializable que la nav institucional.
 */
export function getVisibleSystemNav(): SystemNavGroup[] {
  return SYSTEM_NAV_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    items: group.items.map((item) => ({ ...item })),
  }));
}
