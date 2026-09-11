"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Sun,
  Moon,
  School,
  ChevronRight,
  Shield,
  LogOut,
  User,
  Check,
} from "lucide-react";
import { UserSessionInfo, SchoolContextInfo } from "./types";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  user: UserSessionInfo;
  schoolContext?: SchoolContextInfo;
}

export function Header({
  isCollapsed,
  onToggleCollapse,
  onOpenMobile,
  onOpenSearch,
  user,
  schoolContext,
}: HeaderProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Alternar modo oscuro básico en la clase HTML
  function toggleTheme() {
    if (typeof document !== "undefined") {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark");
        setIsDark(true);
      }
    }
  }

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 gap-3">
        {/* Lado Izquierdo: Botones de menú y Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Botón menú Móvil */}
          <button
            id="header-mobile-toggle-btn"
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Abrir barra lateral móvil"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Botón Colapsar Desktop */}
          <button
            id="header-desktop-collapse-btn"
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition focus:outline-none"
            aria-label="Colapsar o expandir barra lateral"
            title={isCollapsed ? "Expandir menú (Ctrl+B)" : "Colapsar menú (Ctrl+B)"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          {/* Migas de Pan (Breadcrumbs) Superiores */}
          <Breadcrumbs
            schoolContext={schoolContext}
            className="hidden sm:flex"
          />
        </div>

        {/* Centro: Barra de Búsqueda Rápida (Command Palette Trigger) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <button
            id="header-search-trigger"
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition group focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
              <span className="truncate">Buscar módulo, curso o vista...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Lado Derecho: Controles, Switcher y Perfil */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Badge del Colegio Activo con acceso a cambio */}
          {schoolContext && (
            <Link
              id="header-school-badge-link"
              href="/select-school"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition"
              title="Colegio activo (clic para cambiar)"
            >
              <School className="w-3.5 h-3.5" />
              <span className="max-w-[120px] truncate">{schoolContext.schoolName}</span>
            </Link>
          )}

          {/* Toggle Modo Oscuro / Claro */}
          <button
            id="header-theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition"
            aria-label="Alternar tema oscuro o claro"
            title="Alternar tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notificaciones */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition relative"
              aria-label="Ver notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div
                id="header-notifications-menu"
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 space-y-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                  <span>Notificaciones</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    2 nuevas
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Asistencia Actualizada</p>
                    <p className="text-slate-400 text-[11px]">Se procesaron los registros matutinos.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Acta de Notas Publicada</p>
                    <p className="text-slate-400 text-[11px]">Evaluación de Matemáticas 1° Medio A.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menú de Usuario / Perfil */}
          <div className="relative">
            <button
              id="header-user-menu-btn"
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.firstName ? user.firstName[0] : "A"}{user.lastName ? user.lastName[0] : ""}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <span className="block font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">
                  {user.roleName}
                </span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                id="header-user-dropdown"
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {user.roleName}
                  </span>
                </div>

                {schoolContext && (
                  <Link
                    id="header-dropdown-change-school"
                    href="/select-school"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cambiar Institución</span>
                  </Link>
                )}

                {user.isSystemAdmin && (
                  <Link
                    id="header-dropdown-system-admin"
                    href="/system/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Panel Control Global</span>
                  </Link>
                )}

                <a
                  id="header-dropdown-logout"
                  href="/api/auth/logout"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
