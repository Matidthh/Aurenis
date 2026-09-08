"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, ChevronsUpDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/avatar";

export interface UserIdentityData {
  name: string;
  email: string;
  roleName: string;
  roleDisplayName: string;
  schoolName?: string;
  showSwitchSchool?: boolean;
}

export interface UserMenuProps {
  user: UserIdentityData;
  className?: string;
  /** Callback opcional invocado al hacer click en una acción (p. ej. cerrar drawer móvil). */
  onAction?: () => void;
}

/**
 * Menú emergente de identidad de usuario para el footer del Sidebar / Drawer.
 * Muestra el avatar con iniciales, nombre, email, rol legible y opciones (cambio de colegio, logout).
 *
 * Totalmente accesible con navegación por teclado, cierre con Escape y clic externo.
 */
export function UserMenu({ user, className, onAction }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Cerrar el menú al cambiar de ruta
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Manejo de clic externo y tecla Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleActionClick = () => {
    setIsOpen(false);
    onAction?.();
  };

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Botón trigger: Tarjeta compacta del usuario */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="user-account-menu"
        aria-label="Menú de cuenta de usuario"
        className={cn(
          "w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors select-none",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
          isOpen && "bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700"
        )}
      >
        <Avatar name={user.name} email={user.email} size="md" />

        <div className="min-w-0 flex-1">
          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate block">
            {user.name || user.email}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
            {user.roleDisplayName}
          </span>
        </div>

        <ChevronsUpDown
          className={cn(
            "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150",
            isOpen && "text-slate-600 dark:text-slate-200"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Popover Menu desplegable hacia arriba */}
      {isOpen && (
        <div
          id="user-account-menu"
          role="menu"
          aria-label="Opciones de cuenta"
          className={cn(
            "absolute bottom-full mb-2 left-0 right-0 z-50",
            "bg-white dark:bg-slate-900 rounded-xl",
            "border border-slate-200 dark:border-slate-800",
            "shadow-lg dark:shadow-slate-950/60 p-1.5 space-y-1"
          )}
        >
          {/* Cabecera descriptiva */}
          <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {user.roleDisplayName}
              </span>
              {user.schoolName && (
                <span
                  className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 truncate max-w-[140px]"
                  title={user.schoolName}
                >
                  {user.schoolName}
                </span>
              )}
            </div>
          </div>

          {/* Acción: Cambiar de Colegio */}
          {user.showSwitchSchool && (
            <Link
              href="/select-school"
              role="menuitem"
              onClick={handleActionClick}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium",
                "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              )}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span>Cambiar de Colegio</span>
            </Link>
          )}

          {/* Acción: Cerrar Sesión */}
          <a
            href="/api/auth/logout"
            role="menuitem"
            onClick={handleActionClick}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium",
              "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            )}
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </a>
        </div>
      )}
    </div>
  );
}
