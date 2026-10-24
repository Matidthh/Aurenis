import { z } from "zod";
import { AcademicTermType } from "@prisma/client";
import { StrictEmailSchema, OptionalStrictEmailSchema, OptionalChileanRutSchema } from "./common.schema";

export const CreateSchoolSchema = z.object({
  name: z.string().min(3, "El nombre de la institución debe tener al menos 3 caracteres"),
  slug: z
    .string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  institutionalCode: z.string().optional(),
  city: z.string().min(2, "La ciudad es obligatoria"),
  country: z.string().default("Chile"),
  timezone: z.string().default("America/Santiago"),
  termType: z.nativeEnum(AcademicTermType).default(AcademicTermType.SEMESTER),
  
  // Datos del Administrador inicial del colegio
  adminEmail: StrictEmailSchema,
  adminFirstName: z.string().min(2, "Nombre del administrador obligatorio"),
  adminLastName: z.string().min(2, "Apellido del administrador obligatorio"),
  adminPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  adminRut: OptionalChileanRutSchema,
});

export type CreateSchoolInput = z.infer<typeof CreateSchoolSchema>;

export const UpdateSchoolSettingsSchema = z
  .object({
    // Datos Institucionales
    name: z.string().min(2, "El nombre de la institución debe tener al menos 2 caracteres").optional(),
    institutionalCode: z.string().optional(),
    address: z.string().optional(),
    city: z.string().min(2, "La ciudad es requerida").optional(),
    country: z.string().optional(),
    timezone: z.string().optional(),
    contactEmail: OptionalStrictEmailSchema,
    contactPhone: z.string().optional(),
    motto: z.string().optional(),

    // Régimen y Calificaciones
    termType: z.nativeEnum(AcademicTermType).optional(),
    minPassingGrade: z.number().min(0, "La nota de aprobación no puede ser menor a 0").max(100, "La nota de aprobación no puede exceder 100").optional(),
    minGrade: z.number().min(0, "La nota mínima no puede ser menor a 0").max(100, "La nota mínima no puede exceder 100").optional(),
    maxGrade: z.number().min(1, "La nota máxima debe ser al menos 1").max(100, "La nota máxima no puede exceder 100").optional(),
    gradeScalePrecision: z.number().min(0, "Mínimo 0 decimales").max(2, "Máximo 2 decimales").optional(),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hexadecimal inválido").optional(),
    requireAttendanceNote: z.boolean().optional(),
    minAttendancePercentage: z.number().min(0, "Mínimo 0% de asistencia").max(100, "Máximo 100% de asistencia").optional(),
    defaultAssessmentWeight: z.number().min(0, "Mínimo 0% de ponderación").max(100, "Máximo 100% de ponderación").optional(),
    gradeColorThresholds: z
      .object({
        redMax: z.number().min(0, "El umbral rojo debe ser mayor o igual a 0").max(100, "El umbral rojo no puede exceder 100"),
        yellowMax: z.number().min(0, "El umbral ámbar debe ser mayor o igual a 0").max(100, "El umbral ámbar no puede exceder 100"),
        greenMax: z.number().min(0, "El umbral verde debe ser mayor o igual a 0").max(100, "El umbral verde no puede exceder 100"),
        blueMax: z.number().min(0, "El umbral azul debe ser mayor o igual a 0").max(100, "El umbral azul no puede exceder 100").default(7.0),
        redLabel: z.string().optional().default("Insuficiente"),
        yellowLabel: z.string().optional().default("Elemental"),
        greenLabel: z.string().optional().default("Adecuado"),
        blueLabel: z.string().optional().default("Destacado"),
      })
      .refine((data) => data.redMax < data.yellowMax && data.yellowMax < data.greenMax && data.greenMax <= data.blueMax, {
        message: "Los umbrales del semáforo deben ser estrictamente ascendentes: Rojo < Ámbar < Verde <= Azul",
        path: ["redMax"],
      })
      .optional(),
  })
  .refine(
    (data) => {
      const { minGrade, maxGrade, minPassingGrade } = data;
      if (minGrade !== undefined && maxGrade !== undefined && minGrade >= maxGrade) {
        return false;
      }
      if (minPassingGrade !== undefined && minGrade !== undefined && minPassingGrade < minGrade) {
        return false;
      }
      if (minPassingGrade !== undefined && maxGrade !== undefined && minPassingGrade > maxGrade) {
        return false;
      }
      return true;
    },
    {
      message: "La escala de notas es inconsistente: debe cumplir minGrade < maxGrade y minGrade <= minPassingGrade <= maxGrade",
      path: ["minPassingGrade"],
    }
  );

export type UpdateSchoolSettingsInput = z.infer<typeof UpdateSchoolSettingsSchema>;

export const GradeColorThresholdsSchema = z
  .object({
    redMax: z.number().min(0, "El umbral rojo debe ser mayor o igual a 0").max(100, "El umbral rojo no puede exceder 100"),
    yellowMax: z.number().min(0, "El umbral ámbar debe ser mayor o igual a 0").max(100, "El umbral ámbar no puede exceder 100"),
    greenMax: z.number().min(0, "El umbral verde debe ser mayor o igual a 0").max(100, "El umbral verde no puede exceder 100"),
    blueMax: z.number().min(0, "El umbral azul debe ser mayor o igual a 0").max(100, "El umbral azul no puede exceder 100").default(7.0),
    redLabel: z.string().optional().default("Insuficiente"),
    yellowLabel: z.string().optional().default("Elemental"),
    greenLabel: z.string().optional().default("Adecuado"),
    blueLabel: z.string().optional().default("Destacado"),
  })
  .refine((data) => data.redMax < data.yellowMax && data.yellowMax < data.greenMax && data.greenMax <= data.blueMax, {
    message: "Los umbrales del semáforo deben ser estrictamente ascendentes: Rojo < Ámbar < Verde <= Azul",
    path: ["redMax"],
  });

export type GradeColorThresholds = z.infer<typeof GradeColorThresholdsSchema>;

// Validaciones de Periodos Académicos
export const CreateAcademicPeriodSchema = z
  .object({
    name: z.string().min(2, "El nombre del periodo debe tener al menos 2 caracteres"),
    year: z.number().int().min(2000, "Año mínimo permitido: 2000").max(2100, "Año máximo permitido: 2100"),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    endDate: z.string().min(1, "La fecha de término es requerida"),
    weightPercentage: z.number().min(0, "El porcentaje no puede ser menor a 0").max(100, "El porcentaje no puede exceder 100").default(50),
    isCurrent: z.boolean().default(false),
    isClosed: z.boolean().default(false),
  })
  .refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "La fecha de término debe ser posterior o igual a la fecha de inicio",
      path: ["endDate"],
    }
  );

export type CreateAcademicPeriodInput = z.infer<typeof CreateAcademicPeriodSchema>;

export const UpdateAcademicPeriodSchema = z
  .object({
    name: z.string().min(2, "El nombre del periodo debe tener al menos 2 caracteres").optional(),
    year: z.number().int().min(2000, "Año mínimo: 2000").max(2100, "Año máximo: 2100").optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    weightPercentage: z.number().min(0, "El porcentaje no puede ser menor a 0").max(100, "El porcentaje no puede exceder 100").optional(),
    isCurrent: z.boolean().optional(),
    isClosed: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "La fecha de término debe ser posterior o igual a la fecha de inicio",
      path: ["endDate"],
    }
  );

export type UpdateAcademicPeriodInput = z.infer<typeof UpdateAcademicPeriodSchema>;
