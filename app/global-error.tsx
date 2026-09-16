"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Se produjo un problema inesperado</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              El sistema ha registrado este incidente de forma segura y nuestro equipo técnico ha sido notificado.
            </p>
            {isDev && error.stack && (
              <pre className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 text-xs text-left overflow-auto max-h-40 rounded text-red-600">
                {error.stack}
              </pre>
            )}
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => reset()}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
