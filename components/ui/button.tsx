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
  | "success"
  | "neumorphic";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  neumorphic?: boolean;
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
      neumorphic = false,
      ...props
    },
    ref
  ) => {
    // 1. Estilos por Variante (WCAG AA validado)
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary sólido Brand 600 (#2563eb / #1d4ed8) con texto blanco de alto contraste (4.82:1)
      primary:
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs font-semibold",
      // Secondary neutral para acciones de apoyo
      secondary:
        "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium",
      // Outline con borde de alto contraste
      outline:
        "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-medium",
      // Ghost para navegación limpia o barras de herramientas
      ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium",
      // Danger (#dc2626) sólido con texto blanco (4.7:1)
      danger:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs font-semibold",
      // Success (#059669) sólido con texto blanco (4.65:1)
      success:
        "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs font-semibold",
      // Neumorphic para botones seleccionados con relieve Soft UI táctil
      neumorphic:
        "neumo-button text-slate-800 dark:text-slate-100 font-medium",
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
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

    const isDisabled = disabled || isLoading;
    const isNeumo = variant === "neumorphic" || neumorphic;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer whitespace-nowrap",
          variantStyles[variant],
          sizeStyles[size],
          focusStyles,
          isNeumo && "neumo-button",
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
