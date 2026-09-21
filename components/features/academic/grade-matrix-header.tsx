"use client";

import React, { memo } from "react";
import { Zap, CheckCircle2, Sparkles, Save } from "lucide-react";
import { RenderTimeBadge, PerformanceStats } from "@/lib/utils/performance-monitor";

/**
 * Encabezado de la Planilla Matricial con Indicadores de Estado y Acciones Rápidas
 * Responsable de autoría: Frank M. (Gestión Curricular) & Malcom Marcelo (Arquitectura Core)
 */

interface GradeMatrixHeaderProps {
  isLive: boolean;
  rapidTypeMode: boolean;
  feedbackMessage: string | null;
  saveStatus: "synced" | "saving" | "unsaved";
  onQuickDemoFill: () => void;
  onSaveGrades: () => void;
  performanceStats?: PerformanceStats;
}

export const GradeMatrixHeader = memo(function GradeMatrixHeader({
  isLive,
  rapidTypeMode,
  feedbackMessage,
  saveStatus,
  onQuickDemoFill,
  onSaveGrades,
  performanceStats,
}: GradeMatrixHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/50">
            1° Medio A • Matemáticas
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Primer Semestre 2026 (Decreto 67)
          </span>
          {rapidTypeMode && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Zap className="w-3 h-3 text-emerald-500" />
              Tipeo Rápido Activo
            </span>
          )}
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              REST En Vivo (Bearer)
            </span>
          )}
          {performanceStats && (
            <RenderTimeBadge stats={performanceStats} label="Matriz Render" />
          )}
        </div>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Planilla Matricial de Calificaciones
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ingreso ultrarrápido por teclado, semaforización oficial MINEDUC y renderizado a 60 FPS (&lt;16ms).
        </p>
      </div>

      {/* Acciones de Guardado, Estado y Controles Rápidos */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {feedbackMessage && (
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div
            className={`w-2 h-2 rounded-full ${
              saveStatus === "synced"
                ? "bg-emerald-500"
                : saveStatus === "saving"
                ? "bg-amber-500 animate-ping"
                : "bg-amber-500"
            }`}
          />
          <span>
            {saveStatus === "synced"
              ? "Sincronizado"
              : saveStatus === "saving"
              ? "Guardando..."
              : "Cambios pendientes"}
          </span>
        </div>

        <button
          type="button"
          onClick={onQuickDemoFill}
          title="Llenar datos de ejemplo realistas"
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Datos Demo</span>
        </button>

        <button
          type="button"
          onClick={onSaveGrades}
          disabled={saveStatus === "saving"}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Guardar Planilla</span>
        </button>
      </div>
    </div>
  );
});
