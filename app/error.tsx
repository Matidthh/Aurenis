"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ServerCrash, Wrench, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { discreetLogger } from "@/lib/api/discreet-logger";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  const is503 = error.message?.includes("503") || (error as any).status === 503;
  const is500 = error.message?.includes("500") || (error as any).status === 500 || (!is503 && !navigator?.onLine);
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  useEffect(() => {
    if (is500) {
      discreetLogger.logHttp500({
        errorCode: error.digest,
        errorMessage: error.message,
      });
    } else if (is503) {
      discreetLogger.logHttp503({
        errorCode: error.digest,
        errorMessage: error.message,
      });
    } else if (isOffline) {
      discreetLogger.logNetworkError({
        errorMessage: error.message,
      });
    } else {
      discreetLogger.logHttpError({
        errorMessage: error.message,
      });
    }
  }, [error, is500, is503, isOffline]);

  const config = isOffline
    ? {
        icon: <WifiOff className="w-7 h-7 text-amber-600 dark:text-amber-400" />,
        bgIcon: "bg-amber-100 dark:bg-amber-950/50",
        badge: "SIN CONEXIÓN",
        badgeVariant: "warning" as const,
        title: "Sin conexión a Internet",
        description: "No fue posible comunicarse con los servicios de Aurenis. Compruebe su conexión de red.",
      }
    : is503
    ? {
        icon: <Wrench className="w-7 h-7 text-orange-600 dark:text-orange-400" />,
        bgIcon: "bg-orange-100 dark:bg-orange-950/50",
        badge: "HTTP 503 · MANTENIMIENTO",
        badgeVariant: "warning" as const,
        title: "Servicio no disponible temporalmente",
        description: "El sistema se encuentra en proceso de mantenimiento o alta demanda. Intente nuevamente en unos minutos.",
      }
    : {
        icon: <ServerCrash className="w-7 h-7 text-red-600 dark:text-red-400" />,
        bgIcon: "bg-red-100 dark:bg-red-950/50",
        badge: "HTTP 500 · ERROR DEL SERVIDOR",
        badgeVariant: "danger" as const,
        title: "Error interno del servidor",
        description: "Se ha producido un inconveniente al procesar la solicitud. Nuestro equipo técnico ha sido notificado.",
      };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${config.bgIcon}`}>
          {config.icon}
        </div>
        <div className="space-y-2">
          <div className="flex justify-center">
            <Badge variant={config.badgeVariant} size="sm">
              {config.badge}
            </Badge>
          </div>
          <h1 className="text-xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {config.description}
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={() => reset()}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="w-full"
          >
            Reintentar operación
          </Button>
        </div>
      </div>
    </div>
  );
}

