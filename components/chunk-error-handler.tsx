"use client";

import React, { Component, ErrorInfo, ReactNode, useEffect, useState } from "react";
import { RotateCcw, RefreshCw, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHUNK_RELOAD_KEY = "aurenis_chunk_reload_retry";
const CHUNK_RELOAD_TIMESTAMP_KEY = "aurenis_chunk_reload_timestamp";

// Lock en memoria para evitar ejecuciones concurrentes en el mismo frame (Punto 2)
let isReloadingInProgress = false;

/**
 * Permite a cualquier formulario o componente registrar explícitamente cambios pendientes.
 */
export function setAurenisUnsavedChanges(hasChanges: boolean) {
  if (typeof window !== "undefined") {
    (window as any).__AURENIS_HAS_UNSAVED_CHANGES__ = hasChanges;
  }
}

/**
 * Inspecciona si el usuario tiene formularios con cambios sin guardar en la vista actual (Punto 1).
 */
export function hasUnsavedUserChanges(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  // En la landing o rutas públicas sin formularios persistentes, no aplica bloqueo de reload
  const path = window.location.pathname;
  if (path === "/" || path === "/select-school" || path === "/login") {
    return false;
  }

  // 1. Bandera explícita en memoria
  if ((window as any).__AURENIS_HAS_UNSAVED_CHANGES__ === true) {
    return true;
  }

  // 2. Control de salida activo en ventana
  if (typeof (window as any).onbeforeunload === "function") {
    return true;
  }

  // 3. Inspección heurística de campos de formulario modificados
  try {
    const dirtyInputs = document.querySelectorAll(
      'form input:not([type="hidden"]):not([type="submit"]):not([type="button"]), form textarea, form select, [data-unsaved-changes="true"]'
    );

    for (const el of Array.from(dirtyInputs)) {
      if (el.getAttribute("data-unsaved-changes") === "true") {
        return true;
      }
      if (el instanceof HTMLInputElement) {
        // Chequeo exhaustivo de checkboxes y radio buttons
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.checked !== el.defaultChecked) {
            return true;
          }
        } else if (
          el.type !== "submit" &&
          el.type !== "button" &&
          el.type !== "reset" &&
          el.type !== "hidden"
        ) {
          if (el.value && el.value !== el.defaultValue && el.value.trim() !== "") {
            return true;
          }
        }
      } else if (el instanceof HTMLTextAreaElement) {
        if (el.value && el.value !== el.defaultValue && el.value.trim() !== "") {
          return true;
        }
      } else if (el instanceof HTMLSelectElement) {
        // Chequeo exhaustivo de selects (single y multi-select) comparando estado contra defaultSelected
        const isSelectDirty = Array.from(el.options).some(
          (opt) => opt.selected !== opt.defaultSelected
        );
        if (isSelectDirty) {
          return true;
        }
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Determina si un error corresponde a una falla de carga de chunk de Webpack / Next.js
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;

  const msg =
    typeof error === "string"
      ? error
      : (error as any)?.message || (error as any)?.name || (error as any)?.toString?.() || "";

  const lower = msg.toLowerCase();
  return (
    lower.includes("loading chunk") ||
    lower.includes("chunkloaderror") ||
    lower.includes("failed to fetch dynamically imported module") ||
    lower.includes("error loading dynamically imported module") ||
    lower.includes("failed to load script") ||
    lower.includes("missing chunk") ||
    lower.includes("cannot find module") ||
    lower.includes("encodeuripath") ||
    (lower.includes("cannot read properties of undefined") && lower.includes("split")) ||
    (error as any)?.name === "ChunkLoadError"
  );
}

/**
 * Ejecuta la recarga controlada o emite el aviso de cambios pendientes.
 */
export function triggerChunkReload(source = "unknown", errorDetails?: unknown): boolean {
  if (typeof window === "undefined") return false;

  // 1. Lock en memoria para evitar colisiones simultáneas en el mismo frame (Punto 2)
  if (isReloadingInProgress) {
    return false;
  }

  try {
    const hasReloaded = sessionStorage.getItem(CHUNK_RELOAD_KEY);
    const lastReloadTime = parseInt(sessionStorage.getItem(CHUNK_RELOAD_TIMESTAMP_KEY) || "0", 10);
    const now = Date.now();
    const buildId = process.env.NEXT_PUBLIC_BUILD_ID || (window as any).__NEXT_DATA__?.buildId || "unknown-build";

    // 2. Comprobación de estado sin guardar (Punto 1)
    if (hasUnsavedUserChanges()) {
      console.warn(
        `%c[Aurenis ChunkReloadHandler] ChunkLoadError detectado, pero se detectaron cambios sin guardar en el formulario. Mostrando aviso no bloqueante.`,
        "color: #f59e0b; font-weight: bold;"
      );
      window.dispatchEvent(
        new CustomEvent("aurenis:chunk-unsaved-warning", {
          detail: { source, buildId, errorDetails },
        })
      );
      return false;
    }

    // 3. Ejecución de auto-reload si no se ha recargado recientemente
    if (!hasReloaded || now - lastReloadTime > 30000) {
      isReloadingInProgress = true;
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
      sessionStorage.setItem(CHUNK_RELOAD_TIMESTAMP_KEY, now.toString());

      console.warn(
        `%c[Aurenis ChunkReloadHandler] ChunkLoadError detectado tras deploy (${source}). Build: ${buildId}. Ejecutando auto-reload preventivo...`,
        "color: #f59e0b; font-weight: bold;",
        errorDetails
      );

      window.location.reload();
      return true;
    } else {
      console.error(
        `%c[Aurenis ChunkReloadHandler] ChunkLoadError recurrente en Build: ${buildId}. Recarga previa ya ejecutada. Deteniendo para evitar bucle.`,
        "color: #ef4444; font-weight: bold;",
        errorDetails
      );
      return false;
    }
  } catch (storageErr) {
    console.warn("[Aurenis ChunkReloadHandler] Fallo al acceder a sessionStorage:", storageErr);
    if (!hasUnsavedUserChanges()) {
      isReloadingInProgress = true;
      window.location.reload();
      return true;
    }
    return false;
  }
}

/**
 * Listener global y Banner de Aviso no bloqueante para cuando hay cambios sin guardar.
 */
export function ChunkErrorListener() {
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    // 1. Limpieza de flag tras ejecución normal y estable (después de 4 segundos de sesión limpia)
    const resetTimer = setTimeout(() => {
      try {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      } catch {}
      isReloadingInProgress = false;
    }, 4000);

    // 2. Manejador de errores de scripts y chunks en ventana
    const handleError = (event: ErrorEvent) => {
      const isChunk = isChunkLoadError(event.error || event.message);
      if (isChunk) {
        event.preventDefault();
        triggerChunkReload("window.onerror", event.error || event.message);
      }
    };

    // 3. Manejador de rechazos de promesas de import() dinámico
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const isChunk = isChunkLoadError(event.reason);
      if (isChunk) {
        event.preventDefault();
        triggerChunkReload("window.onunhandledrejection", event.reason);
      }
    };

    // 4. Escuchar evento de aviso por cambios sin guardar
    const handleUnsavedWarning = () => {
      setShowUnsavedWarning(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("aurenis:chunk-unsaved-warning", handleUnsavedWarning);

    return () => {
      clearTimeout(resetTimer);
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("aurenis:chunk-unsaved-warning", handleUnsavedWarning);
    };
  }, []);

  const handleForceReload = () => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {}
    isReloadingInProgress = true;
    window.location.reload();
  };

  if (!showUnsavedWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full p-4 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Actualización del sistema disponible
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Se ha publicado una nueva versión. Tienes cambios o datos ingresados en esta pantalla; guarda tu formulario y luego actualiza.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleForceReload}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs py-1 h-8"
            >
              Actualizar ahora
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUnsavedWarning(false)}
              className="text-xs py-1 h-8"
            >
              Continuar editando
            </Button>
          </div>
        </div>
        <button
          onClick={() => setShowUnsavedWarning(false)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Cerrar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ChunkErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ChunkErrorBoundaryState {
  hasError: boolean;
  isChunkError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary especializado en interceptar fallas de carga en componentes 'next/dynamic'
 */
export class ChunkErrorBoundary extends Component<ChunkErrorBoundaryProps, ChunkErrorBoundaryState> {
  constructor(props: ChunkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isChunkError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ChunkErrorBoundaryState {
    const isChunk = isChunkLoadError(error);
    return {
      hasError: true,
      isChunkError: isChunk,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isChunkLoadError(error)) {
      triggerChunkReload("ChunkErrorBoundary", { error, errorInfo });
    }
  }

  handleManualReload = () => {
    try {
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    } catch {}
    isReloadingInProgress = true;
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.state.isChunkError) {
        return (
          <div className="min-h-[280px] w-full flex flex-col items-center justify-center p-6 my-4 bg-slate-50 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nueva versión de la plataforma disponible
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Se ha desplegado una actualización de Aurenis. Recarga la página para sincronizar los módulos más recientes.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={this.handleManualReload}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Actualizar aplicación
            </Button>
          </div>
        );
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }
    }

    return this.props.children;
  }
}
