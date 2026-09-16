"use client";

import React from "react";
import {
  WifiOff,
  ServerCrash,
  Wrench,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ConnectionErrorType } from "@/lib/api/network-status";

export interface NetworkErrorStateProps {
  type?: ConnectionErrorType;
  statusCode?: number;
  title?: string;
  description?: string;
  onRetry?: () => Promise<unknown> | void;
  isRetrying?: boolean;
  className?: string;
  compact?: boolean;
}

export function NetworkErrorState({
  type = "generic_network",
  statusCode,
  title,
  description,
  onRetry,
  isRetrying = false,
  className = "",
  compact = false,
}: NetworkErrorStateProps) {
  // Inferir tipo según status code si se proporciona
  let resolvedType = type;
  if (statusCode === 500) resolvedType = "server_500";
  if (statusCode === 503) resolvedType = "service_503";

  const config = {
    offline: {
      icon: <WifiOff className="w-8 h-8 text-amber-500 animate-pulse" />,
      bgIcon: "bg-amber-100 dark:bg-amber-950/50",
      badgeText: "SIN CONEXIÓN",
      badgeVariant: "warning" as const,
      defaultTitle: "Sin conexión con el servidor",
      defaultDesc: "No se pudo cargar la información porque el dispositivo no cuenta con acceso a internet. Verifique su red.",
    },
    server_500: {
      icon: <ServerCrash className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
      bgIcon: "bg-rose-100 dark:bg-rose-950/50",
      badgeText: "HTTP 500 · ERROR INTERNO",
      badgeVariant: "danger" as const,
      defaultTitle: "Error interno del servidor",
      defaultDesc: "Ocurrió una falla transitoria al procesar la solicitud en el servidor. El equipo técnico ha sido notificado.",
    },
    service_503: {
      icon: <Wrench className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      bgIcon: "bg-amber-100 dark:bg-amber-950/50",
      badgeText: "HTTP 503 · MANTENIMIENTO",
      badgeVariant: "warning" as const,
      defaultTitle: "Servicio no disponible temporalmente",
      defaultDesc: "El servidor se encuentra en tareas de mantenimiento o alta demanda. Por favor, reintente en unos instantes.",
    },
    network_timeout: {
      icon: <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      bgIcon: "bg-amber-100 dark:bg-amber-950/50",
      badgeText: "TIEMPO AGOTADO",
      badgeVariant: "warning" as const,
      defaultTitle: "Tiempo de espera superado",
      defaultDesc: "El servidor tardó más de lo esperado en responder. Intente recargar los datos.",
    },
    generic_network: {
      icon: <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />,
      bgIcon: "bg-rose-100 dark:bg-rose-950/50",
      badgeText: "FALLO DE RED",
      badgeVariant: "danger" as const,
      defaultTitle: "No fue posible cargar los datos",
      defaultDesc: "Se produjo una interrupción en la comunicación con el servidor. Intente nuevamente.",
    },
  }[resolvedType];

  if (compact) {
    return (
      <div
        role="alert"
        className={`p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 flex items-center justify-between gap-3 text-xs ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0 truncate">
            <span className="font-bold text-slate-900 dark:text-slate-100 block truncate">
              {title || config.defaultTitle}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
              {description || config.defaultDesc}
            </span>
          </div>
        </div>

        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40"
          >
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`w-full p-8 sm:p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${config.bgIcon}`}>
        {config.icon}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Badge variant={config.badgeVariant} size="sm">
            {config.badgeText}
          </Badge>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {title || config.defaultTitle}
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description || config.defaultDesc}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            isLoading={isRetrying}
            loadingText="Reintentando..."
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="px-6"
          >
            Reintentar operación
          </Button>
        </div>
      )}
    </div>
  );
}
