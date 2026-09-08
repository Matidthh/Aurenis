import type { LucideIcon } from "lucide-react";
import { SCHOOL_NAV_ICONS } from "./school-nav";
import { SYSTEM_NAV_ICONS } from "./system-nav";

/**
 * Registro centralizado de iconos para la navegación de Aurenis.
 * Mapea los identificadores serializables (strings) generados por los contratos
 * a sus respectivos componentes LucideIcon.
 */
export const NAV_ICONS: Record<string, LucideIcon> = {
  ...SCHOOL_NAV_ICONS,
  ...SYSTEM_NAV_ICONS,
};

export function getNavIcon(name: string): LucideIcon | undefined {
  return NAV_ICONS[name];
}
