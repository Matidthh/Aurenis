import { z } from "zod";
import { OptionalChileanRutSchema, StrictEmailSchema, OptionalStrictEmailSchema } from "./common.schema";

/**
 * Esquemas Zod centralizados para Validación y Prevención de Mass Assignment en Estudiantes
 * Autores: Malcom Marcelo (Arquitectura) y Carlos M. (Seguridad y Privacidad)
 */

export const TenantIdParamSchema = z.string().min(1, "El ID de la institución (tenant) es obligatorio");

export const CreateStudentSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio").max(100),
  lastName: z.string().min(1, "El apellido es obligatorio").max(100),
  email: StrictEmailSchema,
  rutOrNationalId: OptionalChileanRutSchema,
  phone: z.string().optional(),
  birthDate: z.string().optional(), // o Date
  medicalNotes: z.string().max(1000).optional(),
  courseId: z.string().min(1, "El curso es obligatorio"),
  enrollmentNumber: z.string().optional(),
});

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;

export const UpdateStudentSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: OptionalStrictEmailSchema,
  rutOrNationalId: OptionalChileanRutSchema,
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  medicalNotes: z.string().max(1000).optional(),
  courseId: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "TRANSFERRED"]).optional(),
});

export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
