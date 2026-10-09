"use client";

/**
 * Re-exportación optimizada de la Planilla Matricial de Calificaciones
 * Responsable de autoría: Malcom Marcelo & Frank M.
 */
export {
  GradeMatrixSpreadsheet,
  INITIAL_ASSESSMENTS,
  INITIAL_STUDENTS,
} from "@/components/features/academic/grade-matrix-spreadsheet";
export {
  GradeStatusSemaphoricIndicator,
  getDecreto67Tier,
  DECRETO_67_TIERS,
} from "@/components/features/academic/grade-status-semaphoric-indicator";
export type {
  Decreto67Tier,
  GradeStatusSemaphoricIndicatorProps,
} from "@/components/features/academic/grade-status-semaphoric-indicator";
export type {
  StudentRow,
  AssessmentCol,
  GradeMatrixSpreadsheetProps,
} from "@/components/features/academic/grade-matrix-spreadsheet";
