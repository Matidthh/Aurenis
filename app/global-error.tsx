'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    console.error('Root Global Error:', error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4 font-sans">
        <div
          id="global-error-card"
          className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Error Crítico del Sistema</h1>
            <p className="text-sm text-slate-300">
              {isDev
                ? error.message || 'Se produjo un fallo irrecuperable en la raíz de la aplicación.'
                : 'Se produjo un problema inesperado al inicializar la aplicación.'}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-400 font-mono">
                ID de Error: {error.digest}
              </p>
            )}
          </div>

          {isDev && error.stack && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-slate-400 hover:text-slate-200 underline mx-auto block"
              >
                {showDetails ? 'Ocultar stack trace' : 'Mostrar stack trace (dev)'}
              </button>
              {showDetails && (
                <pre className="mt-2 p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-48">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              id="global-reset-button"
              onClick={() => reset()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
