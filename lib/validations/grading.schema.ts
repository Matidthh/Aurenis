import { z } from "zod";

export const GradingScaleSchema = z.object({
  id: z.string().optional(),
  schoolId: z.string(),
  name: z.string().min(1, "El nombre de la escala es obligatorio"),
  minPassingGrade: z.coerce.number().min(1).max(7),
  minGrade: z.coerce.number().min(1).max(7),
  maxGrade: z.coerce.number().min(1).max(7),
  gradeScalePrecision: z.coerce.number().int().min(0).max(2).default(1),
});

export type CreateGradingScaleInput = z.infer<typeof GradingScaleSchema>;
export type UpdateGradingScaleInput = Partial<CreateGradingScaleInput>;
