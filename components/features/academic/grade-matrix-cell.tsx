"use client";

import React, { memo, RefObject } from "react";
import { DensityMode } from "./grade-matrix-toolbar";

/**
 * Celda Individual de Calificación Matricial Optimizada con React.memo
 * Responsable de autoría: Frank M. (Gestión Curricular) & Malcom Marcelo (Optimización de Rendimiento)
 * 
 * Evita el re-renderizado de celdas no afectadas durante la digitación numérica masiva.
 */

export interface GradeMatrixCellProps {
  val: number | null | undefined;
  isFocused: boolean;
  isDirty: boolean;
  density: DensityMode;
  readOnly?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
  editingValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export function getGradeChromaticClasses(val: number | null | undefined, isBadge = false): string {
  if (val === null || val === undefined || isNaN(val)) {
    return isBadge
      ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
      : "text-slate-400 dark:text-slate-500";
  }

  // Nivel 1: Insuficiente (< 4.0) - Rojo de alto contraste WCAG AA (ratio > 7:1)
  if (val < 4.0) {
    return isBadge
      ? "bg-red-50 text-red-900 dark:bg-red-950/80 dark:text-red-100 border border-red-300 dark:border-red-700 font-black"
      : "text-red-700 dark:text-red-300 font-extrabold bg-red-50/50 dark:bg-red-950/30";
  }
  // Nivel 2: Elemental (4.0 a 4.9) - Ámbar de alto contraste WCAG AA (ratio > 5.3:1)
  if (val < 5.0) {
    return isBadge
      ? "bg-amber-50 text-amber-950 dark:bg-amber-950/80 dark:text-amber-100 border border-amber-300 dark:border-amber-700 font-bold"
      : "text-amber-800 dark:text-amber-300 font-bold bg-amber-50/40 dark:bg-amber-950/20";
  }
  // Nivel 3: Adecuado (5.0 a 5.9) - Verde de alto contraste WCAG AA (ratio > 6.8:1)
  if (val < 6.0) {
    return isBadge
      ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/80 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 font-bold"
      : "text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50/30 dark:bg-emerald-950/20";
  }
  // Nivel 4: Destacado (6.0 a 7.0) - Azul de alto contraste WCAG AA (ratio > 8.4:1)
  return isBadge
    ? "bg-blue-50 text-blue-950 dark:bg-blue-950/80 dark:text-blue-100 border border-blue-300 dark:border-blue-700 font-black"
    : "text-blue-800 dark:text-blue-300 font-black bg-blue-50/30 dark:bg-blue-950/20";
}

export const GradeMatrixCell = memo(function GradeMatrixCell({
  val,
  isFocused,
  isDirty,
  density,
  readOnly = false,
  inputRef,
  editingValue,
  onInputChange,
  onKeyDown,
  onClick,
}: GradeMatrixCellProps) {
  const densityRowClasses = {
    compact: "py-1 px-2 text-xs",
    normal: "py-2 px-3 text-xs sm:text-sm",
    spacious: "py-3.5 px-4 text-sm",
  }[density];

  const chromaticClass = getGradeChromaticClasses(val, false);

  return (
    <td
      onClick={readOnly ? undefined : onClick}
      className={`text-center p-0 border-r border-slate-200 dark:border-slate-800 relative ${readOnly ? "cursor-default select-text" : "cursor-pointer"} transition-all ${
        isFocused && !readOnly
          ? "ring-2 ring-brand-500 dark:ring-brand-400 z-20 bg-white dark:bg-slate-850 shadow-md font-black"
          : ""
      }`}
    >
      {isFocused && !readOnly ? (
        <div className="relative w-full h-full flex items-center justify-center p-1">
          <input
            ref={inputRef}
            type="text"
            maxLength={4}
            value={editingValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            className={`w-full text-center py-1.5 px-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm rounded-lg border-2 border-brand-500 dark:border-brand-400 focus:outline-hidden shadow-inner tracking-wider ${
              editingValue && parseFloat(editingValue) < 4.0
                ? "text-red-600 dark:text-red-400 bg-red-50/50"
                : ""
            }`}
            placeholder="—"
          />
          {isDirty && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
      ) : (
        <div
          className={`${densityRowClasses} flex items-center justify-center relative font-mono tracking-tight transition-colors ${chromaticClass}`}
        >
          <span className="text-xs sm:text-sm font-semibold">
            {val !== null && val !== undefined ? val.toFixed(1) : "—"}
          </span>
          {isDirty && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
        </div>
      )}
    </td>
  );
});
