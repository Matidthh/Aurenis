"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2, Trash2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "delete" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // en ms, default 3000ms
  action?: ToastAction;
  createdAt: number;
}

export interface ToastOptions {
  description?: string;
  duration?: number; // default 3000ms
  action?: ToastAction;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
  // Helpers semánticos estándar
  toastSuccess: (title: string, options?: ToastOptions) => string;
  toastDelete: (title: string, options?: ToastOptions) => string;
  toastError: (title: string, options?: ToastOptions) => string;
  toastInfo: (title: string, options?: ToastOptions) => string;
}

const ToastContext = createContext<ToastContextType | null>(null);

const MAX_TOASTS = 4; // Cola de mensajes controlada (máximo 4 simultáneos en viewport)
const DEFAULT_AUTODISMISS_MS = 3000; // Auto-descartable a los 3 segundos exactos

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    // Limpiar timer si existe
    const timer = timeoutsRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    timeoutsRef.current.forEach((timer) => clearTimeout(timer));
    timeoutsRef.current.clear();
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (type: ToastType, title: string, options?: ToastOptions): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const duration = options?.duration !== undefined ? options.duration : DEFAULT_AUTODISMISS_MS;

      const newToast: ToastItem = {
        id,
        type,
        title,
        description: options?.description,
        duration,
        action: options?.action,
        createdAt: Date.now(),
      };

      setToasts((prev) => {
        // Control de cola: si supera MAX_TOASTS - 1, removemos el más antiguo
        const trimmed = prev.length >= MAX_TOASTS ? prev.slice(prev.length - (MAX_TOASTS - 1)) : prev;
        return [...trimmed, newToast];
      });

      // Auto-descarte controlado
      if (duration > 0) {
        const timer = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutsRef.current.set(id, timer);
      }

      return id;
    },
    [dismissToast]
  );

  const toastSuccess = useCallback(
    (title: string, options?: ToastOptions) => addToast("success", title, options),
    [addToast]
  );

  const toastDelete = useCallback(
    (title: string, options?: ToastOptions) => addToast("delete", title, options),
    [addToast]
  );

  const toastError = useCallback(
    (title: string, options?: ToastOptions) => addToast("error", title, options),
    [addToast]
  );

  const toastInfo = useCallback(
    (title: string, options?: ToastOptions) => addToast("info", title, options),
    [addToast]
  );

  // Limpieza al desmontar
  useEffect(() => {
    const map = timeoutsRef.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        dismissToast,
        clearAllToasts,
        toastSuccess,
        toastDelete,
        toastError,
        toastInfo,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de un ToastProvider");
  }
  return context;
}

/**
 * Contenedor visual posicionado en la esquina inferior derecha con soporte accesible
 * y animaciones ópticas suaves de entrada y salida.
 */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      id="aurenis-toast-viewport"
      role="region"
      aria-label="Notificaciones del sistema"
      className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/**
 * Toast individual con alta accesibilidad (WCAG AA), alto contraste,
 * barra de progreso sutil y soporte interactivo.
 */
function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const duration = toast.duration || DEFAULT_AUTODISMISS_MS;

  const typeStyles = {
    success: {
      card: "bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/40 text-slate-900 dark:text-white shadow-lg shadow-emerald-950/5",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
      icon: CheckCircle2,
      progress: "bg-emerald-500 dark:bg-emerald-400",
      badge: "Guardado",
      badgeClass: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    delete: {
      card: "bg-white dark:bg-slate-900 border-rose-500/30 dark:border-rose-500/40 text-slate-900 dark:text-white shadow-lg shadow-rose-950/5",
      iconBg: "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300",
      icon: Trash2,
      progress: "bg-rose-500 dark:bg-rose-400",
      badge: "Eliminado",
      badgeClass: "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    },
    error: {
      card: "bg-white dark:bg-slate-900 border-red-500/30 dark:border-red-500/40 text-slate-900 dark:text-white shadow-lg shadow-red-950/5",
      iconBg: "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300",
      icon: AlertCircle,
      progress: "bg-red-500 dark:bg-red-400",
      badge: "Error",
      badgeClass: "bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800",
    },
    info: {
      card: "bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/40 text-slate-900 dark:text-white shadow-lg shadow-blue-950/5",
      iconBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300",
      icon: Info,
      progress: "bg-blue-500 dark:bg-blue-400",
      badge: "Información",
      badgeClass: "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
  }[toast.type];

  const IconComponent = typeStyles.icon;

  return (
    <div
      id={`toast-${toast.id}`}
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2",
        typeStyles.card
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icono temático con contraste auditado */}
        <div
          className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs",
            typeStyles.iconBg
          )}
        >
          <IconComponent className="w-4 h-4 stroke-[2.5]" />
        </div>

        {/* Textos y contenido */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {toast.title}
            </h4>
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border",
                typeStyles.badgeClass
              )}
            >
              {typeStyles.badge}
            </span>
          </div>

          {toast.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="text-xs font-bold underline underline-offset-2 hover:opacity-80 transition"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Botón cerrar manual */}
        <button
          type="button"
          id={`toast-dismiss-${toast.id}`}
          onClick={() => onDismiss(toast.id)}
          aria-label="Cerrar notificación"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso de auto-descarte (3 segundos) */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800/60 overflow-hidden">
          <div
            className={cn("h-full origin-left", typeStyles.progress)}
            style={{
              animation: `aurenisShrinkWidth ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
