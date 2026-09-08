"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import type { SidebarProps } from "./sidebar";

export interface MobileNavProps {
  sidebar: SidebarProps;
  className?: string;
}

/**
 * Navegación móvil y tablet (< lg) de Aurenis.
 *
 * Incluye:
 * - MobileHeader: barra superior visible en móvil/tablet con brand y botón hamburger.
 * - MobileDrawer: panel lateral deslizante accesible con backdrop overlay, bloqueo
 *   de scroll, cierre con tecla Escape, trampa de foco básica y auto-cierre al navegar.
 */
export function MobileNav({ sidebar, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const triggerButtonRef = React.useRef<HTMLButtonElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const wasOpenRef = React.useRef(false);

  // Cerrar el drawer automáticamente al cambiar de ruta
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Cerrar con tecla Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Bloqueo de scroll en el fondo mientras el drawer está abierto
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Si la pantalla se redimensiona a desktop (>= 1024px), cerrar drawer
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Gestión de foco: al abrir enfoca el botón de cierre; al cerrar restaura foco al trigger
  React.useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      // Pequeño timeout para permitir montaje del DOM del drawer
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* MobileHeader: Barra superior para móvil y tablet (< lg) */}
      <header
        className={cn(
          "lg:hidden shrink-0 h-16 px-4 sm:px-6 bg-white dark:bg-slate-900",
          "border-b border-slate-200 dark:border-slate-800",
          "flex items-center justify-between z-30",
          className
        )}
      >
        <div className="flex items-center gap-3 min-w-0 mr-2">
          {sidebar.brand.icon && (
            <div className="shrink-0 scale-90 sm:scale-100">{sidebar.brand.icon}</div>
          )}
          <div className="min-w-0">
            <h1
              className="font-bold text-sm tracking-tight truncate"
              title={sidebar.brand.name}
            >
              {sidebar.brand.name}
            </h1>
            {sidebar.brand.subtitle && (
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {sidebar.brand.subtitle}
              </span>
            )}
          </div>
        </div>

        <Button
          ref={triggerButtonRef}
          variant="ghost"
          size="icon"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar-drawer"
          onClick={() => setIsOpen(true)}
          className="shrink-0 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </Button>
      </header>

      {/* Drawer & Backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Lateral */}
          <aside
            id="mobile-sidebar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            tabIndex={-1}
            className={cn(
              "relative z-50 w-72 sm:w-80 max-w-[85vw] h-full",
              "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800",
              "shadow-2xl flex flex-col focus:outline-none"
            )}
          >
            {/* Cabecera del Drawer */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {sidebar.brand.icon && (
                  <div className="shrink-0 scale-90 sm:scale-100">{sidebar.brand.icon}</div>
                )}
                <div className="min-w-0">
                  <h2
                    className="font-bold text-sm tracking-tight truncate"
                    title={sidebar.brand.name}
                  >
                    {sidebar.brand.name}
                  </h2>
                  {sidebar.brand.subtitle && (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {sidebar.brand.subtitle}
                    </span>
                  )}
                </div>
              </div>

              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                aria-label="Cerrar menú"
                onClick={() => setIsOpen(false)}
                className="shrink-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>

            {/* Contenido de navegación */}
            <div className="flex-1 overflow-y-auto">
              <SidebarNav
                groups={sidebar.groups}
                onItemClick={() => setIsOpen(false)}
              />
            </div>

            {/* Footer / User Identity del Drawer */}
            {(sidebar.user || sidebar.footer) && (
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
                {sidebar.user ? (
                  <UserMenu user={sidebar.user} onAction={() => setIsOpen(false)} />
                ) : (
                  sidebar.footer
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
