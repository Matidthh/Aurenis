"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ShieldAlert,
  ServerCrash,
  WifiOff,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lock,
} from "lucide-react";
import { ApiHttpError, parseApiError, formatFieldLabel } from "@/lib/api/api-error";
import { cn } from "@/lib/utils/cn";

/**
 * Componente de Alerta de Error de API con Mapeo Semántico y Visualización Zod
 * Responsable de autoría: Lucas P. (Componentes de UI de Alerta y Validación Zod)
 */
export interface ApiErrorAlertProps {
  error: ApiHttpError | Error | unknown | null;
  title?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  isRetrying?: boolean;
  showFieldDetails?: boolean;
  className?: string;
}

export function ApiErrorAlert({
  error,
  title,
  onDismiss,
  onRetry,
  isRetrying = false,
  showFieldDetails = true,
  className,
}: ApiErrorAlertProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!error) return null;

  const apiErr = parseApiError(error);
  const formattedFields = apiErr.getFormattedFieldErrors();
  const hasMultipleFields = formattedFields.length > 1;

  // Selección de estilo e icono según el código de estado HTTP
  const config = (() => {
    if (apiErr.status === 401) {
      return {
        icon: Lock,
        badgeText: "AUTENTICACIÓN · 401",
        badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800",
        containerClass: "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 text-purple-950 dark:text-purple-100",
        iconClass: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/60",
        defaultTitle: "Sesión no válida o expirada",
      };
    }

    if (apiErr.status === 403) {
      return {
        icon: ShieldAlert,
        badgeText: "ACCESO DENEGADO · 403",
        badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800",
        containerClass: "bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100",
        iconClass: "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/60",
        defaultTitle: "Permisos insuficientes en la institución",
      };
    }

    if (apiErr.status === 422 || (apiErr.status === 400 && apiErr.isValidationError)) {
      return {
        icon: AlertCircle,
        badgeText: apiErr.status === 422 ? "VALIDACIÓN ZOD · 422" : "DATOS INVÁLIDOS · 400",
        badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800",
        containerClass: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100",
        iconClass: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60",
        defaultTitle: "Errores de validación en el formulario",
      };
    }

    if (apiErr.isNetworkError) {
      return {
        icon: WifiOff,
        badgeText: "RED OFFLINE · SIN CONEXIÓN",
        badgeClass: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
        containerClass: "bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100",
        iconClass: "text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800",
        defaultTitle: "Sin conexión con el servidor",
      };
    }

    if (apiErr.status >= 500) {
      return {
        icon: ServerCrash,
        badgeText: `SERVIDOR · HTTP ${apiErr.status}`,
        badgeClass: "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-300 dark:border-red-800",
        containerClass: "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100",
        iconClass: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/60",
        defaultTitle: "Error interno del servidor",
      };
    }

    return {
      icon: AlertTriangle,
      badgeText: `ERROR ${apiErr.status}`,
      badgeClass: "bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-300 dark:border-red-800",
      containerClass: "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100",
      iconClass: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/60",
      defaultTitle: "No se pudo procesar la solicitud",
    };
  })();

  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "rounded-2xl border p-4 sm:p-5 transition-all duration-200 shadow-xs animate-in fade-in slide-in-from-top-1",
        config.containerClass,
        className
      )}
    >
      <div className="flex items-start gap-3.5">
        <div className={cn("p-2 rounded-xl shrink-0 flex items-center justify-center shadow-2xs", config.iconClass)}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                config.badgeClass
              )}
            >
              {config.badgeText}
            </span>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">
              {title || config.defaultTitle}
            </h4>
          </div>

          <p className="text-xs leading-relaxed opacity-90">
            {apiErr.userMessage}
          </p>

          {/* Errores globales de formulario (Zod formErrors) */}
          {apiErr.formErrors.length > 0 && (
            <ul className="mt-2.5 space-y-1">
              {apiErr.formErrors.map((msg, idx) => (
                <li key={`form-err-${idx}`} className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Lista detallada de campos con error Zod */}
          {showFieldDetails && formattedFields.length > 0 && (
            <div className="mt-3 pt-3 border-t border-current/15">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  Campos que requieren corrección ({formattedFields.length}):
                </span>

                {hasMultipleFields && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold underline underline-offset-2 opacity-90 hover:opacity-100 transition"
                  >
                    {isExpanded ? (
                      <>
                        <span>Contraer</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>Ver todos</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div
                className={cn(
                  "mt-2 space-y-1.5",
                  hasMultipleFields && !isExpanded && "max-h-[72px] overflow-hidden"
                )}
              >
                {formattedFields.map((item, idx) => (
                  <div
                    key={`field-err-${idx}`}
                    className="p-2 rounded-lg bg-white/60 dark:bg-black/20 border border-current/10 flex items-start gap-2 text-xs"
                  >
                    <span className="font-bold shrink-0 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[11px]">
                      {item.label}
                    </span>
                    <span className="opacity-90 leading-tight pt-0.5">{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acciones de reintento */}
          {onRetry && (
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-current/20 shadow-2xs hover:bg-opacity-90 transition disabled:opacity-50"
              >
                <RotateCcw className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")} />
                <span>{isRetrying ? "Reintentando..." : "Reintentar operación"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Botón cerrar si se proporciona onDismiss */}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar alerta"
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-current/10 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
