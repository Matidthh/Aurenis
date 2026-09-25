"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  Sun,
  Moon,
  School,
  ChevronDown,
  Shield,
  LogOut,
  User,
  Check,
  Sparkles,
  Loader2,
  Building2,
  BookOpen,
  GraduationCap,
  UserCog,
  Users,
} from "lucide-react";
import { UserSessionInfo, SchoolContextInfo } from "./types";
import { Breadcrumbs } from "./breadcrumbs";
import { cn } from "@/lib/utils/cn";
import { DEMO_ROLES, DemoRoleAccount, executeRoleSwitch, findMatchingDemoRole } from "@/lib/auth/demo-roles";

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
  // Estados de menús flotantes
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDevRolesOpen, setIsDevRolesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Estado de tema claro / oscuro con persistencia
  const [isDark, setIsDark] = useState(false);
  const [themeMounted, setThemeMounted] = useState(false);

  // Estado de carga para el selector rápido de roles
  const [switchingRoleId, setSwitchingRoleId] = useState<string | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  // Referencias para cierre al hacer clic afuera (click-outside)
  const userMenuRef = useRef<HTMLDivElement>(null);
  const devRolesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Inicializar estado del tema desde la base de datos (Autor: Carlos M. & Lucas P.)
  useEffect(() => {
    let isSubscribed = true;

    async function loadThemeFromDatabase() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const json = await res.json();
          const dbTheme = json?.data?.preferences?.theme;
          if (isSubscribed && dbTheme) {
            const shouldBeDark = dbTheme === "dark";
            setIsDark(shouldBeDark);
            if (typeof document !== "undefined") {
              if (shouldBeDark) {
                document.documentElement.classList.add("dark");
              } else {
                document.documentElement.classList.remove("dark");
              }
            }
            setThemeMounted(true);
            return;
          }
        }
      } catch {
        // Fallback no intrusivo si el endpoint no está disponible en primera carga
      }

      // Si no hay respuesta de la base de datos, respetar clase del documento
      if (isSubscribed && typeof document !== "undefined") {
        const isCurrentlyDark = document.documentElement.classList.contains("dark");
        setIsDark(isCurrentlyDark);
        setThemeMounted(true);
      }
    }

    loadThemeFromDatabase();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Alternar modo oscuro y persistir preferencia en la Base de Datos (Autor: Carlos M. & Lucas P.)
  function toggleTheme() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Persistir directamente en PostgreSQL (BBDD)
    fetch("/api/user/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: nextDark ? "dark" : "light" }),
    }).catch((err) => {
      console.warn("[Header] Fallo al sincronizar tema en la base de datos:", err);
    });
  }

  // Cerrar menús al hacer clic fuera o presionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (devRolesRef.current && !devRolesRef.current.contains(target)) {
        setIsDevRolesOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsDevRolesOpen(false);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Ejecutar cambio rápido de rol en desarrollo
  async function handleRoleSwitch(account: DemoRoleAccount) {
    if (switchingRoleId) return;
    setSwitchingRoleId(account.id);
    setSwitchError(null);

    try {
      const targetUrl = await executeRoleSwitch(account);
      // Redirección directa nativa para asegurar transporte de cookies y refresco de estado
      window.location.href = targetUrl;
    } catch (err: any) {
      setSwitchError(err.message || "Error al cambiar de rol.");
      setSwitchingRoleId(null);
    }
  }

  // Identificar el rol demo activo según el usuario actual
  const currentDemoRole = findMatchingDemoRole(user?.email, user?.roleName);

  // Mapeo de icono representativo por rol
  function getRoleIcon(roleKey: string) {
    switch (roleKey) {
      case "director":
        return Building2;
      case "profesor":
        return BookOpen;
      case "alumno":
        return GraduationCap;
      case "superadmin":
        return UserCog;
      case "apoderado":
        return Users;
      default:
        return User;
    }
  }

  // Nombre amigable del rol
  const displayRoleTitle = currentDemoRole?.roleTitle || user?.roleName || "Usuario";

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs transition-colors"
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-3 sm:px-6 gap-2 sm:gap-3">
        {/* ================================================================= */}
        {/* 1. SECCIÓN IZQUIERDA: Menú móvil, Colapso Desktop y Breadcrumbs */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Botón menú Móvil */}
          <button
            id="header-mobile-toggle-btn"
            type="button"
            onClick={onOpenMobile}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Abrir navegación lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Botón Colapsar Desktop y Tablet */}
          <button
            id="header-desktop-collapse-btn"
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Colapsar o expandir barra lateral"
            title={isCollapsed ? "Expandir menú (Ctrl+B)" : "Colapsar menú (Ctrl+B)"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          {/* Migas de Pan (Breadcrumbs) Responsivas */}
          <Breadcrumbs
            schoolContext={schoolContext}
            className="hidden md:flex"
          />
        </div>

        {/* ================================================================= */}
        {/* 2. SECCIÓN CENTRAL: Barra de Búsqueda Rápida (Command Palette) */}
        {/* ================================================================= */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-3">
          <button
            id="header-search-trigger"
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Buscar en la plataforma (Ctrl+K)"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
              <span className="truncate hidden sm:inline">Buscar módulo, curso o vista...</span>
              <span className="truncate sm:hidden">Buscar...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 3. SECCIÓN DERECHA: Roles Dev, Tema, Notificaciones y Perfil     */}
        {/* ================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 3.1 BOTONERA / SELECTOR DE ROLES DE PRUEBA (DESARROLLO ACTIVA) */}
          <div className="relative" ref={devRolesRef}>
            {/* Botón selector principal */}
            <button
              id="header-dev-role-selector-btn"
              type="button"
              onClick={() => setIsDevRolesOpen(!isDevRolesOpen)}
              disabled={Boolean(switchingRoleId)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isDevRolesOpen
                  ? "bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs"
                  : "bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/60 dark:hover:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300"
              )}
              title="Botonera de cambio de rol para desarrollo activa (1 clic)"
              aria-label="Selector rápido de roles de prueba"
              aria-expanded={isDevRolesOpen}
            >
              {switchingRoleId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
              <span className="hidden sm:inline-flex items-center gap-1">
                <span className="font-medium text-slate-500 dark:text-slate-400 text-[11px]">Rol:</span>
                <span className="font-bold text-amber-900 dark:text-amber-200 truncate max-w-[85px] md:max-w-none">
                  {displayRoleTitle}
                </span>
              </span>
              <span className="sm:hidden font-bold text-[11px] text-amber-900 dark:text-amber-200">
                {currentDemoRole?.badgeLabel || displayRoleTitle}
              </span>
              <ChevronDown className={cn("w-3 h-3 text-amber-600 transition-transform", isDevRolesOpen && "rotate-180")} />
            </button>

            {/* Menú Desplegable de la Botonera de Roles */}
            {isDevRolesOpen && (
              <div
                id="header-dev-roles-dropdown"
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-xl p-3 space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      Selector Rápido de Roles (DEV)
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    1 Clic
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cambia de identidad al instante para verificar permisos, vistas y libros de clases:
                </p>

                {switchError && (
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-[11px]">
                    {switchError}
                  </div>
                )}

                {/* Lista de Botones de Roles de Prueba */}
                <div className="space-y-1.5">
                  {DEMO_ROLES.map((account) => {
                    const RoleIcon = getRoleIcon(account.roleKey);
                    const isSelected =
                      currentDemoRole?.id === account.id ||
                      user?.email?.toLowerCase() === account.email.toLowerCase() ||
                      user?.roleName === account.roleSystemName;
                    const isThisSwitching = switchingRoleId === account.id;

                    return (
                      <button
                        key={account.id}
                        id={`dev-role-btn-${account.roleKey}`}
                        type="button"
                        onClick={() => handleRoleSwitch(account)}
                        disabled={Boolean(switchingRoleId)}
                        className={cn(
                          "w-full flex items-center justify-between p-2 rounded-xl text-left transition border group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                          isSelected
                            ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100 font-semibold"
                            : "bg-slate-50/70 dark:bg-slate-800/50 hover:bg-amber-50/40 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs transition",
                              isSelected
                                ? "bg-amber-500 text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-amber-500 group-hover:text-white"
                            )}
                          >
                            {isThisSwitching ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RoleIcon className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold truncate">{account.roleTitle}</span>
                              <span
                                className={cn(
                                  "text-[9px] font-bold px-1 py-0.2 rounded border uppercase tracking-wider",
                                  account.badgeColor
                                )}
                              >
                                {account.badgeLabel}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {account.name} • {account.email}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Activo</span>
                            <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
                  Sesión demo precargada con permisos completos para evaluación.
                </div>
              </div>
            )}
          </div>

          {/* 3.2 BADGE DEL COLEGIO ACTIVO (CON ACCESO A CAMBIO) */}
          {schoolContext && (
            <Link
              id="header-school-badge-link"
              href="/select-school"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              title="Colegio activo (haz clic para cambiar de institución)"
            >
              <School className="w-3.5 h-3.5" />
              <span className="max-w-[130px] truncate">{schoolContext.schoolName}</span>
            </Link>
          )}

          {/* 3.3 BOTÓN DE TEMA CLARO / OSCURO (Control táctil neumórfico) */}
          <button
            id="header-theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 neumo-button transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {themeMounted && isDark ? (
              <Sun className="w-4 h-4 text-amber-500 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* 3.4 NOTIFICACIONES (Control táctil neumórfico) */}
          <div className="relative" ref={notificationsRef}>
            <button
              id="header-notifications-btn"
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 neumo-button transition relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Ver centro de notificaciones"
              aria-expanded={isNotificationsOpen}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600 animate-pulse ring-2 ring-white dark:ring-slate-900" />
            </button>

            {isNotificationsOpen && (
              <div
                id="header-notifications-menu"
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 space-y-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                  <span>Notificaciones Escolares</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    2 nuevas
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Asistencia Registrada</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Se cerró el registro de asistencia matutino con 94.2% de presencia.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hace 15 minutos</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Libro de Clases Actualizado</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Calificaciones semestrales listas para revisión directiva.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hace 1 hora</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3.5 DROPDOWN CON INFORMACIÓN DE PERFIL */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="header-user-menu-btn"
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Abrir menú de usuario y perfil"
              aria-expanded={isUserMenuOpen}
            >
              {/* Avatar con iniciales e indicador de estado */}
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.firstName ? user.firstName[0] : "U"}
                  {user.lastName ? user.lastName[0] : ""}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              {/* Información resumida en desktop */}
              <div className="hidden sm:block text-left text-xs">
                <span className="block font-semibold text-slate-900 dark:text-white truncate max-w-[110px] md:max-w-[130px]">
                  {user.firstName} {user.lastName}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[110px] md:max-w-[130px]">
                  {displayRoleTitle}
                </span>
              </div>
              <ChevronDown className={cn("hidden sm:block w-3.5 h-3.5 text-slate-400 transition-transform", isUserMenuOpen && "rotate-180")} />
            </button>

            {/* Dropdown de Perfil Extendido */}
            {isUserMenuOpen && (
              <div
                id="header-user-dropdown"
                className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {/* Cabecera del Dropdown con información completa de perfil */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {user.firstName ? user.firstName[0] : "U"}
                      {user.lastName ? user.lastName[0] : ""}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                          {displayRoleTitle}
                        </span>
                        {user.isSystemAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            SuperAdmin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {schoolContext && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">
                      <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{schoolContext.schoolName}</span>
                    </div>
                  )}
                </div>

                {/* Acciones del menú de perfil */}
                <div className="py-1 space-y-0.5">
                  {schoolContext && (
                    <Link
                      id="header-dropdown-change-school"
                      href="/select-school"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <School className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cambiar Institución</span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90" />
                    </Link>
                  )}

                  {user.isSystemAdmin && (
                    <Link
                      id="header-dropdown-system-admin"
                      href="/system/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-amber-500" />
                        <span>Panel Control Global</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Admin</span>
                    </Link>
                  )}

                  {/* Acceso rápido a cambio de tema desde el menú de perfil */}
                  <button
                    id="header-dropdown-toggle-theme"
                    type="button"
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      {isDark ? (
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Moon className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>Tema de la interfaz</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {isDark ? "Oscuro" : "Claro"}
                    </span>
                  </button>

                  {/* Acceso directo a abrir selector de roles dev desde el dropdown */}
                  <button
                    id="header-dropdown-open-roles"
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsDevRolesOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Cambiar Rol de Prueba</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Dev</span>
                  </button>
                </div>

                {/* Separador y botón de cerrar sesión */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    id="header-dropdown-logout"
                    href="/api/auth/logout"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
