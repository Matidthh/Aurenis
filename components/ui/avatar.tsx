import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  email?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Obtiene hasta 2 iniciales a partir del nombre o email del usuario.
 * Maneja nombres compuestos, nombres únicos, apellidos faltantes y fallbacks seguros.
 */
export function getInitials(name?: string, email?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  if (email && email.trim().length > 0) {
    return email.trim()[0].toUpperCase();
  }

  return "U";
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

/**
 * Avatar circular accesible con iniciales de usuario.
 * Respeta la paleta institucional Aurenis y no depende de librerías ni imágenes externas.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, email, size = "md", className, ...props }, ref) => {
    const initials = getInitials(name, email);

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
          "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
          "border border-brand-200 dark:border-brand-900 shadow-xs",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {initials}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
