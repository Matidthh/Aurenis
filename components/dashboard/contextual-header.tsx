"use client";

import React from "react";
import {
  Building2,
  Calendar,
  Activity,
  Sparkles,
  GraduationCap,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * ============================================================================
 * HEADER CONTEXTUAL DEL DASHBOARD ACADÉMICO (CONTEXTUAL HEADER)
 * ============================================================================
 * Muestra información institucional en tiempo real:
 * - Establecimiento y RBD oficial
 * - Período académico activo (Semestre, Año Lectivo)
 * - Estado de sincronización MINEDUC / SIGE
 * - Acciones primarias según el rol activo
 *
 * Responsables: Lucas P. (Design) & Maicol R. (Backend Context)
 * ============================================================================
 */

export interface ContextualHeaderProps {
  schoolName: string;
  institutionalCode?: string;
  academicYear?: string;
  term?: string;
  roleTitle: string;
  roleBadgeColor?: string;
  userName: string;
  greeting?: string;
  quickActions?: React.ReactNode;
  className?: string;
}

export function ContextualHeader({
  schoolName,
  institutionalCode = "RBD 10240",
  academicYear = "2026",
  term = "1er Semestre",
  roleTitle,
  roleBadgeColor = "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  userName,
  greeting = "Panel de Control Académico",
  quickActions,
  className,
}: ContextualHeaderProps) {
  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 sm:p-8 overflow-hidden transition-colors",
        "bg-gradient-to-br from-slate-900 via-[#0B132B] to-[#0A0F1D] text-white",
        "border border-slate-800/90 shadow-xl shadow-slate-950/40",
        className
      )}
    >
      {/* Halo Sutil de Fondo (Anti-Slop, Azul Zafiro Suave) */}
      <div
        className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Información Contextual Izquierda */}
        <div className="space-y-3 max-w-2xl">
          {/* Metadata Institucional sin Pills (Cero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {schoolName}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-400">{institutionalCode}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Año {academicYear} ({term})
            </span>
          </div>

          {/* Saludo y Nombre del Usuario */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border", roleBadgeColor)}>
                {roleTitle}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                MINEDUC Sincronizado
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Sesión activa de <strong className="text-slate-200">{userName}</strong>. Datos actualizados en tiempo real según el Libro de Clases Oficial.
            </p>
          </div>
        </div>

        {/* Acciones Rápidas del Rol */}
        {quickActions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            {quickActions}
          </div>
        )}
      </div>
    </div>
  );
}
