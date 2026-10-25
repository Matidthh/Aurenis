"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  School,
  Shield,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutDashboard,
  Award,
  CalendarCheck,
  Clock,
  BookOpen,
  Inbox,
  BookMarked,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { NavItem, SchoolContextInfo } from "./types";
import { isRouteActive, filterNavItemsByRole } from "@/lib/navigation/routes";
import { cn } from "@/lib/utils/cn";

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  navItems: NavItem[];
  schoolContext?: SchoolContextInfo;
  isSystemAdmin?: boolean;
  userRole?: string;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  navItems,
  schoolContext,
  isSystemAdmin,
  userRole,
}: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // 1. Filtrado dinámico de ítems según rol del usuario conectado
  const activeRole = userRole || schoolContext?.roleName || (isSystemAdmin ? "SYSTEM_ADMIN" : undefined);
  const isStudentContext = pathname?.includes("/dashboard/estudiante") || activeRole === "STUDENT";
  const schoolSlug = schoolContext?.schoolSlug || (pathname ? pathname.split("/")[1] : "lpmm") || "lpmm";

  // 2. Resolver lista de navegación: Si estamos en el portal de alumno, garantizar los módulos estudiantiles
  const resolvedNavItems = useMemo(() => {
    if (isStudentContext) {
      return [
        {
          title: "Inicio",
          href: `/${schoolSlug}/dashboard/estudiante?tab=resumen`,
          icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
          section: "Portal Estudiantil",
        },
        {
          title: "Mis Calificaciones",
          href: `/${schoolSlug}/dashboard/estudiante?tab=notas`,
          icon: <Award className="w-5 h-5 shrink-0" />,
          section: "Académico",
        },
        {
          title: "Mi Asistencia",
          href: `/${schoolSlug}/dashboard/estudiante?tab=asistencia`,
          icon: <CalendarCheck className="w-5 h-5 shrink-0" />,
          section: "Académico",
        },
        {
          title: "Mi Horario",
          href: `/${schoolSlug}/dashboard/estudiante?tab=horario`,
          icon: <Clock className="w-5 h-5 shrink-0" />,
          section: "Académico",
        },
        {
          title: "Mis Ramos",
          href: `/${schoolSlug}/dashboard/estudiante?tab=asignaturas`,
          icon: <BookOpen className="w-5 h-5 shrink-0" />,
          section: "Académico",
        },
        {
          title: "Avisos Escolares",
          href: `/${schoolSlug}/dashboard/estudiante?tab=comunicados`,
          icon: <Inbox className="w-5 h-5 shrink-0" />,
          section: "Comunidad Escolar",
        },
        {
          title: "Reglamento & RICE",
          href: `/${schoolSlug}/dashboard/estudiante?tab=reglamento`,
          icon: <BookMarked className="w-5 h-5 shrink-0" />,
          section: "Institucional",
        },
      ];
    }
    return filterNavItemsByRole(navItems, activeRole);
  }, [isStudentContext, schoolSlug, navItems, activeRole]);

  // 3. Agrupar items permitidos por sección
  const sections = Array.from(new Set(resolvedNavItems.map((item) => item.section || "General")));

  // 4. Estado de pestaña activa con persistencia local y sincronización reactiva
  const [currentActiveTab, setCurrentActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const paramTab = searchParams?.get("tab");
      if (paramTab) return paramTab;
      try {
        const saved = localStorage.getItem("aurenis_student_active_tab");
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return searchParams?.get("tab") || "resumen";
  });

  useEffect(() => {
    const paramTab = searchParams?.get("tab");
    if (paramTab) {
      setCurrentActiveTab(paramTab);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleTabSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: string }>;
      if (customEvent.detail?.tab) {
        setCurrentActiveTab(customEvent.detail.tab);
      }
    };
    window.addEventListener("aurenis:student-tab-change", handleTabSync);
    return () => {
      window.removeEventListener("aurenis:student-tab-change", handleTabSync);
    };
  }, []);

  const checkIsItemActive = (href: string) => {
    if (isStudentContext && href.includes("tab=")) {
      try {
        const itemTab = href.split("tab=")[1]?.split("&")[0];
        return itemTab === currentActiveTab;
      } catch {
        return false;
      }
    }
    return isRouteActive(pathname, href);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onCloseMobile();

    // Link handling específico para módulos de estudiante con persistencia
    if (href.includes("tab=")) {
      const targetTab = href.split("tab=")[1]?.split("&")[0];
      if (targetTab) {
        try {
          localStorage.setItem("aurenis_student_active_tab", targetTab);
        } catch {
          // ignore
        }
        setCurrentActiveTab(targetTab);

        // Si ya estamos en el dashboard de estudiante o en el dashboard general, evitar recarga
        // de servidor RSC para erradicar cualquier riesgo de pérdida de cookie en iframes/redirección a login
        const isAlreadyOnDashboard =
          pathname?.includes("/dashboard/estudiante") ||
          pathname?.endsWith("/dashboard") ||
          pathname?.includes("/dashboard");

        if (isAlreadyOnDashboard) {
          e.preventDefault();
          window.history.pushState(null, "", href);
          window.dispatchEvent(
            new CustomEvent("aurenis:student-tab-change", {
              detail: { tab: targetTab },
            })
          );
        }
      }
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Header Institucional / Logo */}
      <div
        id="sidebar-header"
        className={cn(
          "border-b border-slate-200 dark:border-slate-800 flex items-center transition-colors duration-200",
          isCollapsed ? "p-4 justify-center" : "p-5 justify-between"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center p-1.5 shadow-md shrink-0 transition-all overflow-hidden",
              isSystemAdmin
                ? "bg-slate-900 dark:bg-slate-800 shadow-slate-900/20"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-brand-500/10"
            )}
          >
            <AurenisLogo
              showText={false}
              className="w-full h-full"
              imageClassName="object-contain"
            />
          </div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                key="sidebar-school-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <h2
                  className="font-bold text-sm tracking-tight truncate text-slate-900 dark:text-white"
                  title={schoolContext?.schoolName || "Aurenis Core"}
                >
                  {schoolContext?.schoolName || "Aurenis Core"}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                    {activeRole || (isSystemAdmin ? "SYSTEM_ADMIN" : "AURENIS")}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botón cerrar para móvil con touch target ≥ 44px */}
        <button
          id="sidebar-close-mobile-btn"
          type="button"
          onClick={onCloseMobile}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition touch-manipulation active:scale-95"
          aria-label="Cerrar menú lateral"
        >
          <X className="w-5 h-5 shrink-0" strokeWidth={2} />
        </button>
      </div>

      {/* Navegación Modular Filtrada */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((sectionName) => {
          const sectionItems = resolvedNavItems.filter((i) => (i.section || "General") === sectionName);

          return (
            <div key={sectionName} className="space-y-1">
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key={`section-title-${sectionName}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 overflow-hidden"
                  >
                    {sectionName}
                  </motion.div>
                )}
              </AnimatePresence>

              {sectionItems.map((item) => {
                const isActive = checkIsItemActive(item.href);

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => isCollapsed && setHoveredItem(item.href)}
                    onMouseLeave={() => isCollapsed && setHoveredItem(null)}
                  >
                    <Link
                      id={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors duration-150 group z-10 min-h-[44px] touch-manipulation",
                        isCollapsed ? "justify-center" : "justify-between",
                        isActive
                          ? "text-brand-700 dark:text-brand-300 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {/* Fondo activo con transición animada Framer Motion */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebarActivePill"
                          className="absolute inset-0 rounded-xl bg-brand-50/90 dark:bg-brand-950/60 ring-1 ring-brand-200/60 dark:ring-brand-800/50 shadow-2xs z-0"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-5 h-5 shrink-0 transition-colors flex items-center justify-center",
                            isActive
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          )}
                        >
                          {item.icon}
                        </div>

                        <AnimatePresence initial={false}>
                          {!isCollapsed && (
                            <motion.span
                              key={`item-label-${item.title}`}
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.18, ease: "easeInOut" }}
                              className="truncate font-medium whitespace-nowrap overflow-hidden"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Badges e Indicadores */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed && (
                          <motion.div
                            key={`item-meta-${item.title}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="relative z-10 flex items-center gap-1.5 shrink-0"
                          >
                            {isActive && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400"
                                aria-hidden="true"
                              />
                            )}
                            {(item as NavItem).badge && (
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                                  (item as NavItem).badgeVariant === "brand" &&
                                    "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200",
                                  (item as NavItem).badgeVariant === "success" &&
                                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
                                  (!(item as NavItem).badgeVariant || (item as NavItem).badgeVariant === "neutral") &&
                                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                )}
                              >
                                {(item as NavItem).badge}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>

                    {/* Tooltip flotante animado en modo colapsado para desktop y tablet */}
                    <AnimatePresence>
                      {isCollapsed && hoveredItem === item.href && (
                        <motion.div
                          id={`sidebar-tooltip-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                          initial={{ opacity: 0, x: 6, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 6, scale: 0.95 }}
                          transition={{ duration: 0.12 }}
                          className="hidden md:flex fixed left-20 ml-2 z-50 items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium shadow-xl whitespace-nowrap border border-slate-700 pointer-events-none"
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-brand-500 text-white text-[10px]">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer del Sidebar con Switcher, Retracción y Logout */}
      <div id="sidebar-footer" className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {schoolContext && (
          <Link
            id="sidebar-change-school-link"
            href="/select-school"
            onClick={() => onCloseMobile()}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title="Cambiar de Colegio"
          >
            <ArrowLeftRight className="w-4 h-4 shrink-0 text-slate-400" strokeWidth={2} />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="truncate overflow-hidden whitespace-nowrap"
                >
                  Cambiar Colegio
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )}

        {isSystemAdmin && !schoolContext && (
          <Link
            id="sidebar-schools-mgmt-link"
            href="/system/schools"
            onClick={() => onCloseMobile()}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              isCollapsed && "justify-center px-2"
            )}
            title="Gestión de Instituciones"
          >
            <School className="w-4 h-4 shrink-0 text-slate-400" strokeWidth={2} />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.18 }}
                  className="truncate overflow-hidden whitespace-nowrap"
                >
                  Instituciones
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        )}

        {/* Botón retráctil para Desktop / Tablet con rotación animada */}
        <button
          id="sidebar-collapse-desktop-btn"
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "hidden md:flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400" strokeWidth={2} />
          </motion.div>
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="truncate overflow-hidden whitespace-nowrap"
              >
                Colapsar menú
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Logout */}
        <Link
          id="sidebar-logout-link"
          href="/api/auth/logout"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="truncate overflow-hidden whitespace-nowrap"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Sidebar con transición Framer Motion de ancho suave */}
      <motion.aside
        id="desktop-sidebar"
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="hidden md:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 z-40 overflow-y-auto"
      >
        {sidebarContent}
      </motion.aside>

      {/* 2. Mobile Drawer con AnimatePresence para backdrop y panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <div
            id="mobile-sidebar-drawer"
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación lateral"
          >
            {/* Backdrop con desvanecimiento animado oscuro */}
            <motion.div
              id="mobile-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 dark:bg-black/80 backdrop-blur-xs"
              onClick={onCloseMobile}
            />

            {/* Panel lateral con deslizamiento suave con muelle y contención de scroll */}
            <motion.div
              id="mobile-sidebar-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 z-10 overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
