"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    glow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    bar: "from-blue-600 to-cyan-500",
    ring: "stroke-blue-500",
  },
  emerald: {
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    bar: "from-emerald-600 to-teal-400",
    ring: "stroke-emerald-500",
  },
  amber: {
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    glow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    bar: "from-amber-600 to-yellow-400",
    ring: "stroke-amber-500",
  },
  rose: {
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    glow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    bar: "from-rose-600 to-pink-500",
    ring: "stroke-rose-500",
  },
  purple: {
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    glow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
    bar: "from-purple-600 to-indigo-400",
    ring: "stroke-purple-500",
  },
  indigo: {
    iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    bar: "from-indigo-600 to-blue-400",
    ring: "stroke-indigo-500",
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
        "relative p-5 sm:p-6 rounded-3xl transition-all duration-300 group overflow-hidden",
        "bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80",
        "shadow-sm hover:shadow-xl dark:hover:shadow-[0_12px_35px_-10px_rgba(0,0,0,0.6)]",
        accent.glow,
        href && "cursor-pointer active:scale-[0.99]",
        className
      )}
    >
      {/* Barra superior de acento degradado */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity", accent.bar)} />

      {/* Cabecera de la Tarjeta */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
              {title}
            </span>
            {badgeLabel && (
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                {badgeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Icono con Contenedor Translúcido */}
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 shadow-xs",
            accent.iconBg
          )}
        >
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Métrica Numérica Principal con Tipografía Tabular */}
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "flex items-center text-xs font-extrabold px-2 py-0.5 rounded-md",
              trend.isNeutral
                ? "text-slate-500 bg-slate-100 dark:bg-slate-800"
                : trend.isPositive
                ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60"
                : "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60"
            )}
          >
            {trend.isNeutral ? (
              <Minus className="w-3.5 h-3.5 mr-0.5" />
            ) : trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      {/* Alerta de Umbral Crítico o Subtítulo */}
      {thresholdAlert?.isCritical ? (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span className="font-bold text-[11px] truncate">{thresholdAlert.message}</span>
        </div>
      ) : subtitle ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
          {subtitle}
        </p>
      ) : null}

      {/* Indicador de Acción si tiene enlace */}
      {href && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors">
          <span>Abrir módulo completo</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
