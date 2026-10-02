"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * ============================================================================
 * TARJETA DE RESUMEN ACADÉMICO (ACADEMIC SUMMARY CARD)
 * ============================================================================
 * Diseñada para el Modo Oscuro Premium de AURENIS con:
 * - Tipografía tabular de alta legibilidad
 * - Alerta de umbral ministerial MINEDUC (ej. asistencia < 85%, notas < 4.0)
 * - Cero Pills estáticas (Metadata limpia separada por interpunto '·')
 * - Soporte para hipervínculo de profundización (drill-down)
 *
 * Responsables: Lucas P. (Design System) & Malcom Marcelo (Frontend React)
 * ============================================================================
 */

export interface AcademicSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  thresholdAlert?: {
    isCritical: boolean;
    message: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: "blue" | "emerald" | "amber" | "rose" | "purple" | "indigo";
  href?: string;
  className?: string;
  badgeLabel?: string;
}

const ACCENT_STYLES = {
  blue: {
    iconBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20",
    glow: "hover:border-blue-500/40 shadow-blue-500/5",
    bar: "bg-blue-600",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    glow: "hover:border-emerald-500/40 shadow-emerald-500/5",
    bar: "bg-emerald-500",
  },
  amber: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    glow: "hover:border-amber-500/40 shadow-amber-500/5",
    bar: "bg-amber-500",
  },
  rose: {
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    glow: "hover:border-rose-500/40 shadow-rose-500/5",
    bar: "bg-rose-500",
  },
  purple: {
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    glow: "hover:border-purple-500/40 shadow-purple-500/5",
    bar: "bg-purple-500",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    glow: "hover:border-indigo-500/40 shadow-indigo-500/5",
    bar: "bg-indigo-500",
  },
};

export function AcademicSummaryCard({
  title,
  value,
  subtitle,
  trend,
  thresholdAlert,
  icon: IconComponent,
  accentColor = "blue",
  href,
  className,
  badgeLabel,
}: AcademicSummaryCardProps) {
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.blue;

  const cardContent = (
    <div
      className={cn(
        "relative p-5 sm:p-6 rounded-2xl transition-all duration-200 group",
        "bg-white dark:bg-[#0B1120] border border-slate-200/90 dark:border-slate-800/90",
        "shadow-xs hover:shadow-lg dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]",
        accent.glow,
        href && "cursor-pointer active:scale-[0.99]",
        className
      )}
    >
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {title}
            </span>
            {badgeLabel && (
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                · {badgeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Icono con Contenedor Translúcido Premium */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105",
            accent.iconBg
          )}
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Métrica Numérica Principal con Tipografía Tabular */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "flex items-center text-xs font-bold",
              trend.isNeutral
                ? "text-slate-400 dark:text-slate-500"
                : trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.isNeutral ? (
              <Minus className="w-3.5 h-3.5 mr-0.5" />
            ) : trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      {/* Alerta de Umbral Crítico (ej: Asistencia bajo el 85% oficial MINEDUC) */}
      {thresholdAlert?.isCritical ? (
        <div className="mt-3 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="font-semibold text-[11px] truncate">{thresholdAlert.message}</span>
        </div>
      ) : subtitle ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
          {subtitle}
        </p>
      ) : null}

      {/* Indicador de Acción si tiene enlace */}
      {href && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
          <span>Ver desglose detallado</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
