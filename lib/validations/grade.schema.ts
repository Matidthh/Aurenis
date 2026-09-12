import { z } from "zod";

/**
 * Esquema base para validar los datos de entrada al crear una calificación.
 * Permite valores numéricos generales de 0 a 100, los cuales son posteriormente
 * validados contra la escala específica (minGrade/maxGrade) del colegio en el servicio createGrade.
 */
export const CreateGradeSchema = z.object({
  assessmentId: z.string().min(1, "El ID de la evaluación es obligatorio"),
  enrollmentId: z.string().min(1, "El ID de la matrícula es obligatorio"),
  value: z
    .number({ required_error: "La calificación es obligatoria" })
    .min(1, "La calificación no puede ser menor a 1.0")
    .max(100, "La calificación no puede exceder 100"),
  comment: z.string().optional(),
  feedback: z.string().optional(),
});

export const UpdateGradeSchema = z.object({
  value: z
    .number({ required_error: "La calificación es obligatoria" })
    .min(0, "La calificación no puede ser menor a 0")
    .max(100, "La calificación no puede exceder 100")
    .optional(),
  comment: z.string().optional(),
  feedback: z.string().optional(),
});

export type UpdateGradeInput = z.infer<typeof UpdateGradeSchema>;
