"use client";

import React, { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      required,
      disabled,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Determinar descripción para lectores de pantalla
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn("w-full space-y-1.5 text-left", containerClassName)}>
        {/* Etiqueta / Label accesible con htmlFor */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input Wrapper con soporte para Iconos */}
        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={cn(
              "w-full text-sm rounded-xl transition-all duration-150 py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border min-h-[44px]",
              // Estado Normal / Borde
              !error &&
                "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-none",
              // Estado Error accesible
              error &&
                "border-red-500 text-red-900 dark:text-red-200 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:outline-none",
              // Estado Deshabilitado
              disabled &&
                "bg-slate-50 dark:bg-slate-850 opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800",
              // Espaciados según iconos
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-2.5 flex items-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}

          {error && !rightIcon && (
            <div
              className="absolute right-3.5 flex items-center text-red-500 pointer-events-none"
              aria-hidden="true"
            >
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Mensaje de Error (Accessible Live Region) */}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
            {error}
          </p>
        )}

        {/* Texto de Ayuda / Hint */}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      required,
      disabled,
      className,
      containerClassName,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className={cn("w-full space-y-1.5 text-left", containerClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "w-full text-sm rounded-xl transition-all duration-150 p-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border",
            !error &&
              "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20 focus-visible:outline-none",
            error &&
              "border-red-500 text-red-900 dark:text-red-200 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:outline-none",
            disabled &&
              "bg-slate-50 dark:bg-slate-850 opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800",
            className
          )}
          {...props}
        />

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
