"use client";

import { useEffect } from "react";
import { ServerCrash, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { discreetLogger } from "@/lib/api/discreet-logger";
import { isChunkLoadError, triggerChunkReload } from "@/components/chunk-error-handler";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isChunkLoadError(error)) {
      triggerChunkReload("app/global-error.tsx", error);
      return;
    }

    discreetLogger.logHttp500({
      errorCode: error.digest,
      errorMessage: error.message || "Global application runtime error",
    });
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <ServerCrash className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              Error 500 · Servidor
            </span>
            <h1 className="text-xl font-bold tracking-tight">Se produjo un problema inesperado</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              El sistema ha registrado este incidente de forma segura y nuestro equipo técnico ha sido notificado.
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
      </body>
    </html>
  );
}

