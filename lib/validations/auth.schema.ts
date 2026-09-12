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

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "El token de refresco es obligatorio").optional(),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una mayúscula")
      .regex(/[a-z]/, "La nueva contraseña debe contener al menos una minúscula")
      .regex(/[0-9]/, "La nueva contraseña debe contener al menos un número"),
    confirmPassword: z.string().min(1, "La confirmación de contraseña es obligatoria"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "La nueva contraseña debe ser diferente a la contraseña actual",
    path: ["newPassword"],
  });

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
