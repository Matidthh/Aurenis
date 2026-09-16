"use client";

import React, { useState } from "react";
import {
  WifiOff,
  AlertTriangle,
  ServerCrash,
  RefreshCw,
  X,
  CheckCircle2,
  Clock,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNetworkStatus, ConnectionErrorType } from "@/lib/api/network-status";
import { Button } from "./button";
import { Badge } from "./badge";

export interface NetworkErrorBannerProps {
  variant?: "top-banner" | "inline" | "floating";
  className?: string;
  showDevSimulator?: boolean;
}

export function NetworkErrorBanner({
  variant = "top-banner",
  className = "",
  showDevSimulator = false,
}: NetworkErrorBannerProps) {
  const {
    isOnline,
    activeError,
    isRetrying,
    isSuccessRecovered,
    retryLastRequest,
    dismissError,
    simulateError,
  } = useNetworkStatus();

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Si todo está online, no hay error activo y no se acaba de recuperar, solo renderizar el simulador si está activo
  if (isOnline && !activeError && !isSuccessRecovered) {
    if (!showDevSimulator) return null;
  }

  // 1. Banner de éxito al restablecer conexión
  if (isSuccessRecovered && !activeError) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`w-full bg-emerald-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${className}`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-100" />
            <span>Conexión restablecida con éxito. El servicio está operativo.</span>
          </div>
          <Badge variant="outline" className="border-emerald-300 text-emerald-100 bg-emerald-700/50 text-[10px]">
            Online
          </Badge>
        </div>
      </div>
    );
  }

  // Si no hay error activo y no es offline, salir
  if (isOnline && !activeError && showDevSimulator) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-slate-500 font-medium">Herramientas de diagnóstico de red:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => simulateError("offline")}
              className="px-2 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-[11px] font-medium"
            >
              Simular Offline
            </button>
            <button
              onClick={() => simulateError("server_500")}
              className="px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 text-[11px] font-medium"
            >
              Simular HTTP 500
            </button>
            <button
              onClick={() => simulateError("service_503")}
              className="px-2 py-1 rounded bg-orange-100 text-orange-800 hover:bg-orange-200 text-[11px] font-medium"
            >
              Simular HTTP 503
            </button>
          </div>
        </div>
      </div>
    );
  }

  const errorType: ConnectionErrorType = !isOnline ? "offline" : activeError?.type || "generic_network";

  // Configuración de estilos e íconos por tipo de error
  const config = {
    offline: {
      bg: "bg-amber-500 text-slate-950 dark:bg-amber-600 dark:text-white",
      badgeBg: "bg-amber-900/20 text-slate-950 dark:text-amber-100 border-amber-950/20",
      icon: <WifiOff className="w-5 h-5 shrink-0 animate-pulse" />,
      badgeText: "SIN CONEXIÓN",
      defaultTitle: "Sin conexión a Internet",
      defaultMsg: "Verifique su red Wi-Fi o conexión de datos móviles para continuar navegando.",
    },
    server_500: {
      bg: "bg-red-600 text-white",
      badgeBg: "bg-red-950/30 text-red-100 border-red-400/40",
      icon: <ServerCrash className="w-5 h-5 shrink-0" />,
      badgeText: "HTTP 500 · ERROR DEL SERVIDOR",
      defaultTitle: "Error interno del servidor",
      defaultMsg: "El servidor de Aurenis experimentó una dificultad temporal. Puede reintentar la operación.",
    },
    service_503: {
      bg: "bg-orange-600 text-white",
      badgeBg: "bg-orange-950/30 text-orange-100 border-orange-400/40",
      icon: <Wrench className="w-5 h-5 shrink-0" />,
      badgeText: "HTTP 503 · MANTENIMIENTO / ALTA DEMANDA",
      defaultTitle: "Servicio temporalmente no disponible",
      defaultMsg: "La plataforma se encuentra actualizando componentes o con alta demanda. Por favor, reintente en unos instantes.",
    },
    network_timeout: {
      bg: "bg-amber-600 text-white",
      badgeBg: "bg-amber-950/30 text-amber-100 border-amber-400/40",
      icon: <Clock className="w-5 h-5 shrink-0" />,
      badgeText: "TIEMPO AGOTADO",
      defaultTitle: "Tiempo de espera superado",
      defaultMsg: "La solicitud tomó más tiempo del esperado en responder. Compruebe la estabilidad de su red.",
    },
    generic_network: {
      bg: "bg-red-600 text-white",
      badgeBg: "bg-red-950/30 text-red-100 border-red-400/40",
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
      badgeText: "FALLO DE CONEXIÓN",
      defaultTitle: "Fallo de comunicación",
      defaultMsg: "No fue posible comunicarse con el servidor. Intente nuevamente.",
    },
  }[errorType];

  const title = activeError?.title || config.defaultTitle;
  const message = activeError?.message || config.defaultMsg;

  // Renderizado variante Flotante (Toast / Pill en esquina inferior)
  if (variant === "floating") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={`fixed bottom-5 right-5 z-50 max-w-md w-full p-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 ${config.bg} ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {config.icon}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm leading-tight">{title}</span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${config.badgeBg}`}>
                  {config.badgeText}
                </span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={dismissError}
            className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition opacity-80 hover:opacity-100"
            aria-label="Descartar alerta de error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-black/10 dark:border-white/10">
          <Button
            size="sm"
            variant="secondary"
            onClick={retryLastRequest}
            isLoading={isRetrying}
            loadingText="Reintentando..."
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-sm"
          >
            Reintentar ahora
          </Button>
        </div>
      </div>
    );
  }

  // Renderizado variante Top Banner (Barra Superior Anclada)
  return (
    <aside
      role="alert"
      aria-live="assertive"
      className={`w-full ${config.bg} py-2.5 px-4 shadow-lg transition-all duration-200 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {config.icon}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
            <span className="font-bold tracking-tight shrink-0">{title}</span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span className="opacity-95 truncate text-xs sm:text-sm">{message}</span>
            <span className={`inline-flex items-center text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded border w-fit ${config.badgeBg}`}>
              {config.badgeText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            size="sm"
            onClick={retryLastRequest}
            isLoading={isRetrying}
            loadingText="Reintentando..."
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
            className="bg-white/95 text-slate-900 hover:bg-white active:bg-slate-200 border-none font-bold text-xs shadow-xs"
          >
            Reintentar
          </Button>

          <button
            onClick={dismissError}
            className="p-1.5 rounded-lg hover:bg-black/15 dark:hover:bg-white/15 transition opacity-80 hover:opacity-100"
            aria-label="Cerrar aviso de error de red"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Simulador para pruebas rápidas si está activado */}
      {showDevSimulator && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/20 text-[11px] flex items-center justify-between">
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="flex items-center gap-1 font-semibold underline underline-offset-2 opacity-90"
          >
            {isSimulatorOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Opciones de simulación de fallos
          </button>

          {isSimulatorOpen && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => simulateError("offline")}
                className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white font-mono"
              >
                Offline
              </button>
              <button
                onClick={() => simulateError("server_500")}
                className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white font-mono"
              >
                HTTP 500
              </button>
              <button
                onClick={() => simulateError("service_503")}
                className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white font-mono"
              >
                HTTP 503
              </button>
              <button
                onClick={() => simulateError("network_timeout")}
                className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-white font-mono"
              >
                Timeout
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
