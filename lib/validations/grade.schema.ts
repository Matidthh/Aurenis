import { z } from "zod";

export const CreateGradeSchema = z.object({
  assessmentId: z.string().min(1, "El ID de la evaluación es requerido"),
  enrollmentId: z.string().min(1, "El ID de matrícula es requerido"),
  value: z.number().min(1.0, "La nota no puede ser menor a 1.0").max(100.0, "La nota no puede ser mayor a 100.0"),
  feedback: z.string().optional(),
});

export type CreateGradeInput = z.infer<typeof CreateGradeSchema>;

export const UpdateGradeSchema = z.object({
  value: z.number().min(1.0).max(100.0).optional(),
  feedback: z.string().optional(),
});

export type UpdateGradeInput = z.infer<typeof UpdateGradeSchema>;
