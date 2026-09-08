import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Sidebar, type SidebarProps } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export interface AppShellProps {
  /** Props para el Sidebar reutilizable. */
  sidebar: SidebarProps;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shell de aplicación Aurenis (Desktop, Tablet, Mobile).
 *
 * Estructura:
 * - Mobile / Tablet (< lg): MobileHeader fijo superior con hamburger + MobileDrawer.
 * - Desktop (>= lg): Sidebar permanente de 256px.
 * - Main: scroll independiente, min-w-0 para evitar overflow y padding responsive.
 *
 * Reutilizable para contexto institucional (/{schoolSlug}) y sistema (/system).
 */
export function AppShell({ sidebar, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "h-screen h-dvh overflow-hidden flex flex-col lg:flex-row bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
        className
      )}
    >
      {/* Navegación móvil y tablet (< lg) */}
      <MobileNav sidebar={sidebar} />

      {/* Sidebar permanente desktop (>= lg) */}
      <Sidebar {...sidebar} className="hidden lg:flex" />

      {/* Contenido principal con scroll vertical independiente */}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
