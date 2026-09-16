import { z } from "zod";

/**
 * Esquema base para validar los datos de entrada al crear una calificación.
 * Permite valores numéricos generales de 1.0 a 7.0 (o de 0 a 100), los cuales son posteriormente
 * validados contra la escala específica (minGrade/maxGrade) del colegio en el servicio createGrade.
 */
export const CreateGradeSchema = z.object({
  assessmentId: z.string().min(1, "El ID de la evaluación es obligatorio"),
  enrollmentId: z.string().min(1, "El ID de la matrícula es obligatorio"),
  value: z
    .number({ required_error: "La calificación es obligatoria", invalid_type_error: "La calificación debe ser un número" })
    .min(1.0, "La calificación no puede ser menor a 1.0")
    .max(100, "La calificación no puede exceder 100"),
  comment: z.string().optional(),
  feedback: z.string().optional(),
});

export const UpdateGradeSchema = z.object({
  value: z
    .number({ required_error: "La calificación es obligatoria", invalid_type_error: "La calificación debe ser un número" })
    .min(0, "La calificación no puede ser menor a 0")
    .max(100, "La calificación no puede exceder 100")
    .optional(),
  comment: z.string().optional(),
  feedback: z.string().optional(),
});

export type UpdateGradeInput = z.infer<typeof UpdateGradeSchema>;

export const CreateAssessmentSchema = z.object({
  subjectId: z.string().min(1, "El ID de la asignatura es obligatorio"),
  academicPeriodId: z.string().min(1, "El ID del periodo académico es obligatorio"),
  title: z.string().min(2, "El título de la evaluación debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  date: z.string().or(z.date()).optional(),
  weightPercentage: z
    .number({ invalid_type_error: "La ponderación debe ser un número" })
    .min(0, "La ponderación mínima es 0%")
    .max(100, "La ponderación no puede superar el 100%")
    .optional()
    .default(100),
  isPublished: z.boolean().optional().default(true),
});

export type CreateAssessmentInput = z.infer<typeof CreateAssessmentSchema>;

export const UpdateAssessmentSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres").optional(),
  description: z.string().optional(),
  date: z.string().or(z.date()).optional(),
  weightPercentage: z
    .number({ invalid_type_error: "La ponderación debe ser un número" })
    .min(0, "La ponderación mínima es 0%")
    .max(100, "La ponderación no puede superar el 100%")
    .optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateAssessmentInput = z.infer<typeof UpdateAssessmentSchema>;

export const BulkGradeItemSchema = z.object({
  assessmentId: z.string().min(1, "El ID de la evaluación es obligatorio"),
  enrollmentId: z.string().min(1, "El ID de la matrícula es obligatorio"),
  value: z
    .number({ required_error: "La nota es obligatoria", invalid_type_error: "La nota debe ser un número" })
    .min(0, "La nota no puede ser menor a 0")
    .max(100, "La nota no puede superar 100"),
  feedback: z.string().optional(),
});

export const BulkSaveGradesSchema = z.object({
  grades: z.array(BulkGradeItemSchema).min(1, "Debe enviar al menos una calificación para guardar"),
});

export type BulkSaveGradesInput = z.infer<typeof BulkSaveGradesSchema>;
