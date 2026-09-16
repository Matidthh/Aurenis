"use client";

import { useState, useEffect, useCallback } from "react";
import { discreetLogger } from "./discreet-logger";

export type ConnectionErrorType =
  | "offline"
  | "server_500"
  | "service_503"
  | "network_timeout"
  | "generic_network";

export interface NetworkErrorInfo {
  id: string;
  type: ConnectionErrorType;
  title: string;
  message: string;
  status?: number;
  url?: string;
  timestamp: string;
  retryAction?: () => Promise<unknown> | void;
}

// Emisor de eventos simple en memoria para estado global de conectividad
type NetworkStateListener = (state: NetworkState) => void;

interface NetworkState {
  isOnline: boolean;
  activeError: NetworkErrorInfo | null;
  isRetrying: boolean;
}

let globalNetworkState: NetworkState = {
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  activeError: null,
  isRetrying: false,
};

const listeners = new Set<NetworkStateListener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener({ ...globalNetworkState });
    } catch (e) {
      console.error("[Aurenis Network Listener Error]", e);
    }
  });
}

/**
 * Establece o actualiza el error activo de red/servidor
 */
export function setGlobalNetworkError(error: Omit<NetworkErrorInfo, "id" | "timestamp"> | null) {
  if (!error) {
    if (globalNetworkState.activeError) {
      globalNetworkState.activeError = null;
      notifyListeners();
    }
    return;
  }

  const errorInfo: NetworkErrorInfo = {
    ...error,
    id: `net-err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  globalNetworkState.activeError = errorInfo;
  notifyListeners();
}

/**
 * Limpia el error activo de red
 */
export function clearGlobalNetworkError() {
  if (globalNetworkState.activeError) {
    globalNetworkState.activeError = null;
    notifyListeners();
  }
}

/**
 * Inicialización de listeners de navegador para eventos 'online' y 'offline'
 */
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    globalNetworkState.isOnline = true;
    // Si el error era por estar offline, limpiar automáticamente
    if (globalNetworkState.activeError?.type === "offline") {
      globalNetworkState.activeError = null;
    }
    notifyListeners();
  });

  window.addEventListener("offline", () => {
    globalNetworkState.isOnline = false;
    setGlobalNetworkError({
      type: "offline",
      title: "Sin conexión a Internet",
      message: "Se ha perdido la conexión a Internet. Verifique su red wifi o cable y vuelva a intentar.",
    });
    discreetLogger.logNetworkError({ url: window.location.pathname });
    notifyListeners();
  });
}

export interface FetchWithRetryOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  showGlobalBannerOnError?: boolean;
}

/**
 * Wrapper de fetch con detección inteligente de errores de red, HTTP 500 y HTTP 503,
 * registro discreto y soporte para reintento manual o automático.
 */
export async function aurenisFetch<T = any>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<{ data: T; response: Response }> {
  const {
    timeoutMs = 15000,
    retries = 0,
    retryDelayMs = 1000,
    showGlobalBannerOnError = true,
    ...fetchOptions
  } = options;

  const method = fetchOptions.method || "GET";

  // Verificar estado offline preliminar
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    const offlineErr: Omit<NetworkErrorInfo, "id" | "timestamp"> = {
      type: "offline",
      title: "Sin conexión a Internet",
      message: "No es posible comunicarse con el servidor mientras el dispositivo esté sin conexión.",
      url,
      retryAction: () => aurenisFetch<T>(url, options),
    };

    if (showGlobalBannerOnError) {
      setGlobalNetworkError(offlineErr);
    }
    discreetLogger.logNetworkError({ url, method });
    throw new Error("Sin conexión a Internet");
  }

  let attempt = 0;
  const maxAttempts = 1 + retries;

  while (attempt < maxAttempts) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: fetchOptions.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      // Manejo de códigos 500 y 503
      if (response.status === 500) {
        let errMessage = "Error interno en el servidor.";
        try {
          const body = await response.clone().json();
          if (body?.error) errMessage = body.error;
        } catch {}

        discreetLogger.logHttp500({
          url,
          method,
          status: 500,
          errorMessage: errMessage,
          retryAttempt: attempt > 1 ? attempt : undefined,
        });

        if (showGlobalBannerOnError) {
          setGlobalNetworkError({
            type: "server_500",
            status: 500,
            title: "Error del Servidor (500)",
            message: "El servidor encontró una condición inesperada al procesar la solicitud. Nuestro equipo técnico ha sido notificado.",
            url,
            retryAction: () => aurenisFetch<T>(url, options),
          });
        }

        const errorObj = new Error(errMessage) as any;
        errorObj.status = 500;
        errorObj.isServerError = true;
        throw errorObj;
      }

      if (response.status === 503) {
        let errMessage = "Servicio temporalmente no disponible (mantenimiento o alta carga).";
        try {
          const body = await response.clone().json();
          if (body?.error) errMessage = body.error;
        } catch {}

        discreetLogger.logHttp503({
          url,
          method,
          status: 503,
          errorMessage: errMessage,
          retryAttempt: attempt > 1 ? attempt : undefined,
        });

        if (showGlobalBannerOnError) {
          setGlobalNetworkError({
            type: "service_503",
            status: 503,
            title: "Servicio Temporalmente No Disponible (503)",
            message: "El sistema está en mantenimiento o bajo alta demanda. Por favor, reintente en unos instantes.",
            url,
            retryAction: () => aurenisFetch<T>(url, options),
          });
        }

        const errorObj = new Error(errMessage) as any;
        errorObj.status = 503;
        errorObj.isServiceUnavailable = true;
        throw errorObj;
      }

      // Si es exitoso o 2xx/3xx/4xx (los 4xx son errores de cliente que no ameritan banner de infraestructura)
      if (response.ok) {
        // Si había un error previo registrado para esta URL, limpiarlo
        if (globalNetworkState.activeError?.url === url) {
          clearGlobalNetworkError();
        }

        let data: T;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        return { data, response };
      }

      // Errores 4xx (400, 401, 403, 404, 422, etc.)
      let clientErrMsg = response.statusText || `Error HTTP ${response.status}`;
      try {
        const body = await response.clone().json();
        if (body?.error) clientErrMsg = body.error;
      } catch {}

      discreetLogger.logHttpError({
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        errorMessage: clientErrMsg,
      });

      const clientErr = new Error(clientErrMsg) as any;
      clientErr.status = response.status;
      throw clientErr;
    } catch (error: any) {
      clearTimeout(timeoutId);

      const isAbortTimeout = error?.name === "AbortError";
      const isNetworkFail =
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError") ||
        error?.message?.includes("fetch failed") ||
        isAbortTimeout;

      if (isNetworkFail) {
        const errType: ConnectionErrorType = isAbortTimeout ? "network_timeout" : "generic_network";
        const title = isAbortTimeout ? "Tiempo de espera agotado" : "Error de Conexión de Red";
        const message = isAbortTimeout
          ? "El servidor tardó demasiado en responder. Verifique su conexión y reintente."
          : "No se pudo establecer comunicación con los servidores de Aurenis.";

        discreetLogger.logNetworkError({
          url,
          method,
          retryAttempt: attempt,
          errorMessage: error.message,
        });

        if (attempt < maxAttempts) {
          await new Promise((res) => setTimeout(res, retryDelayMs * attempt));
          continue;
        }

        if (showGlobalBannerOnError) {
          setGlobalNetworkError({
            type: errType,
            title,
            message,
            url,
            retryAction: () => aurenisFetch<T>(url, options),
          });
        }
      }

      throw error;
    }
  }

  throw new Error("No se pudo completar la solicitud");
}

/**
 * Hook de React para consumir y controlar el estado de la conexión
 */
export function useNetworkStatus() {
  const [state, setState] = useState<NetworkState>(() => ({ ...globalNetworkState }));
  const [isSuccessRecovered, setIsSuccessRecovered] = useState(false);

  useEffect(() => {
    const handler = (newState: NetworkState) => {
      setState(newState);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const retryLastRequest = useCallback(async () => {
    if (!state.activeError?.retryAction) {
      // Reintento genérico: recargar o refrescar si no hay handler específico
      globalNetworkState.isRetrying = true;
      notifyListeners();
      try {
        const check = await fetch("/api/health", { method: "HEAD", cache: "no-store" }).catch(() => null);
        if (check && (check.ok || check.status < 500)) {
          clearGlobalNetworkError();
          setIsSuccessRecovered(true);
          setTimeout(() => setIsSuccessRecovered(false), 4000);
        }
      } finally {
        globalNetworkState.isRetrying = false;
        notifyListeners();
      }
      return;
    }

    globalNetworkState.isRetrying = true;
    notifyListeners();

    try {
      await state.activeError.retryAction();
      clearGlobalNetworkError();
      setIsSuccessRecovered(true);
      setTimeout(() => setIsSuccessRecovered(false), 4000);
      discreetLogger.logRetrySuccess({ url: state.activeError.url });
    } catch (err: any) {
      // Si falla nuevamente, actualizar estado
      discreetLogger.logNetworkError({
        url: state.activeError.url,
        errorMessage: err.message,
      });
    } finally {
      globalNetworkState.isRetrying = false;
      notifyListeners();
    }
  }, [state.activeError]);

  const dismissError = useCallback(() => {
    clearGlobalNetworkError();
  }, []);

  /**
   * Simulador de errores para pruebas y verificación visual
   */
  const simulateError = useCallback((type: ConnectionErrorType) => {
    const errorMap: Record<ConnectionErrorType, Omit<NetworkErrorInfo, "id" | "timestamp">> = {
      offline: {
        type: "offline",
        title: "Sin conexión a Internet",
        message: "No hay conexión de red disponible en este momento. Verifique su red wifi o móvil.",
        retryAction: async () => {
          await new Promise((r) => setTimeout(r, 900));
        },
      },
      server_500: {
        type: "server_500",
        status: 500,
        title: "Error Interno del Servidor (500)",
        message: "El servidor de Aurenis experimentó una excepción imprevista. El equipo técnico ha sido alertado.",
        url: "/api/schools/current/evaluations",
        retryAction: async () => {
          await new Promise((r) => setTimeout(r, 900));
        },
      },
      service_503: {
        type: "service_503",
        status: 503,
        title: "Servicio en Mantenimiento o No Disponible (503)",
        message: "La plataforma se encuentra en actualización de servicios programada. Por favor, reintente en breves minutos.",
        url: "/api/grades/bulk-publish",
        retryAction: async () => {
          await new Promise((r) => setTimeout(r, 900));
        },
      },
      network_timeout: {
        type: "network_timeout",
        title: "Tiempo de Espera Agotado",
        message: "La solicitud tardó más de 15 segundos en responder. Compruebe la latencia de su conexión.",
        url: "/api/students/report",
        retryAction: async () => {
          await new Promise((r) => setTimeout(r, 900));
        },
      },
      generic_network: {
        type: "generic_network",
        title: "Fallo de Comunicación con el Servidor",
        message: "No fue posible conectar con el servidor remoto. Compruebe su conexión a la red.",
        url: "/api/v1/sync",
        retryAction: async () => {
          await new Promise((r) => setTimeout(r, 900));
        },
      },
    };

    const err = errorMap[type];
    setGlobalNetworkError(err);
    if (type === "server_500") {
      discreetLogger.logHttp500({ url: err.url, status: 500, errorMessage: err.message });
    } else if (type === "service_503") {
      discreetLogger.logHttp503({ url: err.url, status: 503, errorMessage: err.message });
    } else {
      discreetLogger.logNetworkError({ url: err.url, errorMessage: err.message });
    }
  }, []);

  return {
    isOnline: state.isOnline,
    activeError: state.activeError,
    isRetrying: state.isRetrying,
    isSuccessRecovered,
    retryLastRequest,
    dismissError,
    simulateError,
    hasConnectionIssue: !state.isOnline || state.activeError !== null,
  };
}
