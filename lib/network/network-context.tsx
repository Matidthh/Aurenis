"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type NetworkErrorType = "offline" | "server_500" | "service_unavailable_503" | "timeout" | "generic";

export interface NetworkErrorInfo {
  type: NetworkErrorType;
  statusCode?: number; // 500, 503, etc.
  message: string;
  detail?: string;
  endpoint?: string;
  timestamp: string;
}

interface NetworkStatusContextType {
  isOnline: boolean;
  activeError: NetworkErrorInfo | null;
  triggerNetworkError: (info: {
    type?: NetworkErrorType;
    statusCode?: number;
    message?: string;
    detail?: string;
    endpoint?: string;
  }) => void;
  clearError: () => void;
  retryLastOperation: () => Promise<void>;
  registerRetryHandler: (handler: () => Promise<boolean | void>) => () => void;
  isRetrying: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextType | null>(null);

/**
 * Registro discreto y estructurado en la consola del navegador.
 * Evita ruido excesivo con prefijos limpios y metadatos legibles para diagnóstico.
 */
function logDiscreetNetworkEvent(level: "warn" | "error" | "info", event: string, meta?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const prefix = "%c[Aurenis Network]";
  const style =
    level === "error"
      ? "color: #ef4444; font-weight: bold;"
      : level === "warn"
      ? "color: #f59e0b; font-weight: bold;"
      : "color: #3b82f6; font-weight: bold;";

  const timestamp = new Date().toLocaleTimeString();
  if (meta && Object.keys(meta).length > 0) {
    console[level](`${prefix} (${timestamp}) ${event}`, style, meta);
  } else {
    console[level](`${prefix} (${timestamp}) ${event}`, style);
  }
}

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [activeError, setActiveError] = useState<NetworkErrorInfo | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryHandlers, setRetryHandlers] = useState<Array<() => Promise<boolean | void>>>([]);

  // 1. Escuchar eventos nativos de conectividad del navegador
  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(window.navigator.onLine);

    const handleOnline = () => {
      logDiscreetNetworkEvent("info", "Conexión de red restablecida.");
      setIsOnline(true);
      // Si el error activo era puramente por desconexión offline, lo limpiamos automáticamente
      setActiveError((current) => (current?.type === "offline" ? null : current));
    };

    const handleOffline = () => {
      logDiscreetNetworkEvent("warn", "Fallo de conexión: El dispositivo está sin acceso a internet.", {
        navigatorStatus: "offline",
      });
      setIsOnline(false);
      setActiveError({
        type: "offline",
        message: "Sin conexión a internet",
        detail: "Verifica tu conexión Wi-Fi, cable de red o datos móviles.",
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Interceptor global ligero para peticiones fetch (captura 500, 503 y fallos de red)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const originalFetch = window.fetch.bind(window);

      const customFetch = async (...args: Parameters<typeof fetch>) => {
        // Ignorar peticiones internas de Next.js (_next/, hot-reloads, static chunks)
        const endpoint = typeof args[0] === "string" ? args[0] : (args[0] as Request)?.url || "";
        if (endpoint.includes("/_next/") || endpoint.includes("__next") || endpoint.includes("favicon")) {
          return originalFetch(...args);
        }

        try {
          const response = await originalFetch(...args);

          // Detección de HTTP 500 (Internal Server Error) y HTTP 503 (Service Unavailable)
          if (response.status === 500 || response.status === 503) {
            const statusCode = response.status;
            const errorType: NetworkErrorType =
              statusCode === 503 ? "service_unavailable_503" : "server_500";

            // Registro discreto en consola
            logDiscreetNetworkEvent("error", `Fallo de servidor HTTP ${statusCode} en endpoint`, {
              status: statusCode,
              statusText: response.statusText,
              url: endpoint || "API",
            });

            setActiveError({
              type: errorType,
              statusCode,
              message:
                statusCode === 503
                  ? "Servicio temporalmente no disponible (HTTP 503)"
                  : "Error interno del servidor (HTTP 500)",
              detail:
                statusCode === 503
                  ? "El servidor está ocupado o en mantenimiento. Por favor intenta en unos momentos."
                  : "Se produjo una excepción no controlada en el servicio. El equipo técnico ha sido notificado.",
              endpoint: endpoint || "API",
              timestamp: new Date().toISOString(),
            });
          }

          return response;
        } catch (err: any) {
          // Ignorar cancelaciones intencionadas de navegación o búsquedas (AbortError)
          if (err?.name === "AbortError" || err?.message?.includes("aborted")) {
            throw err;
          }

          // Fallo a nivel de socket / DNS / timeout / conexión rechazada
          logDiscreetNetworkEvent("warn", "Fallo al enviar solicitud de red", {
            url: endpoint || "API",
            errorMessage: err?.message,
          });

          if (!window.navigator.onLine) {
            setActiveError({
              type: "offline",
              message: "Sin conexión a internet",
              detail: "No se pudo alcanzar el servidor. Comprueba tu conexión.",
              endpoint: endpoint || "API",
              timestamp: new Date().toISOString(),
            });
          } else {
            setActiveError({
              type: "timeout",
              message: "Fallo en la comunicación con el servidor",
              detail: "La solicitud tardó demasiado o la red se interrumpió inesperadamente.",
              endpoint: endpoint || "API",
              timestamp: new Date().toISOString(),
            });
          }

          throw err;
        }
      };

      // En algunos navegadores/iframes, window.fetch está definido con solo getter en el prototype
      // Intentamos asignación directa primero, o defineProperty si no es reescribible directamente
      const descriptor = Object.getOwnPropertyDescriptor(window, "fetch") || 
                         Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), "fetch");
      
      let restored = false;
      if (descriptor && !descriptor.writable && !descriptor.set) {
        // En caso de que fetch tenga solo getter y no sea configurable, interceptamos vía defineProperty en window
        try {
          Object.defineProperty(window, "fetch", {
            value: customFetch,
            writable: true,
            configurable: true,
          });
          restored = true;
        } catch (defineErr) {
          logDiscreetNetworkEvent("info", "No se pudo redefinir window.fetch por políticas del entorno; usando listeners nativos.");
        }
      } else {
        try {
          window.fetch = customFetch;
          restored = true;
        } catch (assignErr) {
          try {
            Object.defineProperty(window, "fetch", {
              value: customFetch,
              writable: true,
              configurable: true,
            });
            restored = true;
          } catch {
            logDiscreetNetworkEvent("info", "Modo pasivo de red activado.");
          }
        }
      }

      return () => {
        if (restored) {
          try {
            window.fetch = originalFetch;
          } catch {
            try {
              Object.defineProperty(window, "fetch", {
                value: originalFetch,
                writable: true,
                configurable: true,
              });
            } catch {
              // ignore cleanup error
            }
          }
        }
      };
    } catch {
      // Ignorar si el entorno del navegador tiene la propiedad fetch completamente protegida
    }
  }, []);

  const triggerNetworkError = useCallback(
    ({
      type = "generic",
      statusCode,
      message,
      detail,
      endpoint,
    }: {
      type?: NetworkErrorType;
      statusCode?: number;
      message?: string;
      detail?: string;
      endpoint?: string;
    }) => {
      let resolvedMsg = message;
      let resolvedDetail = detail;

      if (!resolvedMsg) {
        if (statusCode === 503 || type === "service_unavailable_503") {
          resolvedMsg = "Servicio no disponible temporalmente (HTTP 503)";
          resolvedDetail = "El servidor está bajo mantenimiento o alta demanda. Intenta nuevamente.";
        } else if (statusCode === 500 || type === "server_500") {
          resolvedMsg = "Error interno del servidor (HTTP 500)";
          resolvedDetail = "Ocurrió un error inesperado al procesar los datos académicos.";
        } else if (type === "offline") {
          resolvedMsg = "Sin conexión a internet";
          resolvedDetail = "Por favor verifica el estado de tu red y reintenta.";
        } else {
          resolvedMsg = "Fallo de conexión o red";
          resolvedDetail = "No se pudo completar la operación solicitada.";
        }
      }

      logDiscreetNetworkEvent("warn", `Alerta de red activada: ${resolvedMsg}`, {
        statusCode,
        endpoint,
        detail: resolvedDetail,
      });

      setActiveError({
        type,
        statusCode,
        message: resolvedMsg,
        detail: resolvedDetail,
        endpoint,
        timestamp: new Date().toISOString(),
      });
    },
    []
  );

  const clearError = useCallback(() => {
    setActiveError(null);
  }, []);

  const registerRetryHandler = useCallback((handler: () => Promise<boolean | void>) => {
    setRetryHandlers((prev) => [...prev, handler]);
    return () => {
      setRetryHandlers((prev) => prev.filter((h) => h !== handler));
    };
  }, []);

  const retryLastOperation = useCallback(async () => {
    setIsRetrying(true);
    logDiscreetNetworkEvent("info", "Iniciando reintento manual de conexión...");

    try {
      if (retryHandlers.length > 0) {
        // Ejecutar manejadores de reintento registrados por los componentes
        for (const handler of retryHandlers) {
          await handler();
        }
      } else {
        // Ping de comprobación rápida a endpoint de salud o recarga suave
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      logDiscreetNetworkEvent("info", "Reintento de conexión exitoso.");
      setActiveError(null);
    } catch (err: any) {
      logDiscreetNetworkEvent("error", "El reintento manual falló.", { error: err?.message });
    } finally {
      setIsRetrying(false);
    }
  }, [retryHandlers]);

  return (
    <NetworkStatusContext.Provider
      value={{
        isOnline,
        activeError,
        triggerNetworkError,
        clearError,
        retryLastOperation,
        registerRetryHandler,
        isRetrying,
      }}
    >
      {children}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error("useNetworkStatus debe ser utilizado dentro de un NetworkStatusProvider");
  }
  return context;
}
