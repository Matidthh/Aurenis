"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  School,
  Shield,
  ArrowLeftRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { NavItem, SchoolContextInfo } from "./types";
import { cn } from "@/lib/utils/cn";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  navItems: NavItem[];
  schoolContext?: SchoolContextInfo;
  isSystemAdmin?: boolean;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  navItems,
  schoolContext,
  isSystemAdmin,
}: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Agrupar items por sección
  const sections = Array.from(new Set(navItems.map((item) => item.section || "General")));

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Header Institucional / Logo */}
      <div
        id="sidebar-header"
        className={cn(
          "border-b border-slate-200 dark:border-slate-800 flex items-center transition-all duration-300",
          isCollapsed ? "p-4 justify-center" : "p-5 justify-between"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "rounded-xl flex items-center justify-center font-bold text-white shadow-md shrink-0 transition-all",
              isSystemAdmin
                ? "bg-slate-900 dark:bg-slate-800 shadow-slate-900/20"
                : "bg-brand-600 shadow-brand-500/20",
              isCollapsed ? "w-10 h-10" : "w-10 h-10"
            )}
          >
            {isSystemAdmin ? <Shield className="w-5 h-5" /> : <School className="w-5 h-5" />}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <h2
                className="font-bold text-sm tracking-tight truncate text-slate-900 dark:text-white"
                title={schoolContext?.schoolName || "Aurenis Core"}
              >
                {schoolContext?.schoolName || "Aurenis Core"}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                  {schoolContext?.roleName || (isSystemAdmin ? "SYSTEM_ADMIN" : "AURENIS")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botón cerrar para móvil */}
        <button
          id="sidebar-close-mobile-btn"
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Cerrar menú lateral"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navegación Modular */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((sectionName) => {
          const sectionItems = navItems.filter((i) => (i.section || "General") === sectionName);

          return (
            <div key={sectionName} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {sectionName}
                </div>
              )}

              {sectionItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href) && item.href !== `/${schoolContext?.schoolSlug}`);

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
                      onClick={() => onCloseMobile()}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group",
                        isCollapsed ? "justify-center" : "justify-between",
                        isActive
                          ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold border-l-4 border-brand-600 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-5 h-5 shrink-0 transition-colors",
                            isActive
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          )}
                        >
                          {item.icon}
                        </div>

                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                            item.badgeVariant === "brand" && "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200",
                            item.badgeVariant === "success" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
                            (!item.badgeVariant || item.badgeVariant === "neutral") && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip flotante en modo colapsado para desktop */}
                    {isCollapsed && hoveredItem === item.href && (
                      <div
                        id={`sidebar-tooltip-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="hidden lg:flex fixed left-20 ml-2 z-50 items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 border border-slate-700"
                        style={{
                          pointerEvents: "none",
                        }}
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-brand-500 text-white text-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
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
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
              isCollapsed && "justify-center px-2"
            )}
            title="Cambiar de Colegio"
          >
            <ArrowLeftRight className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span className="truncate">Cambiar Colegio</span>}
          </Link>
        )}

        {isSystemAdmin && !schoolContext && (
          <Link
            id="sidebar-schools-mgmt-link"
            href="/system/schools"
            onClick={() => onCloseMobile()}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
              isCollapsed && "justify-center px-2"
            )}
            title="Gestión de Instituciones"
          >
            <School className="w-4 h-4 shrink-0 text-slate-400" />
            {!isCollapsed && <span className="truncate">Instituciones</span>}
          </Link>
        )}

        {/* Botón retráctil para Desktop */}
        <button
          id="sidebar-collapse-desktop-btn"
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate">Colapsar menú</span>
            </>
          )}
        </button>

        {/* Logout */}
        <a
          id="sidebar-logout-link"
          href="/api/auth/logout"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition",
            isCollapsed && "justify-center px-2"
          )}
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Cerrar Sesión</span>}
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop / Tablet Sidebar Fijo y Retráctil */}
      <aside
        id="desktop-sidebar"
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out h-screen sticky top-0 z-40",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer (Deslizable desde la izquierda) */}
      <div
        id="mobile-sidebar-drawer"
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop Oscuro */}
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onCloseMobile}
        />

        {/* Panel lateral deslizable */}
        <div
          id="mobile-sidebar-panel"
          className={cn(
            "fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
