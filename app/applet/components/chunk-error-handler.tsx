"use client";

import React, { Component, ErrorInfo, ReactNode, useEffect } from "react";

/**
 * ============================================================================
 * AURENIS — GESTOR DE ERRORES DE CHUNK Y DESPLIEGUE CONTINUO
 * ============================================================================
 * Autores: Malcom Marcelo (Frontend) & Frank M. (QA & Resiliencia)
 * 
 * Propósito:
 * Detectar fallos de red en chunks Webpack/Next.js ("ChunkLoadError" o "Failed to fetch RSC payload")
 * cuando se despliega una nueva versión o se interrumpe la conexión, provocando un refresco
 * transparente con protección anti-bucle mediante sessionStorage.
 * ============================================================================
 */

const CHUNK_RELOAD_KEY = "aurenis_chunk_reload_ts";
const RELOAD_COOLDOWN_MS = 15000; // 15 segundos entre recargas automáticas

/**
 * Determina si un error corresponde a un chunk de JavaScript no disponible
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : "";

  return (
    name === "ChunkLoadError" ||
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Failed to fetch RSC payload") ||
    message.includes("is not a valid JavaScript MIME type")
  );
}

/**
 * Ejecuta una recarga segura del navegador evitando bucles infinitos
 */
export function triggerChunkReload(source = "unknown", error?: unknown): void {
  if (typeof window === "undefined") return;

  try {
    const lastReload = sessionStorage.getItem(CHUNK_RELOAD_KEY);
    const now = Date.now();

    if (lastReload && now - parseInt(lastReload, 10) < RELOAD_COOLDOWN_MS) {
      console.warn(`[Aurenis ChunkHandler] Recarga suprimida para evitar bucle (fuente: ${source})`);
      return;
    }

    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
    console.info(`[Aurenis ChunkHandler] Recargando aplicación tras detectar chunk desactualizado (${source})...`);
    window.location.reload();
  } catch {
    window.location.reload();
  }
}

/**
 * Componente oyente global de errores de chunks y promesas no capturadas
 */
export function ChunkErrorListener(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error || event.message)) {
        triggerChunkReload("window.onerror", event.error);
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        triggerChunkReload("unhandledrejection", event.reason);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

interface ChunkErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ChunkErrorBoundaryState {
  hasError: boolean;
  isChunk: boolean;
  error: Error | null;
}

/**
 * Error Boundary React para envolver la aplicación y gestionar ChunkLoadError
 */
export class ChunkErrorBoundary extends Component<ChunkErrorBoundaryProps, ChunkErrorBoundaryState> {
  constructor(props: ChunkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, isChunk: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ChunkErrorBoundaryState {
    const isChunk = isChunkLoadError(error);
    return { hasError: true, isChunk, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (isChunkLoadError(error)) {
      triggerChunkReload("ChunkErrorBoundary", error);
    } else {
      console.error("[Aurenis ChunkErrorBoundary] Error capturado en el árbol de componentes:", error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.isChunk) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
            <div className="text-center max-w-md p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
              <div className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-spin flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-100 mb-2">Actualizando plataforma</h2>
              <p className="text-sm text-slate-400 mb-4">
                Se detectó una actualización en el sistema. Recargando la página automáticamente...
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Recargar ahora
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
