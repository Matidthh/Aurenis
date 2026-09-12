import { z } from "zod";
import { AcademicTermType } from "@prisma/client";

/**
 * Esquema para un período académico individual
 */
export const AcademicPeriodInputSchema = z.object({
  id: z.string().optional(), // Si viene, se actualiza; si no, se crea
  name: z.string().min(2, "El nombre del período debe tener al menos 2 caracteres"),
  year: z.number().int().min(2000, "Año inválido").max(2100, "Año inválido"),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)),
  isCurrent: z.boolean().default(false),
  isClosed: z.boolean().default(false),
}).refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "La fecha de término del período debe ser posterior o igual a la fecha de inicio",
    path: ["endDate"],
  }
);

export type AcademicPeriodInput = z.infer<typeof AcademicPeriodInputSchema>;

/**
 * Esquema para actualizar la configuración institucional del colegio
 */
export const UpdateSchoolConfigSchema = z.object({
  schoolId: z.string().optional(), // Opcional si se infiere del token/sesión

  // 1. Datos Institucionales del Colegio
  institution: z.object({
    name: z.string().min(3, "El nombre de la institución debe tener al menos 3 caracteres").optional(),
    institutionalCode: z.string().nullable().optional(),
    logoUrl: z.string().url("URL de logotipo inválida").or(z.literal("")).nullable().optional(),
    address: z.string().nullable().optional(),
    city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres").optional(),
    country: z.string().min(2, "El país debe tener al menos 2 caracteres").optional(),
    timezone: z.string().min(2, "La zona horaria es obligatoria").optional(),
  }).optional(),

  // 2. Parámetros de Calificación y Régimen Académico
  gradingAndSettings: z.object({
    termType: z.nativeEnum(AcademicTermType).optional(),
    minGrade: z.number().min(0, "La nota mínima no puede ser menor a 0").max(100).optional(),
    maxGrade: z.number().min(1, "La nota máxima debe ser al menos 1").max(100).optional(),
    minPassingGrade: z.number().min(0).max(100).optional(),
    gradeScalePrecision: z.number().int().min(0, "Mínimo 0 decimales").max(2, "Máximo 2 decimales").optional(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "El color primario debe ser un código hexadecimal válido (ej: #0C8EE9)").optional(),
    requireAttendanceNote: z.boolean().optional(),
    customConfig: z.record(z.any()).nullable().optional(),
  }).optional().refine(
    (data) => {
      if (!data) return true;
      const min = data.minGrade ?? 1.0;
      const max = data.maxGrade ?? 7.0;
      const pass = data.minPassingGrade ?? 4.0;
      
      if (min >= max) return false;
      if (pass < min || pass > max) return false;
      return true;
    },
    {
      message: "La escala de notas es inconsistente: minGrade < minPassingGrade <= maxGrade",
      path: ["minPassingGrade"],
    }
  ),

  // 3. Períodos Académicos
  academicPeriods: z.array(AcademicPeriodInputSchema).optional(),
});

export type UpdateSchoolConfigInput = z.infer<typeof UpdateSchoolConfigSchema>;

/**
 * Esquema de consulta de configuración escolar
 */
export const GetSchoolConfigQuerySchema = z.object({
  schoolId: z.string().optional(),
  schoolSlug: z.string().optional(),
});

export type GetSchoolConfigQuery = z.infer<typeof GetSchoolConfigQuerySchema>;
