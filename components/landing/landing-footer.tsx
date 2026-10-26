"use client";

import React from "react";
import Link from "next/link";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import {
  Rocket,
  ArrowRight,
  ShieldCheck,
  Package,
  BookOpen,
  Building2,
  Globe,
  Share2,
  Mail,
} from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full relative bg-[#F8F8F5] overflow-hidden">
      {/* 
        Onda SVG superior fluida que hace la transición orgánica
        desde el fondo claro (#F8F8F5) hacia el fondo azul oscuro profundo (#071329).
        Se utiliza margen negativo y traslación vertical para solaparla directamente
        con el cuerpo del footer, eliminando cualquier espacio o línea subpixel en cualquier pantalla.
      */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-2 sm:-mb-3.5 relative z-10">
        <svg
          className="relative block w-full h-16 sm:h-24 md:h-32 lg:h-40 text-[#071329] fill-current translate-y-[2px]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Capa de onda secundaria sutil (como en el diseño original) */}
          <path
            d="M0,80 C320,160 520,30 840,90 C1140,150 1340,45 1440,65 L1440,210 L0,210 Z"
            fill="#0c1d38"
            opacity="0.5"
          />
          {/* Capa de onda frontal principal que se funde con el fondo */}
          <path
            d="M0,55 C260,140 480,15 800,65 C1100,115 1320,20 1440,45 L1440,210 L0,210 Z"
            fill="#071329"
          />
        </svg>
      </div>

      {/* Contenedor principal con fondo azul oscuro profundo y gradiente sutil */}
      <div className="w-full bg-gradient-to-b from-[#071329] via-[#050E20] to-[#030814] text-slate-300 pt-8 pb-12 px-6 sm:px-8 lg:px-12 relative z-0">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Grid: 12 columnas exactas para la distribución */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 items-start">
            
            {/* Columna 1: Brand, Descripción y Canales (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <AurenisLogo
                  className="w-10 h-10"
                  textClassName="text-white text-xl font-bold tracking-tight"
                />
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                La solución para una gestión académica más simple, organizada y segura.
              </p>

              {/* Botones de presencia digital y contacto */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://aurenis.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Sitio Web Institucional"
                  className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-blue-900/40 hover:border-blue-500/60 hover:bg-blue-600/20 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <Globe className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Canal LinkedIn AURENIS"
                  className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-blue-900/40 hover:border-blue-500/60 hover:bg-blue-600/20 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contacto@aurenis.cl"
                  aria-label="Contacto por Correo Electrónico"
                  className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-blue-900/40 hover:border-blue-500/60 hover:bg-blue-600/20 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Columna 2: Producto (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400 shrink-0" />
                <h4 className="font-semibold text-white text-sm tracking-wide">Producto</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors duration-150">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors duration-150">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/academic" className="hover:text-white transition-colors duration-150">
                    Gestión académica
                  </Link>
                </li>
                <li>
                  <Link href="/#capacidades" className="hover:text-white transition-colors duration-150">
                    Funcionalidades
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Recursos (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <h4 className="font-semibold text-white text-sm tracking-wide">Recursos</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                    Centro de ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                    Preguntas frecuentes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4: Empresa (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                <h4 className="font-semibold text-white text-sm tracking-wide">Empresa</h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li>
                  <Link href="/#about" className="hover:text-white transition-colors duration-150">
                    Sobre AURENIS
                  </Link>
                </li>
                <li>
                  <a href="mailto:contacto@aurenis.cl" className="hover:text-white transition-colors duration-150">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna 5: Tarjeta CTA Destacada (3 cols) */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl bg-[#0B172E]/90 border border-blue-500/25 p-5 sm:p-6 shadow-xl shadow-black/30 backdrop-blur-sm space-y-4 overflow-hidden">
                {/* Resplandor sutil ambiental */}
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                {/* Badge Cohete en gradiente azul-indigo */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Rocket className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-sm leading-snug">
                    ¿Listo para transformar tu gestión académica?
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Agenda una videollamada y descubre cómo AURENIS puede ayudarte.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="w-full justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-500/40 cursor-pointer"
                >
                  <span>Solicitar Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Barra Inferior: Separador sutil azul noche (sin líneas blancas) y Derechos */}
          <div className="pt-6 border-t border-[#0e2348]/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2026 AURENIS. Todos los derechos reservados.</p>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Plataforma de gestión académica.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
