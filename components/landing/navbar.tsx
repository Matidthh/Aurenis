"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LandingNavbarProps {
  onOpenDemoModal?: () => void;
  onOpenQuoteModal?: () => void;
}

export function LandingNavbar({ onOpenDemoModal, onOpenQuoteModal }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Escuchar scroll para fondo sutil
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 15);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús con Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Bloquear scroll de fondo si el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function handleScrollTo(id: string) {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header
      id="landing-navbar"
      suppressHydrationWarning
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs border-b border-slate-200/90 dark:border-slate-800/90 py-3"
          : "bg-[#F8F8F5]/85 dark:bg-slate-950/85 backdrop-blur-sm border-b border-transparent py-4"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* 1. Logotipo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <AurenisLogo
              className="w-8 h-8 sm:w-9 sm:h-9"
              textClassName="text-slate-900 dark:text-white text-lg sm:text-xl font-black tracking-tight"
            />
          </Link>
        </div>

        {/* 2. Navegación Principal Esencial Desktop */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9" aria-label="Navegación principal">
          <button
            onClick={() => handleScrollTo("simulador")}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Simulador en Vivo
          </button>
          <button
            onClick={() => handleScrollTo("planes")}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Planes y Precios
          </button>
          <button
            onClick={() => handleScrollTo("testimonios")}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Casos de Éxito
          </button>
          <button
            onClick={() => handleScrollTo("faq")}
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-[1.02] cursor-pointer"
          >
            Preguntas Frecuentes
          </button>
        </nav>

        {/* 3. Acciones del Header: Iniciar sesión + Botón Cotizar/Demo */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              id="navbar-btn-login"
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex rounded-xl text-xs font-semibold px-4 py-2"
            >
              Iniciar sesión
            </Button>
          </Link>

          <Button
            id="navbar-btn-cta"
            variant="primary"
            size="sm"
            onClick={() => {
              if (onOpenQuoteModal) onOpenQuoteModal();
              else if (onOpenDemoModal) onOpenDemoModal();
              else handleScrollTo("planes");
            }}
            className="rounded-xl text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
          >
            Cotizar / Demo
          </Button>

          {/* Toggle Menú Móvil */}
          <button
            id="navbar-mobile-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Abrir menú de navegación"
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 4. Menú Móvil Simplificado */}
      {isMobileMenuOpen && (
        <div
          id="navbar-mobile-drawer"
          className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col justify-between z-40 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-4">
            <button
              onClick={() => handleScrollTo("simulador")}
              className="w-full text-left py-3 px-3 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              Simulador en Vivo
            </button>
            <button
              onClick={() => handleScrollTo("planes")}
              className="w-full text-left py-3 px-3 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              Planes y Precios
            </button>
            <button
              onClick={() => handleScrollTo("testimonios")}
              className="w-full text-left py-3 px-3 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              Casos de Éxito
            </button>
            <button
              onClick={() => handleScrollTo("faq")}
              className="w-full text-left py-3 px-3 rounded-xl text-base font-semibold text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-800 transition"
            >
              Preguntas Frecuentes
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
              <Button variant="outline" className="w-full justify-center py-3 text-sm font-semibold">
                Iniciar sesión
              </Button>
            </Link>
            <Button
              variant="primary"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenQuoteModal) onOpenQuoteModal();
                else if (onOpenDemoModal) onOpenDemoModal();
                else handleScrollTo("planes");
              }}
              className="w-full justify-center py-3 text-sm font-bold bg-blue-600 text-white"
            >
              Cotizar / Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
