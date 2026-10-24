"use client";

import React from "react";
import Link from "next/link";
import { School, ShieldCheck, Heart, ArrowUpRight, Award, FileSpreadsheet } from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";

export function LandingFooter() {
  return (
    <footer className="relative w-full bg-slate-950 text-slate-400 pt-20 pb-12 overflow-hidden border-t border-slate-900">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-slate-900">
          {/* Columna 1: Marca y Misión */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <AurenisLogo className="w-10 h-10" textClassName="text-white text-xl font-black tracking-tight" />
            </Link>

            <p className="text-slate-500 leading-relaxed max-w-sm text-sm">
              Plataforma de gestión escolar multi-institucional para Chile. Libros de clases digitales, planilla de notas de alta velocidad, seguimiento académico Decreto 67 y portales para toda la comunidad educativa.
            </p>

            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold bg-blue-950/30 border border-blue-900/50 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Gestión Pedagógica Estandarizada</span>
            </div>
          </div>

          {/* Columna 2: Portales */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Portales
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/login" className="hover:text-white transition">Estudiantes</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Docentes</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Directivos / UTP</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Apoderados</Link></li>
              <li><Link href="/system" className="hover:text-white transition">Administración</Link></li>
            </ul>
          </div>

          {/* Columna 3: Módulos */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Módulos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/select-school" className="hover:text-white transition">Planilla Decreto 67</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">Asistencia 1-Click</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">Ficha 360°</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">SAT (Alerta Temprana)</Link></li>
            </ul>
          </div>

          {/* Columna 4: Accesos */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Accesos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/select-school" className="hover:text-white transition">Instituciones</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Soporte Técnico</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Portal de Ayuda</Link></li>
            </ul>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 AURENIS. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-6">
            <span>Política de Privacidad</span>
            <span>Términos de Servicio</span>
            <span className="flex items-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-red-500 fill-red-500" /> en Chile
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
