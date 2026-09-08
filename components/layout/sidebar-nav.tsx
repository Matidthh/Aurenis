"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { getNavIcon } from "@/lib/navigation/nav-icons";
import { isRouteActive } from "@/lib/navigation/active-route";
import type { SidebarNavGroup } from "./sidebar";

export interface SidebarNavProps {
  groups: SidebarNavGroup[];
  className?: string;
  /** Callback opcional invocado al hacer click en un enlace (p. ej. para cerrar drawer móvil). */
  onItemClick?: () => void;
}

/**
 * Componente cliente para la navegación del Sidebar.
 * Utiliza `usePathname` de Next.js exclusivamente para detectar y reflejar
 * el estado visual activo de las rutas, manteniendo el layout y el Sidebar
 * como Server Components.
 */
export function SidebarNav({ groups, className, onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex-1 overflow-y-auto p-4 space-y-6", className)}>
      {groups.map((group) => (
        <div key={group.id}>
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = getNavIcon(item.icon);
              const isActive = pathname ? isRouteActive(pathname, item.href) : false;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors select-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold hover:bg-brand-100/70 dark:hover:bg-brand-900/50"
                      : "font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
