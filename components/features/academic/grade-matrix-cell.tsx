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
  inputRef?: RefObject<HTMLInputElement | null>;
  editingValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export function getGradeChromaticClasses(val: number | null | undefined, isBadge = false): string {
  if (val === null || val === undefined || isNaN(val)) {
    return isBadge
      ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      : "text-slate-300 dark:text-slate-600";
  }

  if (val < 4.0) {
    return isBadge
      ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 font-black"
      : "text-red-600 dark:text-red-400 font-extrabold bg-red-50/40 dark:bg-red-950/20";
  }
  if (val < 5.0) {
    return isBadge
      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
      : "text-amber-600 dark:text-amber-400 font-bold bg-amber-50/20 dark:bg-amber-950/10";
  }
  if (val < 6.0) {
    return isBadge
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
      : "text-emerald-600 dark:text-emerald-400 font-bold";
  }
  return isBadge
    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-black"
    : "text-blue-600 dark:text-blue-400 font-black";
}

export const GradeMatrixCell = memo(function GradeMatrixCell({
  val,
  isFocused,
  isDirty,
  density,
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
      onClick={onClick}
      className={`text-center p-0 border-r border-slate-200 dark:border-slate-800 relative cursor-pointer transition-all ${
        isFocused
          ? "ring-2 ring-brand-500 dark:ring-brand-400 z-20 bg-white dark:bg-slate-850 shadow-md font-black"
          : ""
      }`}
    >
      {isFocused ? (
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
