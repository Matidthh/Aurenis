import { z } from "zod";
import {
  ChileanRutSchema,
  OptionalChileanRutSchema,
  StrictEmailSchema,
  OptionalStrictEmailSchema,
} from "./common.schema";
import { validateRutWithReason, formatRut } from "../utils/rut";

/**
 * ============================================================================
 * ESQUEMAS ZOD PARA REGISTRO Y GESTIÓN DE ESTUDIANTES — AURENIS PLATFORM
 * ============================================================================
 * Autoría y Arquitectura:
 * - Maicol R. (Backend, Contratos de API & Validación de Integridad Zod)
 * - Malcom Marcelo (Integración React & Validación en Tiempo Real por Campo)
 * - Lucas P. (Diseño UX de Errores, Accesibilidad & Micro-interacciones)
 * - Frank M. (Seguridad de Datos NNA, Auditoría RUT Módulo 11 & Circular 482)
 * ============================================================================
 */

export const TenantIdParamSchema = z
  .string()
  .min(1, "El ID de la institución (tenant) es obligatorio");

/**
 * Diagnóstico exhaustivo de RUN/RUT para mensajes de error granulares por campo
 */
export interface RutDiagnosticResult {
  isValid: boolean;
  error?: string;
  body?: string;
  dv?: string;
  expectedDv?: string;
  formatted?: string;
  errorField?: "empty" | "format" | "length" | "body" | "dv" | "algorithm";
}

export function diagnoseRut(rutStr: string, fieldRole: "student" | "guardian" = "student"): RutDiagnosticResult {
  const roleName = fieldRole === "student" ? "del estudiante" : "del apoderado";
  
  if (!rutStr || typeof rutStr !== "string") {
    return {
      isValid: false,
      error: `El RUN ${roleName} es obligatorio.`,
      errorField: "empty",
    };
  }

  const trimmed = rutStr.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: `El RUN ${roleName} no puede estar vacío.`,
      errorField: "empty",
    };
  }

  const clean = trimmed.replace(/\./g, "").replace(/\s/g, "").toUpperCase();

  let body = "";
  let dv = "";

  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length !== 2) {
      return {
        isValid: false,
        error: `Formato de RUN ${roleName} inválido: solo debe contener un guion separador (ej: 21.491.028-4).`,
        errorField: "format",
      };
    }
    body = parts[0];
    dv = parts[1];
  } else {
    if (clean.length < 2) {
      return {
        isValid: false,
        error: `El RUN ${roleName} ingresado es demasiado corto (debe incluir cuerpo y dígito verificador).`,
        errorField: "length",
      };
    }
    body = clean.slice(0, -1);
    dv = clean.slice(-1);
  }

  // Validar cuerpo numérico
  if (!/^\d+$/.test(body)) {
    return {
      isValid: false,
      error: `El cuerpo del RUN ${roleName} solo debe contener dígitos numéricos (sin letras ni caracteres especiales).`,
      body,
      dv,
      errorField: "body",
    };
  }

  if (body.length < 6) {
    return {
      isValid: false,
      error: `El cuerpo del RUN ${roleName} es demasiado corto: debe tener entre 6 y 9 dígitos numéricos (ingresados: ${body.length}).`,
      body,
      dv,
      errorField: "length",
    };
  }

  if (body.length > 9) {
    return {
      isValid: false,
      error: `El cuerpo del RUN ${roleName} es demasiado largo: el máximo permitido es 9 dígitos (ingresados: ${body.length}).`,
      body,
      dv,
      errorField: "length",
    };
  }

  // Validar dígito verificador
  if (!/^[0-9K]$/.test(dv)) {
    return {
      isValid: false,
      error: `El dígito verificador del RUN ${roleName} ("${dv}") no es válido. Debe ser un dígito del 0 al 9 o la letra K.`,
      body,
      dv,
      errorField: "dv",
    };
  }

  // Algoritmo oficial Módulo 11
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = sum % 11;
  const calculatedDvNum = 11 - remainder;
  const expectedDv = calculatedDvNum === 11 ? "0" : calculatedDvNum === 10 ? "K" : calculatedDvNum.toString();

  if (expectedDv !== dv) {
    return {
      isValid: false,
      error: `Dígito verificador incorrecto para el RUN ${roleName}: para el cuerpo ${body} el dígito calculado es "${expectedDv}", pero se ingresó "${dv}".`,
      body,
      dv,
      expectedDv,
      errorField: "algorithm",
    };
  }

  return {
    isValid: true,
    body,
    dv,
    expectedDv,
    formatted: formatRut(clean),
  };
}

/**
 * Esquema Zod específico para el RUN del Estudiante con mensajes detallados por campo
 */
export const StudentRutSchema = z
  .string({ required_error: "El RUN del estudiante es obligatorio" })
  .min(1, "El RUN del estudiante es obligatorio")
  .superRefine((val, ctx) => {
    const diag = diagnoseRut(val, "student");
    if (!diag.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: diag.error || "RUN del estudiante inválido (Módulo 11)",
      });
    }
  });

/**
 * Esquema Zod específico para el RUN del Apoderado Titular
 */
export const GuardianRutSchema = z
  .string({ required_error: "El RUN del apoderado es obligatorio" })
  .min(1, "El RUN del apoderado es obligatorio")
  .superRefine((val, ctx) => {
    const diag = diagnoseRut(val, "guardian");
    if (!diag.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: diag.error || "RUN del apoderado inválido (Módulo 11)",
      });
    }
  });

/**
 * 1. PASO 1: Identificación del Estudiante (RUT y Datos Personales)
 */
export const StudentIdentificationSchema = z.object({
  firstName: z
    .string({ required_error: "Los nombres son obligatorios" })
    .trim()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden exceder 100 caracteres"),
  lastName: z
    .string({ required_error: "Los apellidos son obligatorios" })
    .trim()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder 100 caracteres"),
  rut: StudentRutSchema,
  birthDate: z
    .string({ required_error: "La fecha de nacimiento es obligatoria" })
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((dateStr) => {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return false;
      const today = new Date();
      const age = today.getFullYear() - parsed.getFullYear();
      return age >= 2 && age <= 26;
    }, "La fecha ingresada no corresponde a una edad escolar válida (entre 2 y 26 años)."),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Debe seleccionar un género válido" }),
  }),
  nationality: z
    .string()
    .min(2, "La nacionalidad debe tener al menos 2 caracteres")
    .default("Chilena"),
});

export type StudentIdentificationInput = z.infer<typeof StudentIdentificationSchema>;

/**
 * 2. PASO 2: Antecedentes Académicos e Inclusión
 */
export const StudentAcademicSchema = z.object({
  course: z
    .string({ required_error: "El curso asignado es obligatorio" })
    .min(1, "Debe seleccionar el curso al cual se incorporará el estudiante"),
  educationLevel: z
    .enum(["Parvularia", "Básica", "Media"])
    .default("Media"),
  enrollmentYear: z.string().default("2026"),
  previousSchool: z
    .string()
    .max(150, "El nombre del colegio de procedencia no puede exceder 150 caracteres")
    .optional()
    .or(z.literal("")),
  isPie: z.boolean().default(false),
  hasScholarship: z.boolean().default(false),
});

export type StudentAcademicInput = z.infer<typeof StudentAcademicSchema>;

/**
 * 3. PASO 3: Datos de Contacto y Apoderado Titular
 */
export const StudentGuardianSchema = z.object({
  guardianName: z
    .string({ required_error: "El nombre del apoderado es obligatorio" })
    .trim()
    .min(3, "El nombre del apoderado debe tener al menos 3 caracteres")
    .max(120, "El nombre del apoderado no puede exceder 120 caracteres"),
  guardianRut: GuardianRutSchema,
  guardianPhone: z
    .string({ required_error: "El teléfono de contacto es obligatorio" })
    .trim()
    .min(8, "El teléfono de contacto debe tener al menos 8 dígitos")
    .regex(
      /^(\+?56\s?)?(\d{1}\s?)?\d{4}\s?\d{4}$|^\d{8,11}$/,
      "Formato de teléfono no válido. Ingrese un número chileno (ej: +56 9 8765 4321 o 987654321)"
    ),
  guardianEmail: StrictEmailSchema,
  guardianRelationship: z
    .enum(["Madre", "Padre", "Abuelo/a", "Tutor Legal", "Otro"], {
      errorMap: () => ({ message: "Seleccione un parentesco válido" }),
    })
    .default("Madre"),
  address: z
    .string()
    .max(250, "La dirección de residencia no puede exceder 250 caracteres")
    .optional()
    .or(z.literal("")),
});

export type StudentGuardianInput = z.infer<typeof StudentGuardianSchema>;

/**
 * 4. PASO 4: Ficha Médica y Salud Escolar
 * Validación Robusta con Zod y Mensajes Específicos por Campo
 * Cumplimiento Circular 482 y Ley N° 20.584 de Derechos y Deberes en Salud
 */
export const BloodGroupEnum = z.enum(
  ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-", "DESCONOCIDO"],
  {
    errorMap: () => ({
      message: "Debe seleccionar un grupo sanguíneo válido (ej. O+, A+, B+, AB+ o Por Confirmar con Examen).",
    }),
  }
);

export const HealthSystemEnum = z.enum(["FONASA", "ISAPRE", "Particular", "FFAA"], {
  errorMap: () => ({
    message: "Debe seleccionar el sistema previsional de salud (FONASA, ISAPRE, FFAA o Particular).",
  }),
});

export const StudentMedicalRecordSchema = z
  .object({
    bloodGroup: BloodGroupEnum,
    healthSystem: HealthSystemEnum,
    hasAllergies: z.boolean().default(false),
    allergyDetails: z
      .string()
      .max(500, "El detalle de alergias no puede exceder los 500 caracteres.")
      .optional()
      .or(z.literal("")),
    hasChronicCondition: z.boolean().default(false),
    chronicConditionDetails: z
      .string()
      .max(500, "El detalle de la condición médica no puede exceder los 500 caracteres.")
      .optional()
      .or(z.literal("")),
    emergencyPhone: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => {
        if (!val || val.trim() === "") return true;
        return /^(\+?56\s?)?(\d{1}\s?)?\d{4}\s?\d{4}$|^\d{8,11}$/.test(val.trim());
      }, "El teléfono de urgencia médica debe tener formato chileno válido (ej. +56 9 8765 4321 o 987654321, 8 a 11 dígitos)."),
    medicalNotes: z
      .string()
      .max(1000, "Las observaciones médicas no pueden superar el límite de 1000 caracteres.")
      .optional()
      .or(z.literal("")),
    isJunaebBeneficiary: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // 1. Validación de Alergias Condicional
    if (data.hasAllergies) {
      const details = (data.allergyDetails || "").trim();
      if (!details || details.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allergyDetails"],
          message:
            "Debe especificar los alérgenos diagnosticados (medicamentos, alimentos o picaduras) y su protocolo de reacción.",
        });
      } else if (details.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allergyDetails"],
          message:
            "El detalle de alergias debe tener al menos 3 caracteres (especifique alérgeno y cuidados requeridos).",
        });
      } else if (/^(ninguna|ninguno|no|nada|n\/a|na|-|\.)$/i.test(details)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["allergyDetails"],
          message:
            "Si el estudiante no presenta alergias conocidas, desmarque la casilla de verificación en lugar de escribir 'ninguna'.",
        });
      }
    }

    // 2. Validación de Condición Crónica Condicional
    if (data.hasChronicCondition) {
      const details = (data.chronicConditionDetails || "").trim();
      if (!details || details.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chronicConditionDetails"],
          message:
            "Debe detallar el diagnóstico médico (ej. asma, epilepsia, diabetes tipo 1) y los cuidados o medicación requeridos en el aula.",
        });
      } else if (details.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chronicConditionDetails"],
          message:
            "El detalle de la patología debe tener al menos 3 caracteres (diagnóstico y protocolo de acción en sala).",
        });
      } else if (/^(ninguna|ninguno|no|nada|n\/a|na|-|\.)$/i.test(details)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["chronicConditionDetails"],
          message:
            "Si el estudiante no presenta patologías crónicas, desmarque la casilla de verificación.",
        });
      }
    }
  });

export type StudentMedicalRecordInput = z.infer<typeof StudentMedicalRecordSchema>;

/**
 * 5. ESQUEMA INTEGRAL DE MATRÍCULA (4 PASOS UNIFICADOS)
 */
export const FullStudentRegistrationSchema = StudentIdentificationSchema.merge(
  StudentAcademicSchema
)
  .merge(StudentGuardianSchema)
  .merge(StudentMedicalRecordSchema);

export type FullStudentRegistrationInput = z.infer<
  typeof FullStudentRegistrationSchema
>;

/**
 * 6. ESQUEMA DE ENTRADA PARA LA API REST POST /api/schools/[schoolId]/students
 */
export const CreateStudentSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre es obligatorio").max(100),
  lastName: z.string().trim().min(2, "El apellido es obligatorio").max(100),
  email: StrictEmailSchema,
  rutOrNationalId: OptionalChileanRutSchema,
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  medicalNotes: z.string().max(1000, "Las notas médicas no pueden superar 1000 caracteres").optional(),
  courseId: z.string().min(1, "El curso es obligatorio"),
  enrollmentNumber: z.string().optional(),
  guardianName: z.string().optional(),
  guardianRut: OptionalChileanRutSchema,
  guardianPhone: z.string().optional(),
  guardianEmail: OptionalStrictEmailSchema,
  isPie: z.boolean().optional(),
  hasScholarship: z.boolean().optional(),
  bloodGroup: z.string().optional(),
  healthSystem: z.string().optional(),
  hasAllergies: z.boolean().optional(),
  allergyDetails: z.string().max(500).optional(),
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
  bloodGroup: z.string().optional(),
  healthSystem: z.string().optional(),
  hasAllergies: z.boolean().optional(),
  allergyDetails: z.string().max(500).optional(),
});

export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;

/**
 * ============================================================================
 * HELPER DE VALIDACIÓN EN TIEMPO REAL POR CAMPO Y POR PASO (ZOD ENGINE)
 * ============================================================================
 * Usado por componentes React (Malcom Marcelo) para validar al vuelo (onChange / onBlur)
 * y devolver el mensaje específico de error extraído directamente de Zod.
 */
export function validateFieldWithZod(
  step: 1 | 2 | 3 | 4,
  fieldName: string,
  formData: Record<string, any>
): { isValid: boolean; error?: string } {
  if (step === 1) {
    if (fieldName === "rut") {
      const diag = diagnoseRut(formData.rut, "student");
      return diag.isValid ? { isValid: true } : { isValid: false, error: diag.error };
    }
    const res = StudentIdentificationSchema.safeParse(formData);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path[0] === fieldName);
      if (issue) return { isValid: false, error: issue.message };
    }
    return { isValid: true };
  }

  if (step === 2) {
    const res = StudentAcademicSchema.safeParse(formData);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path[0] === fieldName);
      if (issue) return { isValid: false, error: issue.message };
    }
    return { isValid: true };
  }

  if (step === 3) {
    if (fieldName === "guardianRut") {
      const diag = diagnoseRut(formData.guardianRut, "guardian");
      return diag.isValid ? { isValid: true } : { isValid: false, error: diag.error };
    }
    const res = StudentGuardianSchema.safeParse(formData);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path[0] === fieldName);
      if (issue) return { isValid: false, error: issue.message };
    }
    return { isValid: true };
  }

  if (step === 4) {
    const res = StudentMedicalRecordSchema.safeParse(formData);
    if (!res.success) {
      const issue = res.error.issues.find((i) => i.path[0] === fieldName);
      if (issue) return { isValid: false, error: issue.message };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

/**
 * Validador exhaustivo de paso completo mediante Zod
 */
export function validateStepWithZod(
  step: 1 | 2 | 3 | 4,
  formData: Record<string, any>
): { isValid: boolean; errors: Record<string, string>; globalError?: string } {
  const errors: Record<string, string> = {};

  if (step === 1) {
    const res = StudentIdentificationSchema.safeParse(formData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      });
      return {
        isValid: false,
        errors,
        globalError: "Por favor corrija los campos requeridos en la identificación del estudiante.",
      };
    }
    return { isValid: true, errors: {} };
  }

  if (step === 2) {
    const res = StudentAcademicSchema.safeParse(formData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      });
      return {
        isValid: false,
        errors,
        globalError: "Revise los antecedentes académicos del estudiante.",
      };
    }
    return { isValid: true, errors: {} };
  }

  if (step === 3) {
    const res = StudentGuardianSchema.safeParse(formData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      });
      return {
        isValid: false,
        errors,
        globalError: "Revise los datos del apoderado, RUN y teléfono de contacto.",
      };
    }
    return { isValid: true, errors: {} };
  }

  if (step === 4) {
    const res = StudentMedicalRecordSchema.safeParse(formData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      });
      return {
        isValid: false,
        errors,
        globalError: "La ficha médica contiene observaciones o campos incompletos según Circular 482.",
      };
    }
    return { isValid: true, errors: {} };
  }

  return { isValid: true, errors: {} };
}
