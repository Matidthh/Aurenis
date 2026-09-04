import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SelectSchoolSchema = z.object({
  schoolId: z.string().min(1, "El ID de la institución es obligatorio"),
});

export type SelectSchoolInput = z.infer<typeof SelectSchoolSchema>;
