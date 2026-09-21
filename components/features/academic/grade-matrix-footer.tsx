"use client";

import React, { memo } from "react";
import { Calculator } from "lucide-react";
import { StudentRow, AssessmentCol } from "./grade-matrix-spreadsheet";

/**
 * Barra Inferior de Estado & Atajos de Teclado
 * Responsable de autoría: Frank M. (Gestión Curricular y Estructura Académica)
 */

interface GradeMatrixFooterProps {
  focusedStudent: StudentRow | undefined;
  focusedAssessment: AssessmentCol | undefined;
  calcMode: "simple" | "weighted";
}

export const GradeMatrixFooter = memo(function GradeMatrixFooter({
  focusedStudent,
  focusedAssessment,
  calcMode,
}: GradeMatrixFooterProps) {
  return (
    <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
          <span className="font-bold text-white">Celda Activa:</span>
          {focusedStudent && focusedAssessment ? (
            <span className="text-slate-300 font-mono">
              {focusedStudent.lastName} • {focusedAssessment.code} ({focusedAssessment.weightPct}%)
            </span>
          ) : (
            <span className="text-slate-500">Ninguna seleccionada</span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-400 border-l border-slate-700 pl-4">
          <Calculator className="w-3.5 h-3.5 text-brand-400" />
          <span>
            Fórmula: {calcMode === "simple" ? "Promedio Simple (Aritmético)" : "Ponderado Decreto 67"}
          </span>
        </div>
      </div>

      {/* Guía Rápida de Teclas */}
      <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
            Flechas ↑↓←→
          </kbd>
          <span>Mover foco</span>
        </div>

        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
            Enter / Tab
          </kbd>
          <span>Confirmar & avanzar</span>
        </div>

        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
            65 = 6.5
          </kbd>
          <span className="text-amber-300 font-semibold">Tipeo Rápido</span>
        </div>
      </div>
    </div>
  );
});
