import { z } from "zod";

export const CreateCourseSchema = z.object({
  name: z.string().min(1, "El nombre del curso es requerido"),
  educationLevelId: z.string().min(1, "El nivel educativo es requerido"),
  gradeNumber: z.number().int().min(1),
  letter: z.string().max(2).optional(),
  year: z.number().int().min(2000).max(2100).default(new Date().getFullYear()),
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

export const UpdateCourseSchema = z.object({
  name: z.string().min(1).optional(),
  educationLevelId: z.string().min(1).optional(),
  gradeNumber: z.number().int().min(1).optional(),
  letter: z.string().max(2).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});

export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
