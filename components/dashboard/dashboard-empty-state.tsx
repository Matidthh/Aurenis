"use client";

import React from "react";
import {
  CalendarCheck,
  CheckCircle2,
  FileSpreadsheet,
  HeartHandshake,
  ShieldCheck,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * ============================================================================
 * ESTADOS VACÍOS ESPECIALIZADOS DEL DASHBOARD (EMPTY STATES)
 * ============================================================================
 * Proporciona estados ilustrados para:
 * 1. Sin sesiones de asistencia activas
 * 2. Sin evaluaciones pendientes por calificar (Decreto 67)
 * 3. Sin incidentes ni alertas de convivencia escolar
 * 4. Sin inasistencias por justificar (Familia/Apoderado)
 * 5. Sin clases restantes en la jornada
 *
 * Responsables: Lucas P. (Design) & Frank M. (QA)
 * ============================================================================
 */

export interface DashboardEmptyStateProps {
  type: "attendance" | "assessments" | "coexistence" | "justifications" | "schedule";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const CONFIG = {
  attendance: {
    icon: CalendarCheck,
    title: "Sin sesiones de asistencia activas hoy",
    description: "Inicia una nueva toma de asistencia digital mediante código QR rotativo o carga manual por lista.",
    actionLabel: "Iniciar Toma de Asistencia",
    badge: "Control Diario",
  },
  assessments: {
    icon: CheckCircle2,
    title: "Todas las evaluaciones al día",
    description: "No tienes actas ni calificaciones pendientes de ingreso bajo el Decreto 67 de evaluación.",
    actionLabel: "Crear Nueva Evaluación",
    badge: "Decreto 67 MINEDUC",
  },
  coexistence: {
    icon: ShieldCheck,
    title: "Comunidad escolar en armonía",
    description: "No se registran incidentes graves, mediaciones pendientes ni protocolos de Circular 482 activos.",
    actionLabel: "Registrar Nueva Observación",
    badge: "Convivencia Escolar",
  },
  justifications: {
    icon: HeartHandshake,
    title: "Asistencia al día sin inasistencias pendientes",
    description: "Tu estudiante cuenta con asistencia completa durante el período actual. No hay certificados por adjuntar.",
    actionLabel: "Ver Historial Completo",
    badge: "Portal Familia",
  },
  schedule: {
    icon: BookOpen,
    title: "Jornada de clases completada",
    description: "No restan bloques pedagógicos para el día de hoy. Puedes consultar las planificaciones de mañana.",
    actionLabel: "Ver Horario Semanal",
    badge: "Horario Lectivo",
  },
};

export function DashboardEmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: DashboardEmptyStateProps) {
  const currentConfig = CONFIG[type] || CONFIG.attendance;
  const IconComponent = currentConfig.icon;

  return (
    <div
      className={cn(
        "p-8 sm:p-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0B1120]/50 text-center flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center shadow-xs">
        <IconComponent className="w-7 h-7" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          · {currentConfig.badge} ·
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          {title || currentConfig.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description || currentConfig.description}
        </p>
      </div>

      {(actionLabel || currentConfig.actionLabel) && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer min-h-[44px]"
        >
          <span>{actionLabel || currentConfig.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
