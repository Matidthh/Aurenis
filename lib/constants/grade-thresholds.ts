/**
 * Constantes y valores por defecto para los umbrales del semáforo de calificaciones (Decreto 67)
 * 
 * Responsables:
 * - 👑 Maicol R. (Arquitectura de Datos y Parámetros del Sistema)
 * - 🎨 Lucas P. (Design System y Colores Semafóricos)
 * - 🛡️ Frank M. (Seguridad Normativa y Escalas Oficiales)
 */

import type { GradeColorThresholds } from "@/lib/validations/school.schema";

export const DEFAULT_GRADE_THRESHOLDS: GradeColorThresholds = {
  redMax: 4.0,       // Menor a 4.0 es Insuficiente (Rojo)
  yellowMax: 5.0,    // 4.0 a < 5.0 es Elemental (Ámbar)
  greenMax: 6.0,     // 5.0 a < 6.0 es Adecuado (Verde)
  blueMax: 7.0,      // 6.0 a 7.0 es Destacado (Azul)
  redLabel: "Insuficiente",
  yellowLabel: "Elemental",
  greenLabel: "Adecuado",
  blueLabel: "Destacado",
};
