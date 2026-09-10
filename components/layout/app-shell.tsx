"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "./command-palette";
import { NavItem, UserSessionInfo, SchoolContextInfo } from "./types";

interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: UserSessionInfo;
  schoolContext?: SchoolContextInfo;
  isSystemAdmin?: boolean;
}

export function AppShell({
  children,
  navItems,
  user,
  schoolContext,
  isSystemAdmin,
}: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cargar estado de colapsado desde localStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aurenis_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignorar en caso de restricciones de storage
    }
  }, []);

  function toggleCollapse() {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("aurenis_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  }

  // Atajos de teclado: Ctrl+B (colapsar sidebar), Ctrl+K (abrir búsqueda)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div id="app-shell" className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      {/* 1. Sidebar Retráctil / Mobile Drawer */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        navItems={navItems}
        schoolContext={schoolContext}
        isSystemAdmin={isSystemAdmin}
      />

      {/* 2. Columna Principal: Header + Contenedor Central */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* Header Superior */}
        <Header
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          user={user}
          schoolContext={schoolContext}
        />

        {/* Contenedor Central Responsivo */}
        <main
          id="main-content-container"
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-200"
        >
          {children}
        </main>
      </div>

      {/* 3. Paleta de Comandos / Búsqueda SPA */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navItems={navItems}
        schoolName={schoolContext?.schoolName}
      />
    </div>
  );
}
