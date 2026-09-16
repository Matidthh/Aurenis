import { z } from "zod";
import { validateRutWithReason, validateEmailWithReason } from "../utils/rut";

/**
 * Esquema Zod para validar RUN/RUT chileno con Módulo 11
 */
export const ChileanRutSchema = z
  .string({ required_error: "El RUN es obligatorio" })
  .min(1, "El RUN es obligatorio")
  .superRefine((val, ctx) => {
    const result = validateRutWithReason(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "RUN chileno inválido (Módulo 11)",
      });
    }
  });

/**
 * Esquema Zod para RUN/RUT opcional pero validado si se envía
 */
export const OptionalChileanRutSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .superRefine((val, ctx) => {
    if (!val || val.trim() === "") return;
    const result = validateRutWithReason(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "RUN chileno inválido (Módulo 11)",
      });
    }
  });

/**
 * Esquema Zod para validar correos electrónicos de forma estricta
 */
export const StrictEmailSchema = z
  .string({ required_error: "El correo electrónico es obligatorio" })
  .min(1, "El correo electrónico es obligatorio")
  .superRefine((val, ctx) => {
    const result = validateEmailWithReason(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "Formato de correo electrónico no válido",
      });
    }
  });

/**
 * Esquema Zod para correo electrónico opcional
 */
export const OptionalStrictEmailSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .superRefine((val, ctx) => {
    if (!val || val.trim() === "") return;
    const result = validateEmailWithReason(val);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "Formato de correo electrónico no válido",
      });
    }
  });

/**
 * Generador de esquema para rangos numéricos con mensajes en español
 */
export function createNumberRangeSchema(
  min: number,
  max: number,
  label = "El valor"
) {
  return z
    .number({
      required_error: `${label} es obligatorio`,
      invalid_type_error: `${label} debe ser un número`,
    })
    .min(min, `${label} no puede ser menor a ${min}`)
    .max(max, `${label} no puede ser superior a ${max}`);
}

/**
 * Escala chilena estándar de calificaciones (1.0 a 7.0)
 */
export const ChileanGradeValueSchema = createNumberRangeSchema(1.0, 7.0, "La calificación");

/**
 * Ponderación porcentual (0% a 100%)
 */
export const PercentageValueSchema = createNumberRangeSchema(0, 100, "El porcentaje");
