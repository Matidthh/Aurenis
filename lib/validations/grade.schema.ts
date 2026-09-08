/**
 * Esquemas de Validación para Notas y Calificaciones
 * Validaciones robustas para datos académicos
 */

import { z } from 'zod';
import {
  sanitizeString,
  validateNumberRange,
} from './index';

/**
 * Schema para crear evaluación
 */
export const CreateAssessmentSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  subjectId: z.string()
    .min(1, 'El ID de la asignatura es obligatorio')
    .uuid('El ID de la asignatura no tiene un formato válido'),

  academicPeriodId: z.string()
    .min(1, 'El ID del periodo académico es obligatorio')
    .uuid('El ID del periodo académico no tiene un formato válido'),

  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título excede el límite de caracteres')
    .transform(sanitizeString),

  description: z.string()
    .optional()
    .max(1000, 'La descripción excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  date: z.string()
    .min(1, 'La fecha de la evaluación es obligatoria')
    .refine(date => {
      const evalDate = new Date(date);
      return !isNaN(evalDate.getTime());
    }, {
      message: 'La fecha de la evaluación no tiene un formato válido',
    })
    .transform(date => new Date(date)),

  weightPercentage: z.number()
    .refine(weight => validateNumberRange(weight, 0, 100), {
      message: 'El porcentaje de peso debe estar entre 0 y 100',
    })
    .default(100),

  isPublished: z.boolean()
    .default(false),
});

/**
 * Schema para actualizar evaluación
 */
export const UpdateAssessmentSchema = z.object({
  title: z.string()
    .optional()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  description: z.string()
    .optional()
    .max(1000, 'La descripción excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  date: z.string()
    .optional()
    .refine(date => {
      if (!date) return true;
      const evalDate = new Date(date);
      return !isNaN(evalDate.getTime());
    }, {
      message: 'La fecha de la evaluación no tiene un formato válido',
    })
    .transform(date => date ? new Date(date) : undefined),

  weightPercentage: z.number()
    .optional()
    .refine(weight => validateNumberRange(weight, 0, 100), {
      message: 'El porcentaje de peso debe estar entre 0 y 100',
    }),

  isPublished: z.boolean()
    .optional(),
});

/**
 * Schema para crear calificación
 */
export const CreateGradeSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  assessmentId: z.string()
    .min(1, 'El ID de la evaluación es obligatorio')
    .uuid('El ID de la evaluación no tiene un formato válido'),

  enrollmentId: z.string()
    .min(1, 'El ID de la matrícula es obligatorio')
    .uuid('El ID de la matrícula no tiene un formato válido'),

  value: z.number()
    .refine(grade => validateNumberRange(grade, 1.0, 7.0), {
      message: 'La calificación debe estar entre 1.0 y 7.0',
    })
    .refine(grade => {
      // Validar decimales (máximo 1 decimal)
      const decimalPart = grade % 1;
      return decimalPart === 0 || decimalPart >= 0.1 && decimalPart <= 0.9;
    }, {
      message: 'La calificación puede tener máximo 1 decimal',
    }),

  feedback: z.string()
    .optional()
    .max(500, 'El feedback excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),
});

/**
 * Schema para crear calificación con validación de configuración del colegio
 */
export const CreateGradeWithSchoolConfigSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  assessmentId: z.string()
    .min(1, 'El ID de la evaluación es obligatorio')
    .uuid('El ID de la evaluación no tiene un formato válido'),

  enrollmentId: z.string()
    .min(1, 'El ID de la matrícula es obligatorio')
    .uuid('El ID de la matrícula no tiene un formato válido'),

  value: z.number()
    .refine(grade => grade >= 0, {
      message: 'La calificación no puede ser negativa',
    })
    .refine(grade => grade <= 10, {
      message: 'La calificación no puede exceder 10.0',
    }),

  feedback: z.string()
    .optional()
    .max(500, 'El feedback excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  // Configuración del colegio para validación
  schoolConfig: z.object({
    minGrade: z.number().default(1.0),
    maxGrade: z.number().default(7.0),
    gradeScalePrecision: z.number().default(1),
    minPassingGrade: z.number().default(4.0),
  }).optional(),
}).refine(data => {
  if (!data.schoolConfig) return true;
  
  const { minGrade, maxGrade, gradeScalePrecision } = data.schoolConfig;
  
  // Validar rango según configuración del colegio
  if (!validateNumberRange(data.value, minGrade, maxGrade)) {
    return false;
  }
  
  // Validar precisión de decimales
  const decimalPlaces = data.value.toString().split('.')[1]?.length || 0;
  if (decimalPlaces > gradeScalePrecision) {
    return false;
  }
  
  return true;
}, {
  message: 'La calificación no cumple con la configuración del colegio',
});

/**
 * Schema para actualizar calificación
 */
export const UpdateGradeSchema = z.object({
  value: z.number()
    .optional()
    .refine(grade => grade === undefined || validateNumberRange(grade, 1.0, 7.0), {
      message: 'La calificación debe estar entre 1.0 y 7.0',
    })
    .refine(grade => {
      if (grade === undefined) return true;
      const decimalPart = grade % 1;
      return decimalPart === 0 || (decimalPart >= 0.1 && decimalPart <= 0.9);
    }, {
      message: 'La calificación puede tener máximo 1 decimal',
    }),

  feedback: z.string()
    .optional()
    .max(500, 'El feedback excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),
});

/**
 * Schema para crear múltiples calificaciones (batch)
 */
export const CreateBulkGradesSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  assessmentId: z.string()
    .min(1, 'El ID de la evaluación es obligatorio')
    .uuid('El ID de la evaluación no tiene un formato válido'),

  grades: z.array(z.object({
    enrollmentId: z.string()
      .uuid('El ID de la matrícula no tiene un formato válido'),

    value: z.number()
      .refine(grade => validateNumberRange(grade, 1.0, 7.0), {
        message: 'La calificación debe estar entre 1.0 y 7.0',
      }),

    feedback: z.string()
      .optional()
      .max(500, 'El feedback excede el límite de caracteres')
      .transform(val => val ? sanitizeString(val) : undefined),
  }))
  .min(1, 'Debe haber al menos una calificación')
  .max(50, 'No se pueden crear más de 50 calificaciones a la vez'),
});

/**
 * Schema para publicar evaluación
 */
export const PublishAssessmentSchema = z.object({
  assessmentId: z.string()
    .min(1, 'El ID de la evaluación es obligatorio')
    .uuid('El ID de la evaluación no tiene un formato válido'),

  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),
});

/**
 * Schema para buscar calificaciones
 */
export const SearchGradesSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  studentId: z.string()
    .optional()
    .uuid('El ID del estudiante no tiene un formato válido'),

  subjectId: z.string()
    .optional()
    .uuid('El ID de la asignatura no tiene un formato válido'),

  assessmentId: z.string()
    .optional()
    .uuid('El ID de la evaluación no tiene un formato válido'),

  academicPeriodId: z.string()
    .optional()
    .uuid('El ID del periodo académico no tiene un formato válido'),

  courseId: z.string()
    .optional()
    .uuid('El ID del curso no tiene un formato válido'),

  year: z.number()
    .optional()
    .int('El año debe ser un número entero')
    .min(2020, 'El año debe ser 2020 o posterior')
    .max(2100, 'El año no puede ser posterior a 2100'),

  minGrade: z.number()
    .optional()
    .refine(grade => grade === undefined || validateNumberRange(grade, 1.0, 7.0), {
      message: 'La calificación mínima debe estar entre 1.0 y 7.0',
    }),

  maxGrade: z.number()
    .optional()
    .refine(grade => grade === undefined || validateNumberRange(grade, 1.0, 7.0), {
      message: 'La calificación máxima debe estar entre 1.0 y 7.0',
    }),

  limit: z.number()
    .optional()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'El límite no puede exceder 100')
    .default(20),

  offset: z.number()
    .optional()
    .int('El offset debe ser un número entero')
    .min(0, 'El offset no puede ser negativo')
    .default(0),
});

/**
 * Schema para calcular promedio de calificaciones
 */
export const CalculateGradeAverageSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  enrollmentId: z.string()
    .min(1, 'El ID de la matrícula es obligatorio')
    .uuid('El ID de la matrícula no tiene un formato válido'),

  subjectId: z.string()
    .optional()
    .uuid('El ID de la asignatura no tiene un formato válido'),

  academicPeriodId: z.string()
    .optional()
    .uuid('El ID del periodo académico no tiene un formato válido'),
});

/**
 * Schema para ajustar calificación de estudiante
 */
export const AdjustGradeSchema = z.object({
  gradeId: z.string()
    .min(1, 'El ID de la calificación es obligatorio')
    .uuid('El ID de la calificación no tiene un formato válido'),

  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  newValue: z.number()
    .refine(grade => validateNumberRange(grade, 1.0, 7.0), {
      message: 'La calificación debe estar entre 1.0 y 7.0',
    }),

  reason: z.string()
    .min(5, 'El motivo debe tener al menos 5 caracteres')
    .max(500, 'El motivo excede el límite de caracteres')
    .transform(sanitizeString),
});

// Tipos TypeScript exportados
export type CreateAssessmentInput = z.infer<typeof CreateAssessmentSchema>;
export type UpdateAssessmentInput = z.infer<typeof UpdateAssessmentSchema>;
export type CreateGradeInput = z.infer<typeof CreateGradeSchema>;
export type CreateGradeWithSchoolConfigInput = z.infer<typeof CreateGradeWithSchoolConfigSchema>;
export type UpdateGradeInput = z.infer<typeof UpdateGradeSchema>;
export type CreateBulkGradesInput = z.infer<typeof CreateBulkGradesSchema>;
export type PublishAssessmentInput = z.infer<typeof PublishAssessmentSchema>;
export type SearchGradesInput = z.infer<typeof SearchGradesSchema>;
export type CalculateGradeAverageInput = z.infer<typeof CalculateGradeAverageSchema>;
export type AdjustGradeInput = z.infer<typeof AdjustGradeSchema>;