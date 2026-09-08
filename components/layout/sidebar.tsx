import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu, type UserIdentityData } from "./user-menu";

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface SidebarNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface SidebarNavGroup {
  id: string;
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarBrand {
  /** Nombre principal (colegio o "Aurenis Core"). */
  name: string;
  /** Subtítulo o rol. */
  subtitle?: string;
  /** Icono del brand. */
  icon?: React.ReactNode;
}

export interface SidebarProps {
  brand: SidebarBrand;
  groups: SidebarNavGroup[];
  /** Datos de identidad del usuario actual para el UserMenu. */
  user?: UserIdentityData;
  /** Contenido libre para el footer (fallback si no se proporciona user). */
  footer?: React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

/**
 * Sidebar presentacional reutilizable (Server Component).
 * No consulta sesión, permisos ni Prisma — recibe todo por props.
 * Delega la navegación a SidebarNav y la identidad a UserMenu.
 */
export function Sidebar({ brand, groups, user, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-slate-200 dark:border-slate-800",
        "bg-white dark:bg-slate-900 flex flex-col",
        className
      )}
    >
      {/* Brand */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {brand.icon && (
            <div className="shrink-0">{brand.icon}</div>
          )}
          <div className="min-w-0 flex-1">
            <h2
              className="font-bold text-sm tracking-tight truncate"
              title={brand.name}
            >
              {brand.name}
            </h2>
            {brand.subtitle && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {brand.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navegación (Client Component con usePathname y active route) */}
      <SidebarNav groups={groups} />

      {/* Footer / User Identity */}
      {(user || footer) && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {user ? <UserMenu user={user} /> : footer}
        </div>
      )}
    </aside>
  );
}
