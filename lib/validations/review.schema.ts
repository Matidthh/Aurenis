import { z } from "zod";

/**
 * Esquema de validación para el ingreso de Reseñas (wp_reviews)
 * Cumplimiento con OWASP ASVS y sanitización perimetral
 * Autor: Maicol R. (Backend & Zod)
 */
export const CreateReviewSchema = z.object({
  authorName: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  authorEmail: z
    .string()
    .trim()
    .email("El correo electrónico no es válido")
    .optional()
    .or(z.literal("")),
  authorRole: z
    .string()
    .trim()
    .min(2, "El rol debe contener al menos 2 caracteres")
    .max(80, "El rol no puede exceder 80 caracteres")
    .default("Comunidad Escolar"),
  institutionName: z
    .string()
    .trim()
    .max(120, "El nombre de la institución no puede exceder 120 caracteres")
    .optional()
    .or(z.literal("")),
  rating: z
    .coerce
    .number({ invalid_type_error: "La calificación debe ser un número entero" })
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1 estrella")
    .max(5, "La calificación máxima es 5 estrellas"),
  title: z
    .string({ required_error: "El título de la reseña es obligatorio" })
    .trim()
    .min(3, "El título debe contener al menos 3 caracteres")
    .max(150, "El título no puede exceder 150 caracteres"),
  comment: z
    .string({ required_error: "El comentario de la reseña es obligatorio" })
    .trim()
    .min(5, "El comentario debe contener al menos 5 caracteres")
    .max(1500, "El comentario no puede exceder 1500 caracteres"),
  originSite: z
    .string()
    .trim()
    .max(80)
    .optional()
    .default("aurenis-platform"),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
