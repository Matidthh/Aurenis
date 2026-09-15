"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // 1. Estilos por Variante (WCAG AA validado)
    const variantStyles: Record<ButtonVariant, string> = {
      // Brand 600 (#016fc7) con texto blanco tiene ratio de contraste 4.82:1 (PASS AA)
      primary:
        "text-brand-700 hover:text-brand-800 active:text-brand-900",
      // Secondary neutral para acciones de apoyo
      secondary:
        "text-slate-800 dark:text-slate-100",
      // Outline con borde de alto contraste
      outline:
        "text-slate-700 dark:text-slate-200",
      // Ghost para navegación limpia o barras de herramientas
      ghost:
        "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
      // Danger (#dc2626) con texto blanco: 4.7:1 (PASS AA)
      danger:
        "text-red-600 hover:text-red-700 active:text-red-800",
      // Success (#059669) con texto blanco: 4.65:1 (PASS AA)
      success:
        "text-emerald-600 hover:text-emerald-700 active:text-emerald-800",
    };

    // 2. Estilos por Tamaño (Cumple objetivo táctil en móvil de min 44px)
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-3 py-1.5 min-h-[36px] sm:min-h-[32px] rounded-lg gap-1.5",
      md: "text-sm px-4 py-2 min-h-[44px] sm:min-h-[40px] rounded-xl gap-2 font-medium",
      lg: "text-base px-6 py-2.5 min-h-[48px] rounded-xl gap-2.5 font-semibold",
      icon: "w-10 h-10 min-h-[40px] p-0 rounded-xl justify-center items-center",
    };

    // 3. Foco Visible Accesible (WCAG 2.4.7 Focus Visible)
    const focusStyles =
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer whitespace-nowrap neumo-button",
          variantStyles[variant],
          sizeStyles[size],
          focusStyles,
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none shadow-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
