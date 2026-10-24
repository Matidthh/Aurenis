"use client";

import React, { memo } from "react";
import type { GradeColorThresholds } from "@/lib/validations/school.schema";

/**
 * Panel de Métricas y Estadísticas Globales del Curso con Semaforización Oficial
 * Responsable de autoría: Frank M. (Gestión Curricular y Estructura Académica) & Lucas P. (Diseño y WCAG AA)
 * Optimizado con React.memo para recalcularse únicamente ante variaciones reales del conjunto de datos.
 */

export interface CourseStatsData {
  avgOverall: number;
  passingCount: number;
  failingCount: number;
  passingPct: number;
  stdDev: number;
  distUnder4: number;
  dist4to5: number;
  dist5to6: number;
  dist6to7: number;
}

interface GradeMatrixStatsProps {
  stats: CourseStatsData;
  totalStudents: number;
  thresholds?: GradeColorThresholds | null;
}

export const GradeMatrixStats = memo(function GradeMatrixStats({
  stats,
  totalStudents,
  thresholds,
}: GradeMatrixStatsProps) {
  const red = thresholds?.redMax ?? 4.0;
  const yellow = thresholds?.yellowMax ?? 5.0;
  const green = thresholds?.greenMax ?? 6.0;
  const blue = thresholds?.blueMax ?? 7.0;

  const redLabel = thresholds?.redLabel || "Insuficiente";
  const yellowLabel = thresholds?.yellowLabel || "Elemental";
  const greenLabel = thresholds?.greenLabel || "Adecuado";
  const blueLabel = thresholds?.blueLabel || "Destacado";
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Promedio General */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Promedio Curso
        </div>
        <div
          className={`text-2xl font-black mt-1 ${
            stats.avgOverall >= 4.0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {stats.avgOverall > 0 ? stats.avgOverall.toFixed(1) : "—"}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Escala Oficial 1.0 - 7.0</div>
      </div>

      {/* 2. % Aprobación */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          % Aprobación
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          {stats.passingPct.toFixed(0)}%
        </div>
        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
          {stats.passingCount} de {totalStudents} alumnos
        </div>
      </div>

      {/* 3. En Riesgo */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          En Riesgo (&lt; {red.toFixed(1)})
        </div>
        <div
          className={`text-2xl font-black mt-1 ${
            stats.failingCount > 0
              ? "text-red-600 dark:text-red-400"
              : "text-slate-400"
          }`}
        >
          {stats.failingCount}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Alumnos bajo nota {red.toFixed(1)}</div>
      </div>

      {/* 4. Desviación Estándar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Desv. Estándar (σ)
        </div>
        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          ±{stats.stdDev.toFixed(2)}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">Dispersión de notas</div>
      </div>

      {/* 5 y 6. Distribución de Notas Cromática — Decreto 67 */}
      <div className="col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Semáforo D.67 ({red.toFixed(1)} - {blue.toFixed(1)})</span>
          <span className="text-[10px] text-slate-500 font-mono font-semibold">WCAG AA</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-2 text-center">
          {/* Rojo: Insuficiente */}
          <div
            role="status"
            aria-label={`${redLabel} (< ${red.toFixed(1)}): ${stats.distUnder4} alumnos en riesgo`}
            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800"
          >
            <span className="text-[9px] font-extrabold text-red-900 dark:text-red-200 block truncate" title={`${redLabel} (< ${red.toFixed(1)})`}>
              {redLabel.slice(0, 5)}. (&lt;{red.toFixed(1)})
            </span>
            <span className="text-sm font-black text-red-700 dark:text-red-300">
              {stats.distUnder4}
            </span>
          </div>

          {/* Ámbar: Elemental */}
          <div
            role="status"
            aria-label={`${yellowLabel} (${red.toFixed(1)} a ${(yellow - 0.1).toFixed(1)}): ${stats.dist4to5} alumnos en alerta`}
            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800"
          >
            <span className="text-[9px] font-bold text-amber-950 dark:text-amber-200 block truncate" title={`${yellowLabel} (${red.toFixed(1)} a ${(yellow - 0.1).toFixed(1)})`}>
              {yellowLabel.slice(0, 5)}. ({red.toFixed(1)}-{(yellow - 0.1).toFixed(1)})
            </span>
            <span className="text-sm font-black text-amber-800 dark:text-amber-300">
              {stats.dist4to5}
            </span>
          </div>

          {/* Verde: Adecuado */}
          <div
            role="status"
            aria-label={`${greenLabel} (${yellow.toFixed(1)} a ${(green - 0.1).toFixed(1)}): ${stats.dist5to6} alumnos satisfactorios`}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800"
          >
            <span className="text-[9px] font-bold text-emerald-950 dark:text-emerald-200 block truncate" title={`${greenLabel} (${yellow.toFixed(1)} a ${(green - 0.1).toFixed(1)})`}>
              {greenLabel.slice(0, 5)}. ({yellow.toFixed(1)}-{(green - 0.1).toFixed(1)})
            </span>
            <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">
              {stats.dist5to6}
            </span>
          </div>

          {/* Azul: Destacado */}
          <div
            role="status"
            aria-label={`${blueLabel} (${green.toFixed(1)} a ${blue.toFixed(1)}): ${stats.dist6to7} alumnos sobresalientes`}
            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800"
          >
            <span className="text-[9px] font-black text-blue-950 dark:text-blue-200 block truncate" title={`${blueLabel} (${green.toFixed(1)} a ${blue.toFixed(1)})`}>
              {blueLabel.slice(0, 5)}. ({green.toFixed(1)}-{blue.toFixed(1)})
            </span>
            <span className="text-sm font-black text-blue-800 dark:text-blue-300">
              {stats.dist6to7}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
