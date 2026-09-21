"use client";

import React, { memo } from "react";

/**
 * Panel de Métricas y Estadísticas Globales del Curso con Semaforización Oficial
 * Responsable de autoría: Frank M. (Gestión Curricular y Estructura Académica)
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
}

export const GradeMatrixStats = memo(function GradeMatrixStats({
  stats,
  totalStudents,
}: GradeMatrixStatsProps) {
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
          En Riesgo (&lt; 4.0)
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
        <div className="text-[10px] text-slate-400 mt-0.5">Alumnos bajo nota 4.0</div>
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

      {/* 5 y 6. Distribución de Notas Cromática */}
      <div className="col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Distribución Cromática</span>
          <span className="text-[10px] lowercase text-slate-400">según rendimiento</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-2 text-center">
          <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200/50">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block">
              &lt; 4.0
            </span>
            <span className="text-xs font-extrabold text-red-700 dark:text-red-300">
              {stats.distUnder4}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
              4.0-4.9
            </span>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
              {stats.dist4to5}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
              5.0-5.9
            </span>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              {stats.dist5to6}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">
              6.0-7.0
            </span>
            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
              {stats.dist6to7}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
