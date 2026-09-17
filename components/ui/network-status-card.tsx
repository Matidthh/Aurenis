"use client";

import React, { useState } from "react";
import {
  Wifi,
  WifiOff,
  Radio,
  ServerCrash,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { useNetworkStatus, NetworkErrorType } from "@/lib/network/network-context";
import { cn } from "@/lib/utils/cn";

export interface NetworkStatusCardProps {
  title?: string;
  description?: string;
  statusCode?: number;
  type?: NetworkErrorType;
  onRetry?: () => Promise<void> | void;
  className?: string;
}

/**
 * Componente en bloque / tarjeta para mostrar dentro de una página o sección
 * cuando falla la carga de datos por error 500, 503 o desconexión.
 */
export function NetworkStatusCard({
  title,
  description,
  statusCode,
  type = "server_500",
  onRetry,
  className,
}: NetworkStatusCardProps) {
  const { retryLastOperation, isRetrying: globalRetrying } = useNetworkStatus();
  const [localRetrying, setLocalRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setLocalRetrying(true);
      try {
        await onRetry();
      } finally {
        setLocalRetrying(false);
      }
    } else {
      await retryLastOperation();
    }
  };

  const isRetrying = localRetrying || globalRetrying;

  const resolvedStatusCode = statusCode || (type === "service_unavailable_503" ? 503 : type === "server_500" ? 500 : undefined);
  const is503 = resolvedStatusCode === 503;
  const is500 = resolvedStatusCode === 500;
  const isOffline = type === "offline";

  const resolvedTitle =
    title ||
    (isOffline
      ? "Sin conexión a internet"
      : is503
      ? "Servicio temporalmente no disponible"
      : is500
      ? "Error interno del servidor"
      : "Error de comunicación de red");

  const resolvedDescription =
    description ||
    (isOffline
      ? "No pudimos conectar con los servidores de Aurenis. Revisa tu cable de red, Wi-Fi o datos móviles."
      : is503
      ? "El servidor está experimentando una alta demanda o se encuentra en una breve pausa de mantenimiento. La plataforma se recuperará en breve."
      : is500
      ? "El servidor encontró un error inesperado al procesar la información. El evento ha sido registrado en consola para revisión."
      : "Ocurrió un problema de conectividad al transferir la información.");

  return (
    <div
      id="network-status-card"
      role="alert"
      className={cn(
        "rounded-2xl border bg-white dark:bg-slate-900 p-6 sm:p-8 text-center max-w-lg mx-auto shadow-sm space-y-4",
        isOffline
          ? "border-amber-200 dark:border-amber-800/80"
          : is503
          ? "border-amber-200 dark:border-amber-800/80"
          : "border-red-200 dark:border-red-800/80",
        className
      )}
    >
      {/* Icono visual */}
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 rounded-2xl animate-pulse opacity-40",
            isOffline
              ? "bg-amber-100 dark:bg-amber-950"
              : is503
              ? "bg-amber-100 dark:bg-amber-950"
              : "bg-red-100 dark:bg-red-950"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-xs",
            isOffline
              ? "bg-amber-500 text-white"
              : is503
              ? "bg-amber-600 text-white"
              : "bg-red-600 text-white"
          )}
        >
          {isOffline ? (
            <WifiOff className="w-6 h-6" />
          ) : is503 ? (
            <Radio className="w-6 h-6" />
          ) : (
            <ServerCrash className="w-6 h-6" />
          )}
        </div>
      </div>

      {/* Titulares y badge de estado */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {resolvedTitle}
          </h3>
          {resolvedStatusCode && (
            <Badge
              variant={is503 ? "warning" : "danger"}
              size="sm"
              dot
              dotPulse
            >
              HTTP {resolvedStatusCode}
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {resolvedDescription}
        </p>
      </div>

      {/* Botón Reintentar manual */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          id="card-btn-retry"
          variant="primary"
          size="md"
          isLoading={isRetrying}
          onClick={handleRetry}
          leftIcon={<RotateCcw className={cn("w-4 h-4", isRetrying && "animate-spin")} />}
          className={cn(
            "w-full sm:w-auto font-semibold px-6",
            is503
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : is500
              ? "bg-red-600 hover:bg-red-700 text-white"
              : undefined
          )}
        >
          {isRetrying ? "Comprobando conexión..." : "Reintentar ahora"}
        </Button>
      </div>

      {/* Consejos breves */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 flex items-center justify-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Si el error persiste, los cambios locales permanecen a salvo.</span>
      </div>
    </div>
  );
}

/**
 * Píldora de estado de red para la barra de navegación o pie de página.
 */
export function NetworkIndicatorPill({ className }: { className?: string }) {
  const { isOnline, activeError } = useNetworkStatus();

  if (isOnline && !activeError) {
    return (
      <div
        id="network-indicator-online"
        title="Conexión de red activa y estable"
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 select-none",
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>En línea</span>
      </div>
    );
  }

  const is503 = activeError?.statusCode === 503 || activeError?.type === "service_unavailable_503";
  const is500 = activeError?.statusCode === 500 || activeError?.type === "server_500";

  return (
    <div
      id="network-indicator-offline"
      title={activeError?.message || "Fallo de conexión"}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border select-none animate-bounce",
        is503
          ? "bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300"
          : is500
          ? "bg-red-50 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300"
          : "bg-orange-50 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
      <span>{activeError?.statusCode ? `Fallo HTTP ${activeError.statusCode}` : "Desconectado"}</span>
    </div>
  );
}
