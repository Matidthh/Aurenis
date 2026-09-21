"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Utilidad de Monitoreo de Rendimiento de Renderizado en React (< 16ms / 60 FPS)
 * Responsable de autoría: Malcom Marcelo (Arquitectura Core & Optimización de Rendimiento)
 * 
 * Permite medir el tiempo de montaje y actualización de componentes masivos (tablas, matrices),
 * verificando el cumplimiento del presupuesto de cuadro de 16.6ms (60 frames por segundo).
 */

export interface RenderMetric {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  timestamp: number;
  isWithinBudget: boolean; // <= 16ms
}

export interface PerformanceStats {
  lastRenderTime: number;
  avgRenderTime: number;
  peakRenderTime: number;
  renderCount: number;
  isWithinBudget: boolean; // < 16ms
  history: RenderMetric[];
}

/**
 * Hook para registrar y auditar el tiempo de renderizado de componentes
 */
export function useRenderPerformance(componentName: string) {
  const [stats, setStats] = useState<PerformanceStats>({
    lastRenderTime: 0,
    avgRenderTime: 0,
    peakRenderTime: 0,
    renderCount: 0,
    isWithinBudget: true,
    history: [],
  });

  const renderDurationsRef = useRef<number[]>([]);

  const onRenderCallback = useCallback(
    (
      id: string,
      phase: "mount" | "update" | "nested-update",
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      const roundedDuration = Math.round(actualDuration * 100) / 100;
      renderDurationsRef.current.push(roundedDuration);
      if (renderDurationsRef.current.length > 50) {
        renderDurationsRef.current.shift();
      }

      const sum = renderDurationsRef.current.reduce((a, b) => a + b, 0);
      const avg = Math.round((sum / renderDurationsRef.current.length) * 100) / 100;
      const peak = Math.max(...renderDurationsRef.current);

      const metric: RenderMetric = {
        id,
        phase,
        actualDuration: roundedDuration,
        baseDuration: Math.round(baseDuration * 100) / 100,
        startTime,
        commitTime,
        timestamp: Date.now(),
        isWithinBudget: roundedDuration < 16.0,
      };

      setStats((prev) => ({
        lastRenderTime: roundedDuration,
        avgRenderTime: avg,
        peakRenderTime: Math.max(prev.peakRenderTime, peak),
        renderCount: prev.renderCount + 1,
        isWithinBudget: roundedDuration < 16.0,
        history: [metric, ...prev.history.slice(0, 19)],
      }));
    },
    []
  );

  return {
    stats,
    onRenderCallback,
  };
}

/**
 * Componente Visual de Indicador de Rendimiento en Pantalla (Render Badge)
 */
export function RenderTimeBadge({
  stats,
  label = "Render",
  showDetails = false,
}: {
  stats: PerformanceStats;
  label?: string;
  showDetails?: boolean;
}) {
  const isFast = stats.lastRenderTime < 8.0;
  const isOptimal = stats.lastRenderTime < 16.0;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
        isOptimal
          ? isFast
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
            : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
      }`}
      title={`Métricas de React.Profiler: Último: ${stats.lastRenderTime}ms, Promedio: ${stats.avgRenderTime}ms, Pico: ${stats.peakRenderTime}ms, Renders: ${stats.renderCount}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOptimal ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
        }`}
      />
      <span>
        ⚡ {label}: <strong>{stats.lastRenderTime > 0 ? `${stats.lastRenderTime}ms` : "&lt; 1ms"}</strong>
      </span>
      {stats.isWithinBudget ? (
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
          (60 FPS)
        </span>
      ) : (
        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
          (&gt;16ms)
        </span>
      )}
    </div>
  );
}
