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
import { ApiHttpError, parseApiError, extractZodFieldErrors } from "./api-error";

export { ApiHttpError, parseApiError, extractZodFieldErrors };

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

export interface SafeApiResponse<T = any> {
  data: T | null;
  error: ApiHttpError | null;
  success: boolean;
  status: number;
  message?: string;
  rawResponse?: Response;
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
    const apiError = parseApiError(error);

    discreetLogger.logHttpError({
      url: fullUrl,
      method: fetchOptions.method || "GET",
      status: apiError.status,
      errorMessage: apiError.userMessage || apiError.message,
    });

    throw apiError;
  }
}

/**
 * Ejecuta una petición HTTP capturando de forma segura cualquier excepción.
 * Retorna un objeto { data, error, success, status } garantizando CERO excepciones no capturadas.
 */
export async function safeRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<SafeApiResponse<T>> {
  try {
    const result = await request<T>(endpoint, options);
    return {
      data: result.data,
      error: null,
      success: true,
      status: result.status,
      message: result.message,
      rawResponse: result.rawResponse,
    };
  } catch (err: unknown) {
    const apiError = parseApiError(err);
    return {
      data: null,
      error: apiError,
      success: false,
      status: apiError.status,
      message: apiError.userMessage,
      rawResponse: apiError.rawResponse,
    };
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

  // Métodos seguros (Safe API) que nunca lanzan excepciones
  safeGet: <T = any>(url: string, options?: RequestOptions) =>
    safeRequest<T>(url, { ...options, method: "GET" }),

  safePost: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    safeRequest<T>(url, { ...options, method: "POST", body }),

  safePut: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    safeRequest<T>(url, { ...options, method: "PUT", body }),

  safePatch: <T = any>(url: string, body?: any, options?: RequestOptions) =>
    safeRequest<T>(url, { ...options, method: "PATCH", body }),

  safeDelete: <T = any>(url: string, options?: RequestOptions) =>
    safeRequest<T>(url, { ...options, method: "DELETE" }),
};
