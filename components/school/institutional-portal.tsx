"use client";

/**
 * AURENIS - Portal Institucional Autónomo para Subdominios *.aurenis.app
 * 
 * Responsabilidades de Equipo:
 * 👑 Maicol R. (Arquitectura & Backend):
 *    - Aislamiento multi-tenant por subdominio (*.aurenis.app), resolución canónica y contratos de datos escolares
 * 💻 Malcom Marcelo (Frontend Developer & Lógica React):
 *    - Navegación reactiva, redirección inteligente según rol, y copia de enlaces de subdominio
 * 🎨 Lucas P. (Diseño UI/UX & Design System):
 *    - Identidad visual institucional con colores dinámicos, tarjetas de portal por estamento y contraste WCAG 2.1 AA
 * 🛡️ Frank M. (QA, Testing & Seguridad):
 *    - Prevención de BOLA/IDOR en selección institucional, validación de host y resguardo de datos NNA
 */

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  Globe,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  School,
  ExternalLink,
  ChevronRight,
  Award,
  Calendar,
  Layers,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { cn } from "@/lib/utils/cn";

export interface InstitutionalPortalProps {
  school: {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
    customDomain?: string | null;
    institutionalCode: string;
    city: string;
    country: string;
    settings?: {
      primaryColor?: string;
      termType?: string;
      minPassingGrade?: number;
    };
    customConfig?: {
      motto?: string;
      contactEmail?: string;
      contactPhone?: string;
    };
  };
  isSubdomainMode?: boolean;
}

export function InstitutionalPortal({ school, isSubdomainMode = false }: InstitutionalPortalProps) {
  const [copied, setCopied] = useState(false);

  const fullSubdomainUrl = `https://${school.subdomain}`;

  const handleCopySubdomain = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(fullSubdomainUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const primaryColor = school.settings?.primaryColor || "#016fc7";
  const motto =
    school.customConfig?.motto ||
    (school.slug === "lpmm"
      ? "Formando Técnicos Profesionales de Excelencia para el Desarrollo de la Región de Valparaíso"
      : "Excelencia pedagógica, formación valórica y compromiso con el futuro de nuestros estudiantes");

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Bar Institucional con Dominio */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0A1226]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <AurenisLogo className="w-8 h-8" showText={false} preferSvg={true} />
              <span className="font-extrabold text-base tracking-tight hidden sm:inline-block">
                AURENIS
              </span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900/60">
                {school.institutionalCode}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">
                {school.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Subdominio Activo */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {school.subdomain}
              </span>
              <button
                type="button"
                onClick={handleCopySubdomain}
                className="ml-1 p-1 hover:text-blue-600 transition"
                title="Copiar subdominio"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>

            <Link
              href={`/login?school=${school.slug}`}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <span>Acceder al Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Institucional del Colegio */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 dark:from-[#091124] dark:via-[#070D1E] dark:to-[#050A18]">
        {/* Glow de fondo con color primario del colegio */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-15 dark:opacity-25 blur-3xl pointer-events-none rounded-full"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Campus Digital Oficial · Plataforma AURENIS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {school.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {motto}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <School className="w-3.5 h-3.5 text-blue-500" />
              {school.institutionalCode}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              {school.city}, {school.country}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
              Libro de Clases Decreto 67 & Circular 482
            </span>
          </div>

          {/* Botones de Acción Rápida */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/login?school=${school.slug}`}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/20 flex items-center gap-2 min-h-[44px]"
            >
              <span>Iniciar Sesión en el Establecimiento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleCopySubdomain}
              className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm transition flex items-center gap-2 min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>¡Subdominio Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar Enlace ({school.subdomain})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 4 Portales de Acceso por Estamento (Estudiantes, Docentes, Apoderados, Directivos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 flex-1">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Portales de Acceso Institucional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Ingreso centralizado para todos los miembros de la comunidad escolar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Portal Estudiantes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-5 hover:border-indigo-400/60 transition group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Portal Estudiantes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Consulta de calificaciones D67 en tiempo real, registro de asistencia mediante código QR dinámico y horario pedagógico.
              </p>
            </div>
            <Link
              href={`/login?school=${school.slug}`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-indigo-600 dark:bg-slate-900 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-between"
            >
              <span>Acceder como Alumno</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 2. Portal Docentes */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-5 hover:border-blue-400/60 transition group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black group-hover:scale-105 transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Portal Docentes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Libro Digital de Clases oficial, generación de QR dinámico para asistencia en aula, ingreso de notas D67 y firmas ministeriales.
              </p>
            </div>
            <Link
              href={`/login?school=${school.slug}`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-900 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-between"
            >
              <span>Acceder como Docente</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3. Portal Apoderados */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-5 hover:border-emerald-400/60 transition group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black group-hover:scale-105 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Portal Apoderados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seguimiento del rendimiento escolar de sus hijos, control de asistencia mensual, comunicaciones con profesores e informes de notas.
              </p>
            </div>
            <Link
              href={`/login?school=${school.slug}`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 dark:bg-slate-900 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-between"
            >
              <span>Acceder como Apoderado</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4. Portal Directivos / UTP */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-5 hover:border-amber-400/60 transition group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black group-hover:scale-105 transition">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Equipo Directivo & UTP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Métricas de asistencia institucional, actas ministeriales MINEDUC, supervisión de libros digitales y reportabilidad ejecutiva.
              </p>
            </div>
            <Link
              href={`/login?school=${school.slug}`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-amber-600 dark:bg-slate-900 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-between"
            >
              <span>Acceder como Directivo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer Institucional y Conmutador de Colegios */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <AurenisLogo className="w-5 h-5" showText={false} preferSvg={true} />
            <span>
              AURENIS Multi-Tenant SaaS · Todos los derechos reservados 2026.
            </span>
          </div>

          <Link
            href="/select-school"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Ver otros colegios registrados en la red</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
