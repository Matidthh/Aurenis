import { z } from "zod";
import { AcademicTermType } from "@prisma/client";

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
  adminEmail: z.string().email("Correo del administrador inválido"),
  adminFirstName: z.string().min(2, "Nombre del administrador obligatorio"),
  adminLastName: z.string().min(2, "Apellido del administrador obligatorio"),
  adminPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  adminRut: z.string().optional(),
});

export type CreateSchoolInput = z.infer<typeof CreateSchoolSchema>;

export const UpdateSchoolSettingsSchema = z.object({
  termType: z.nativeEnum(AcademicTermType).optional(),
  minPassingGrade: z.number().min(1).max(10).optional(),
  minGrade: z.number().min(0).max(10).optional(),
  maxGrade: z.number().min(1).max(100).optional(),
  gradeScalePrecision: z.number().min(0).max(2).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hexadecimal inválido").optional(),
  requireAttendanceNote: z.boolean().optional(),
});

export type UpdateSchoolSettingsInput = z.infer<typeof UpdateSchoolSettingsSchema>;
