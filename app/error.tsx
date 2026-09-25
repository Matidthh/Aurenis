"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RotateCcw, ServerCrash, Radio, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isChunkLoadError, triggerChunkReload } from "@/components/chunk-error-handler";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string; statusCode?: number };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const isChunk = isChunkLoadError(error);

  // Detección de posibles códigos 500 / 503 en el mensaje o digest
  const is503 =
    error.statusCode === 503 ||
    error.message?.includes("503") ||
    error.message?.toLowerCase().includes("unavailable");

  const is500 =
    error.statusCode === 500 ||
    error.message?.includes("500") ||
    (!is503 && Boolean(error.digest));

  useEffect(() => {
    // Si es un error de chunk por deploy, activar auto-reload preventivo
    if (isChunk) {
      triggerChunkReload("app/error.tsx", error);
      return;
    }

    // Registro discreto y formateado en consola
    const timestamp = new Date().toLocaleTimeString();
    const code = is503 ? 503 : is500 ? 500 : "ERROR";
    console.error(
      `%c[Aurenis ErrorHandler] (${timestamp}) Fallo capturado [HTTP ${code}]`,
      "color: #ef4444; font-weight: bold;",
      {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      }
    );
  }, [error, is500, is503, isChunk]);

  const handleRetry = async () => {
    setIsRetrying(true);
    console.info("%c[Aurenis ErrorHandler] Ejecutando reintento manual...", "color: #3b82f6; font-weight: bold;");
    try {
      reset();
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${
            is503
              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
              : "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
          }`}
        >
          {is503 ? <Radio className="w-7 h-7" /> : <ServerCrash className="w-7 h-7" />}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              {is503
                ? "Servicio temporalmente no disponible"
                : is500
                ? "Error interno del servidor"
                : "Ocurrió un error inesperado"}
            </h1>
            <Badge variant={is503 ? "warning" : "danger"} size="sm" dot>
              {is503 ? "HTTP 503" : is500 ? "HTTP 500" : "Fallo"}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {is503
              ? "El servidor está ocupado o realizando una sincronización de seguridad. Espera un momento y reintenta."
              : "Se produjo una excepción no prevista en el servidor. Tus datos locales se mantienen seguros."}
          </p>

          {error.digest && (
            <p className="text-[11px] text-slate-400 font-mono pt-1">
              Código de rastreo: {error.digest}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            id="btn-error-retry"
            variant="primary"
            isLoading={isRetrying}
            onClick={handleRetry}
            leftIcon={<RotateCcw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />}
            className="w-full font-semibold"
          >
            {isRetrying ? "Reintentando conexión..." : "Reintentar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
