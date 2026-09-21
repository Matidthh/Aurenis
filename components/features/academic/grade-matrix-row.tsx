"use client";

import React, { memo, RefObject } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { StudentRow, AssessmentCol } from "./grade-matrix-spreadsheet";
import { GradeMatrixCell, getGradeChromaticClasses } from "./grade-matrix-cell";
import { DensityMode } from "./grade-matrix-toolbar";

/**
 * Fila de Estudiante en Planilla Matricial con React.memo
 * Responsable de autoría: Frank M. (Gestión Curricular) & Malcom Marcelo (Optimización de Rendimiento)
 * 
 * Garantiza que cuando se edita la nota de un estudiante o celda,
 * las demás filas de la grilla NO se re-renderizan, manteniendo el frame rate en 60 FPS (<16ms).
 */

interface GradeMatrixRowProps {
  student: StudentRow;
  studentIndex: number;
  assessments: AssessmentCol[];
  focusedAssessmentIndex: number | null;
  isRowFocused: boolean;
  dirtyCells: { [key: string]: boolean };
  density: DensityMode;
  calcMode: "simple" | "weighted";
  inputRef?: RefObject<HTMLInputElement | null>;
  editingValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelectCell: (studentIndex: number, assessmentIndex: number) => void;
  calculateStudentAverage: (student: StudentRow) => number | null;
}

export const GradeMatrixRow = memo(function GradeMatrixRow({
  student,
  studentIndex,
  assessments,
  focusedAssessmentIndex,
  isRowFocused,
  dirtyCells,
  density,
  calcMode,
  inputRef,
  editingValue,
  onInputChange,
  onKeyDown,
  onSelectCell,
  calculateStudentAverage,
}: GradeMatrixRowProps) {
  const studentAvg = calculateStudentAverage(student);
  const isPassing = studentAvg !== null && studentAvg >= 4.0;

  return (
    <tr
      className={`transition-colors ${
        isRowFocused
          ? "bg-brand-50/40 dark:bg-brand-950/20"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
      }`}
    >
      {/* Número de Lista */}
      <td className="sticky left-0 z-10 bg-inherit text-center text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800">
        {studentIndex + 1}
      </td>

      {/* Nombre y Datos del Estudiante */}
      <td className="sticky left-12 z-10 bg-inherit px-3 border-r border-slate-200 dark:border-slate-800 font-sans">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate">
            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {student.lastName}, {student.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {student.rut} • Asist: {student.attendancePct}%
            </div>
          </div>
          {student.pie && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              PIE
            </span>
          )}
        </div>
      </td>

      {/* Celdas de Calificaciones */}
      {assessments.map((ass, assIdx) => {
        const isCellFocused = isRowFocused && focusedAssessmentIndex === assIdx;
        const val = student.grades[ass.id];
        const cellKey = `${student.id}_${ass.id}`;
        const isDirty = Boolean(dirtyCells[cellKey]);

        return (
          <GradeMatrixCell
            key={ass.id}
            val={val}
            isFocused={isCellFocused}
            isDirty={isDirty}
            density={density}
            inputRef={isCellFocused ? inputRef : undefined}
            editingValue={editingValue}
            onInputChange={onInputChange}
            onKeyDown={onKeyDown}
            onClick={() => onSelectCell(studentIndex, assIdx)}
          />
        );
      })}

      {/* Promedio Final del Alumno */}
      <td className="text-center px-2 py-2 border-l-2 border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-850/60">
        <div
          className={`inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black tracking-wide ${getGradeChromaticClasses(
            studentAvg,
            true
          )}`}
        >
          {studentAvg !== null ? studentAvg.toFixed(1) : "S/N"}
        </div>
      </td>

      {/* Situación / Alerta */}
      <td className="text-center px-2 py-2">
        {studentAvg === null ? (
          <span className="text-[10px] text-slate-400 font-sans">Sin Datos</span>
        ) : isPassing ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-sans">
            <CheckCircle2 className="w-3 h-3" />
            Aprobado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full font-sans animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Reprobando
          </span>
        )}
      </td>
    </tr>
  );
});
