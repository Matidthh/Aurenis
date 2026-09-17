"use client";

import React, { useState } from "react";
import {
  WifiOff,
  ServerCrash,
  AlertTriangle,
  RotateCcw,
  X,
  Radio,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils/cn";
import { useNetworkStatus, NetworkErrorInfo } from "@/lib/network/network-context";

export interface NetworkErrorBannerProps {
  /**
   * Clases opcionales para adaptar el contenedor o ubicación
   */
  className?: string;

  /**
   * Si debe mostrarse fijo en la parte superior de la ventana o en el flujo normal
   * @default true
   */
  sticky?: boolean;
}

export function NetworkErrorBanner({ className, sticky = true }: NetworkErrorBannerProps) {
  const { activeError, clearError, retryLastOperation, isRetrying, isOnline } = useNetworkStatus();
  const [showDetails, setShowDetails] = useState(false);

  if (!activeError) return null;

  // Selección de icono e identidad según tipo y código HTTP
  const getBannerConfig = (err: NetworkErrorInfo) => {
    if (!isOnline || err.type === "offline") {
      return {
        icon: WifiOff,
        badgeLabel: "Sin Internet",
        badgeVariant: "danger" as const,
        themeClasses:
          "bg-amber-500/10 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200",
        iconBg: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
      };
    }

    if (err.statusCode === 503 || err.type === "service_unavailable_503") {
      return {
        icon: Radio,
        badgeLabel: "HTTP 503",
        badgeVariant: "warning" as const,
        themeClasses:
          "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200",
        iconBg: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
      };
    }

    if (err.statusCode === 500 || err.type === "server_500") {
      return {
        icon: ServerCrash,
        badgeLabel: "HTTP 500",
        badgeVariant: "danger" as const,
        themeClasses:
          "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200",
        iconBg: "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300",
      };
    }

    return {
      icon: AlertTriangle,
      badgeLabel: err.statusCode ? `HTTP ${err.statusCode}` : "Conexión",
      badgeVariant: "warning" as const,
      themeClasses:
        "bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200",
      iconBg: "bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300",
    };
  };

  const config = getBannerConfig(activeError);
  const IconComponent = config.icon;

  return (
    <div
      id="network-error-banner"
      role="alert"
      aria-live="assertive"
      className={cn(
        "w-full z-50 transition-all duration-200 shadow-md border-b",
        sticky && "sticky top-0",
        config.themeClasses,
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Lado izquierdo: Icono + Mensaje + Badges de estado */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                config.iconBg
              )}
            >
              <IconComponent className="w-4 h-4 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  {activeError.message}
                </span>
                <Badge variant={config.badgeVariant} size="sm" dot dotPulse>
                  {config.badgeLabel}
                </Badge>
              </div>

              {activeError.detail && (
                <p className="text-[11px] sm:text-xs opacity-85 line-clamp-1 mt-0.5">
                  {activeError.detail}
                </p>
              )}
            </div>
          </div>

          {/* Lado derecho: Botón Reintentar manual + Detalles + Descartar */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
            {/* Botón Reintentar Manual */}
            <Button
              id="btn-retry-network"
              variant="outline"
              size="sm"
              isLoading={isRetrying}
              onClick={retryLastOperation}
              leftIcon={<RotateCcw className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")} />}
              className="bg-white/90 dark:bg-slate-900/90 border-current font-semibold text-xs h-8 px-3 hover:bg-white dark:hover:bg-slate-900 shadow-2xs"
            >
              {isRetrying ? "Reintentando..." : "Reintentar"}
            </Button>

            {/* Toggle de detalles técnicos */}
            {(activeError.endpoint || activeError.statusCode) && (
              <button
                type="button"
                id="btn-network-toggle-details"
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition text-xs flex items-center gap-1 focus:outline-none"
                title={showDetails ? "Ocultar detalles técnicos" : "Ver detalles técnicos"}
                aria-label="Ver detalles técnicos del fallo de conexión"
              >
                {showDetails ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Botón cerrar / descartar alerta */}
            <button
              type="button"
              id="btn-network-dismiss"
              onClick={clearError}
              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition focus:outline-none"
              title="Descartar alerta de red"
              aria-label="Descartar alerta de red"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sección expandible de diagnóstico técnico */}
        {showDetails && (
          <div className="mt-2.5 pt-2 border-t border-current/20 text-[11px] font-mono flex flex-wrap gap-4 items-center opacity-90">
            {activeError.statusCode && (
              <div>
                <span className="opacity-70">Código HTTP:</span>{" "}
                <span className="font-bold">{activeError.statusCode}</span>
              </div>
            )}
            {activeError.endpoint && (
              <div className="truncate max-w-md">
                <span className="opacity-70">Endpoint:</span>{" "}
                <span className="font-semibold">{activeError.endpoint}</span>
              </div>
            )}
            <div>
              <span className="opacity-70">Hora:</span>{" "}
              <span>{new Date(activeError.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-[10px] opacity-75">
              (Evento registrado discretamente en la consola del navegador para auditoría)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
