"use client";

import React, { memo } from "react";
import { Search, HelpCircle, Zap, ArrowDown, ArrowRight } from "lucide-react";

export type DensityMode = "compact" | "normal" | "spacious";
export type AutoAdvanceDirection = "down" | "right";

interface GradeMatrixToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  riskFilter: "all" | "at_risk" | "passing";
  onRiskFilterChange: (val: "all" | "at_risk" | "passing") => void;
  calcMode: "simple" | "weighted";
  onCalcModeChange: (mode: "simple" | "weighted") => void;
  onOpenDecretoModal: () => void;
  rapidTypeMode: boolean;
  onToggleRapidTypeMode: () => void;
  advanceDirection: AutoAdvanceDirection;
  onAdvanceDirectionChange: (dir: AutoAdvanceDirection) => void;
  density: DensityMode;
  onDensityChange: (density: DensityMode) => void;
}

export const GradeMatrixToolbar = memo(function GradeMatrixToolbar({
  searchQuery,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  calcMode,
  onCalcModeChange,
  onOpenDecretoModal,
  rapidTypeMode,
  onToggleRapidTypeMode,
  advanceDirection,
  onAdvanceDirectionChange,
  density,
  onDensityChange,
}: GradeMatrixToolbarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por apellido, nombre o RUN..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => onRiskFilterChange(e.target.value as any)}
          className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="at_risk">Solo en Riesgo (&lt; 4.0)</option>
          <option value="passing">Solo Aprobados (≥ 4.0)</option>
        </select>
      </div>

      {/* Toggles de Velocidad y Densidad */}
      <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
        {/* Selector de Modo de Promedio */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => onCalcModeChange("simple")}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              calcMode === "simple"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Todas las evaluaciones tienen exactamente el mismo valor (promedio estándar nacional)"
          >
            Promedio Simple
          </button>
          <button
            type="button"
            onClick={() => onCalcModeChange("weighted")}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              calcMode === "weighted"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Cálculo con porcentajes de ponderación por evaluación"
          >
            Ponderado (%)
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenDecretoModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition shadow-2xs cursor-pointer"
          title="¿Cómo funciona la lógica de cálculo y ponderaciones de notas?"
        >
          <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Ayuda & Ponderaciones</span>
        </button>

        {/* Tipeo Rápido 2 dígitos */}
        <button
          type="button"
          onClick={onToggleRapidTypeMode}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
            rapidTypeMode
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
              : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
          }`}
          title="Auto-formato: Escribir '65' guarda 6.5 y salta a la siguiente celda"
        >
          <Zap
            className={`w-3.5 h-3.5 ${
              rapidTypeMode ? "text-amber-500" : "text-slate-400"
            }`}
          />
          <span>Tipeo Rápido</span>
        </button>

        {/* Dirección de Avance con Enter */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => onAdvanceDirectionChange("down")}
            className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
              advanceDirection === "down"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Avanzar hacia abajo (siguiente alumno)"
          >
            <ArrowDown className="w-3 h-3" />
            <span>Enter ↓</span>
          </button>
          <button
            type="button"
            onClick={() => onAdvanceDirectionChange("right")}
            className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer ${
              advanceDirection === "right"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Avanzar a la derecha (siguiente evaluación)"
          >
            <ArrowRight className="w-3 h-3" />
            <span>Enter →</span>
          </button>
        </div>

        {/* Selector de Densidad */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => onDensityChange("compact")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              density === "compact"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500"
            }`}
            title="Vista Compacta de Alta Densidad"
          >
            Compacta
          </button>
          <button
            type="button"
            onClick={() => onDensityChange("normal")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              density === "normal"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500"
            }`}
            title="Vista Normal Equilibrada"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => onDensityChange("spacious")}
            className={`px-2 py-1 rounded-lg font-bold transition cursor-pointer ${
              density === "spacious"
                ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                : "text-slate-500"
            }`}
            title="Vista Espaciosa"
          >
            Amplia
          </button>
        </div>
      </div>
    </div>
  );
});
