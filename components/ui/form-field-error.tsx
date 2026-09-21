"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Componente para renderizar mensajes de validación Zod en línea bajo campos de formulario.
 * Responsable de autoría: Lucas P. (Componentes de UI de Alerta y Validación Zod)
 */
export interface FormFieldErrorProps {
  error?: string | string[] | null;
  className?: string;
}

export function FormFieldError({ error, className }: FormFieldErrorProps) {
  if (!error) return null;

  const messages = Array.isArray(error) ? error : [error];
  const firstMessage = messages.find((m) => Boolean(m && m.trim()));

  if (!firstMessage) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-1.5 mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium animate-in fade-in slide-in-from-top-0.5 duration-150",
        className
      )}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2.2]" />
      <span className="leading-tight">{firstMessage}</span>
    </div>
  );
}
