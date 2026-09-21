"use client";

/**
 * Aurenis Unified HTTP Client
 * Proporciona llamadas fetch enriquecidas con:
 * 1. Inyección automática del token 'Authorization: Bearer <token>' desde el almacenamiento de sesión.
 * 2. Manejo unificado de promesas, serialización JSON y tipado fuerte.
 * 3. Integración con resiliencia de red, reintentos y logging discreto.
 * 
 * Responsable de autoría: Malcom Marcelo (Arquitectura Core & Conexión HTTP REST)
 */

import { AUTH_STORAGE_KEYS } from "@/lib/auth/auth-context";
import { aurenisFetch, FetchWithRetryOptions } from "./network-status";
import { discreetLogger } from "./discreet-logger";
import { ApiSuccessResponse, ApiErrorResponse } from "./types";

export interface RequestOptions extends Omit<FetchWithRetryOptions, "body"> {
  token?: string | null;
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: any;
}

export interface ApiResponseWrapper<T = any> {
  data: T;
  rawResponse: Response;
  status: number;
  success: boolean;
  message?: string;
}

/**
 * Obtiene el token JWT actual disponible en el cliente de forma segura.
 */
export function getClientAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

/**
 * Construye URL con query parameters si existen
 */
function buildUrlWithParams(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      searchParams.append(key, String(val));
    }
  });
  const queryString = searchParams.toString();
  if (!queryString) return url;
  return url.includes("?") ? `${url}&${queryString}` : `${url}?${queryString}`;
}

/**
 * Cliente HTTP principal para consumir endpoints REST con Bearer Token automático
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponseWrapper<T>> {
  const {
    token,
    params,
    body,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  // 1. Resolver token de autorización
  const resolvedToken = token !== undefined ? token : getClientAuthToken();

  // 2. Preparar headers con Authorization: Bearer
  const headers = new Headers(customHeaders as HeadersInit);
  if (resolvedToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${resolvedToken}`);
  }

  // 3. Serializar body si es un objeto regular y establecer Content-Type
  let serializedBody: BodyInit | null | undefined = undefined;
  if (body !== undefined && body !== null) {
    if (
      typeof body === "string" ||
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer
    ) {
      serializedBody = body;
    } else {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      serializedBody = JSON.stringify(body);
    }
  }

  // 4. Preparar URL final con search params
  const fullUrl = buildUrlWithParams(endpoint, params);

  // 5. Ejecutar la llamada con aurenisFetch (reintentos, detección de fallos y logging)
  try {
    const { data, response } = await aurenisFetch<any>(fullUrl, {
      ...fetchOptions,
      headers,
      body: serializedBody,
    });

    // 6. Desenvolver payload estándar si la API usa { success: true, data: T }
    let unwrapData: T = data;
    let message: string | undefined = undefined;

    if (data && typeof data === "object") {
      if ("data" in data && data.success !== false) {
        unwrapData = data.data as T;
      }
      if ("message" in data && typeof data.message === "string") {
        message = data.message;
      }
    }

    return {
      data: unwrapData,
      rawResponse: response,
      status: response.status,
      success: response.ok,
      message,
    };
  } catch (error: any) {
    discreetLogger.logHttpError({
      url: fullUrl,
      method: fetchOptions.method || "GET",
      status: error?.status || 500,
      errorMessage: error?.message || "Error al procesar solicitud HTTP",
    });
    throw error;
  }
}

/**
 * Helper methods sintácticos para llamadas GET, POST, PUT, DELETE, PATCH
 */
export const apiClient = {
  get: <T = any>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "GET" }),

  post: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "POST", body }),

  put: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PUT", body }),

  patch: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "PATCH", body }),

  delete: <T = any>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
};
