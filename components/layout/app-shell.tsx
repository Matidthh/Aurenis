"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { CommandPalette } from "./command-palette";
import { NavItem, UserSessionInfo, SchoolContextInfo } from "./types";
import { NetworkErrorBanner } from "@/components/ui/network-error-banner";
import { useRouteMemoryCleanup } from "@/lib/utils/memory-leak-guard";

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
  // Limpieza garantizada de listeners y peticiones en vuelo al cambiar de ruta
  useRouteMemoryCleanup();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasUserToggled, setHasUserToggled] = useState(false);

  // Inicializar y sincronizar según breakpoints (sm, md, lg, xl) y Base de Datos (Autor: Carlos M. & Lucas P.)
  useEffect(() => {
    let isSubscribed = true;

    async function loadSidebarPreferenceFromDatabase() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const json = await res.json();
          const dbCollapsed = json?.data?.preferences?.sidebarCollapsed;
          if (isSubscribed && typeof dbCollapsed === "boolean") {
            setIsCollapsed(dbCollapsed);
            setHasUserToggled(true);
            return;
          }
        }
      } catch {
        // Fallback a comportamiento responsivo natural si aún no hay sesión o DB
      }

      if (isSubscribed && !hasUserToggled) {
        const width = window.innerWidth;
        if (width >= 768 && width < 1024) {
          setIsCollapsed(true);
        } else if (width >= 1024) {
          setIsCollapsed(false);
        }
      }
    }

    loadSidebarPreferenceFromDatabase();

    function handleResize() {
      const width = window.innerWidth;
      if (width >= 768 && isMobileOpen) {
        setIsMobileOpen(false);
      }
      if (!hasUserToggled) {
        if (width >= 768 && width < 1024) {
          setIsCollapsed(true);
        } else if (width >= 1024) {
          setIsCollapsed(false);
        }
      }
    }

    window.addEventListener("resize", handleResize);
    return () => {
      isSubscribed = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileOpen, hasUserToggled]);

  // Bloquear scroll de fondo cuando el drawer móvil está abierto
  useEffect(() => {
    if (isMobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileOpen]);

  // Alternar colapso de la barra lateral y persistir en la Base de Datos (Autor: Carlos M. & Lucas P.)
  function toggleCollapse() {
    setHasUserToggled(true);
    setIsCollapsed((prev) => {
      const next = !prev;
      // Persistir directamente en PostgreSQL (BBDD)
      fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sidebarCollapsed: next }),
      }).catch((err) => {
        console.warn("[AppShell] Fallo al sincronizar sidebar en la base de datos:", err);
      });
      return next;
    });
  }

  // Atajos de teclado: Ctrl+B (colapsar sidebar), Ctrl+K (abrir búsqueda), Escape (cerrar drawer)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleCollapse();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

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
        userRole={user?.roleName}
      />

      {/* 2. Columna Principal: Header + Contenedor Central */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden min-h-screen">
        {/* Banner Global de Estado de Red / Fallos 500 / 503 con opción de reintento */}
        <NetworkErrorBanner variant="top-banner" />

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
