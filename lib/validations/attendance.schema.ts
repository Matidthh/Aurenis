import { z } from "zod";

// Sanitización e inspección estricta de identificadores (CUID / UUID / Slugs)
export const StrictIdSchema = z
  .string()
  .trim()
  .min(1, "El identificador no puede estar vacío")
  .max(128, "El identificador excede la longitud máxima permitida")
  .regex(/^[a-zA-Z0-9_-]+$/, "El identificador contiene caracteres no permitidos");

export const StrictSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "El slug de la institución es requerido")
  .max(100, "El slug excede la longitud permitida")
  .regex(/^[a-z0-9-]+$/, "El slug de la institución contiene un formato inválido");

export const StrictDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener un formato YYYY-MM-DD válido");

// Token QR estricto: Formato JWT compacto de 3 partes separadas por punto (Header.Payload.Signature)
export const StrictQRTokenSchema = z
  .string()
  .trim()
  .min(20, "El token QR es demasiado corto")
  .max(2048, "El token QR excede la longitud máxima permitida")
  .regex(
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
    "El token del código QR debe tener un formato JWT firmado válido"
  );

export const AttendanceStatusEnum = z.enum([
  "PRESENT",
  "LATE",
  "ABSENT_JUSTIFIED",
  "ABSENT_UNJUSTIFIED",
]);

export const StartAttendanceSessionSchema = z.object({
  schoolSlug: StrictSlugSchema,
  courseId: StrictIdSchema,
  subjectId: StrictIdSchema.optional().nullable(),
  date: StrictDateSchema.optional(),
  ttlSeconds: z
    .number()
    .int("Los segundos de vigencia deben ser un entero")
    .min(5, "Mínimo 5 segundos de vigencia")
    .max(300, "Máximo 300 segundos de vigencia")
    .optional()
    .default(30),
});

export const CreateAttendanceSessionBodySchema = z.object({
  courseId: StrictIdSchema,
  subjectId: StrictIdSchema.optional().nullable(),
  date: StrictDateSchema.optional(),
  ttlSeconds: z
    .number()
    .int("Los segundos de vigencia deben ser un entero")
    .min(5, "Mínimo 5 segundos de vigencia")
    .max(300, "Máximo 300 segundos de vigencia")
    .optional()
    .default(30),
});

export const RecordQRScanSchema = z.object({
  schoolSlug: StrictSlugSchema,
  qrToken: StrictQRTokenSchema,
});

export const ManualAttendanceRecordSchema = z.object({
  schoolSlug: StrictSlugSchema,
  courseId: StrictIdSchema,
  studentProfileId: StrictIdSchema,
  date: StrictDateSchema,
  status: AttendanceStatusEnum,
  justification: z
    .string()
    .trim()
    .max(500, "La justificación no puede superar los 500 caracteres")
    .transform((s) => s.replace(/<[^>]*>/g, ""))
    .optional()
    .nullable(),
});

export const BulkManualAttendanceSchema = z.object({
  schoolSlug: StrictSlugSchema,
  courseId: StrictIdSchema,
  date: StrictDateSchema,
  records: z
    .array(
      z.object({
        studentProfileId: StrictIdSchema,
        status: AttendanceStatusEnum,
        justification: z
          .string()
          .trim()
          .max(500, "La justificación no puede superar los 500 caracteres")
          .transform((s) => s.replace(/<[^>]*>/g, ""))
          .optional()
          .nullable(),
        method: z.enum(["QR", "MANUAL"]).optional().default("MANUAL"),
      })
    )
    .min(1, "Debe incluir al menos un registro de asistencia"),
});

export const CloseAttendanceSessionSchema = z.object({
  schoolSlug: StrictSlugSchema,
  sessionId: StrictIdSchema,
});
