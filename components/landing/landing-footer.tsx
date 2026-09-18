"use client";

import React from "react";
import Link from "next/link";
import { School, ShieldCheck, Heart, ArrowUpRight, Award, FileSpreadsheet } from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";

export function LandingFooter() {
  return (
    <footer className="relative w-full bg-slate-900 text-slate-300 rounded-t-[50px] sm:rounded-t-[80px] -mt-12 pt-24 pb-16 text-xs relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Subtle ambient lighting inside closure footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 space-y-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Columna 1: Marca y Misión */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/">
              <AurenisLogo className="w-10 h-10" textClassName="text-white text-xl font-black tracking-tight" />
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm font-medium">
              Plataforma de gestión escolar multi-institucional para Chile. Libros de clases digitales, planilla de notas de alta velocidad, seguimiento académico Decreto 67 y portales para toda la comunidad educativa.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-blue-300 font-bold bg-blue-950/60 border border-blue-800/60 px-3.5 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Estructurado para Registro Escolar · Notas y Asistencia</span>
            </div>

            <div className="pt-2 text-xs text-slate-300 space-y-1">
              <div>Contacto directo: <a href="mailto:contacto@aurenis.cl" className="text-blue-400 hover:underline font-semibold">contacto@aurenis.cl</a></div>
              <div className="text-slate-400">Región de Valparaíso, Chile</div>
            </div>
          </div>

          {/* Columna 2: Portales por Rol */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Portales por Perfil
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/colegio-san-jose/dashboard" className="text-slate-400 hover:text-white font-medium transition">
                  Portal de Alumnos
                </Link>
              </li>
              <li>
                <Link href="/colegio-san-jose/grades" className="text-slate-400 hover:text-white font-medium transition">
                  Planilla para Docentes
                </Link>
              </li>
              <li>
                <Link href="/colegio-san-jose/dashboard" className="text-slate-400 hover:text-white font-medium transition">
                  Consola Directiva & UTP
                </Link>
              </li>
              <li>
                <Link href="/mockups" className="text-slate-400 hover:text-white font-medium transition">
                  Portal de Apoderados
                </Link>
              </li>
              <li>
                <Link href="/system" className="text-slate-400 hover:text-white font-medium transition">
                  SuperAdmin del Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Módulos del Sistema */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Módulos Principales
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/colegio-san-jose/grades" className="text-slate-400 hover:text-white font-medium transition">
                  Planilla Matricial Decreto 67
                </Link>
              </li>
              <li>
                <Link href="/colegio-san-jose/attendance" className="text-slate-400 hover:text-white font-medium transition">
                  Libro de Asistencia 1-Click
                </Link>
              </li>
              <li>
                <Link href="/colegio-san-jose/students" className="text-slate-400 hover:text-white font-medium transition">
                  Ficha del Estudiante 360°
                </Link>
              </li>
              <li>
                <Link href="/colegio-san-jose/teachers" className="text-slate-400 hover:text-white font-medium transition">
                  Directorio de Docentes
                </Link>
              </li>
              <li>
                <Link href="/mockups" className="text-slate-400 hover:text-white font-medium transition">
                  Sistema de Alerta Temprana (SAT)
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Establecimientos & Accesos */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm tracking-tight">
              Establecimientos & Accesos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/colegio-san-jose/dashboard" className="text-slate-400 hover:text-white font-medium transition flex items-center gap-1">
                  <span>Colegio San José (Demo)</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white font-medium transition">
                  Portal Directivo Central
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-400 hover:text-white font-medium transition">
                  Buscador de Establecimientos
                </Link>
              </li>
              <li>
                <Link href="/(auth)/login" className="text-slate-400 hover:text-white font-medium transition">
                  Ingreso Centralizado
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <div>
            © 2026 AURENIS. Plataforma de Gestión Escolar. Desarrollada para colegios y liceos de Chile.
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Desarrollado con dedicación para la gestión pedagógica y directiva
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
