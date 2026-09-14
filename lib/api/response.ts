/**
 * Estandarización de respuestas JSON para la API de Aurenis
 * Implementa el formato wrapper { success, data, meta, timestamp, message? }
 */

import { NextResponse } from "next/server";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginationInput,
  ResponseOptions,
  PaginatedResponseOptions,
  ApiMeta,
} from "./types";
import { buildPaginationMeta } from "./pagination";
import { stripSensitiveFields, redactPiiInString } from "../security/redaction";
import { applySecurityHeaders } from "../security/headers";

/**
 * Patrones que indican fuga de información técnica interna o stack traces
 */
const TECHNICAL_LEAK_PATTERNS = [
  /(\bat\s+(?:async\s+)?[a-zA-Z0-9_$.<>]+\s*\([^)]*\))/i, // Stack traces (at Function.name ...)
  /(\bat\s+[/\\][a-zA-Z0-9_.-]+)/i, // Stack traces con rutas (at /app/...)
  /(__webpack_modules__|__webpack_require__|segment-explorer-node)/i, // Webpack internals
  /(PrismaClient|SQLSTATE|PostgreSQL|pg_catalog|relation\s+"[^"]+"\s+does\s+not\s+exist)/i, // DB internals
  /(TypeError:\s+|ReferenceError:\s+|SyntaxError:\s+|RangeError:\s+|UnhandledPromiseRejection)/i, // Raw JS errors
  /(\/app\/applet\/node_modules|\/node_modules\/|[a-zA-Z]:\\[a-zA-Z0-9_\\-]+)/i, // Internal filesystem paths
  /(postgresql:\/\/|mysql:\/\/|mongodb:\/\/)/i, // Connection strings
];

/**
 * Sanitiza mensajes de error para evitar la fuga de tecnologías internas, rutas o stack traces.
 */
export function sanitizeErrorMessage(message: unknown, code?: string): string {
  if (typeof message !== "string" || !message.trim()) {
    return "Ha ocurrido un error inesperado al procesar la solicitud.";
  }

  const isProduction = process.env.NODE_ENV === "production";
  const hasTechnicalLeak = TECHNICAL_LEAK_PATTERNS.some((pattern) => pattern.test(message));

  // En producción o si contiene fugas técnicas graves, transformar en mensaje genérico y amigable
  if (hasTechnicalLeak || (isProduction && code === "INTERNAL_ERROR")) {
    return "Ha ocurrido un error interno en el servidor. Por favor, intente nuevamente más tarde.";
  }

  return redactPiiInString(message);
}

/**
 * Sanitiza detalles de error para asegurar que nunca se expongan stack traces ni datos sensibles.
 */
export function sanitizeErrorDetails(details: any): any {
  if (details === undefined || details === null) {
    return undefined;
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Si es una instancia de Error
  if (details instanceof Error) {
    if (isProduction) {
      return {
        name: "ApplicationError",
        message: sanitizeErrorMessage(details.message),
      };
    }
    return {
      name: details.name,
      message: sanitizeErrorMessage(details.message),
      // En desarrollo se puede conservar el stack sanitizado, en prod nunca
    };
  }

  let cleaned = stripSensitiveFields(details);

  // En producción, eliminar estrictamente cualquier propiedad 'stack', 'stackTrace', o 'trace'
  if (isProduction && typeof cleaned === "object") {
    if (Array.isArray(cleaned)) {
      cleaned = cleaned.map((item) => sanitizeErrorDetails(item));
    } else {
      const { stack, stackTrace, trace, fileName, lineNumber, columnNumber, ...rest } = cleaned;
      cleaned = rest;
    }
  }

  return cleaned;
}

/**
 * Genera el payload formateado para respuestas exitosas
 */
export function formatSuccessResponse<T>(
  data: T,
  options?: ResponseOptions
): ApiSuccessResponse<T> {
  const sanitizedData = stripSensitiveFields(data);

  const response: ApiSuccessResponse<T> = {
    success: true,
    data: sanitizedData,
    timestamp: new Date().toISOString(),
  };

  if (options?.message) {
    response.message = options.message;
  }

  if (options?.meta && Object.keys(options.meta).length > 0) {
    response.meta = stripSensitiveFields(options.meta);
  }

  return response;
}

/**
 * Genera el payload formateado para respuestas paginadas
 */
export function formatPaginatedResponse<T>(
  items: T[],
  pagination: PaginationInput,
  options?: PaginatedResponseOptions
): ApiSuccessResponse<T[]> {
  const paginationMeta = buildPaginationMeta(pagination);

  const combinedMeta: ApiMeta = {
    pagination: paginationMeta,
    ...(options?.meta || {}),
  };

  return formatSuccessResponse(items, {
    ...options,
    meta: combinedMeta,
  });
}

/**
 * Genera el payload formateado para respuestas con error
 */
export function formatErrorResponse(
  message: string,
  code: string = "INTERNAL_ERROR",
  options?: { details?: any; meta?: Record<string, any> }
): ApiErrorResponse {
  const safeMessage = sanitizeErrorMessage(message, code);
  const safeDetails = sanitizeErrorDetails(options?.details);

  const response: ApiErrorResponse = {
    success: false,
    error: safeMessage,
    code,
    timestamp: new Date().toISOString(),
  };

  if (safeDetails !== undefined) {
    response.details = safeDetails;
  }

  if (options?.meta && Object.keys(options.meta).length > 0) {
    response.meta = stripSensitiveFields(options.meta);
  }

  return response;
}

/**
 * Crea un NextResponse estándar con código 200 OK (o el indicado en status)
 */
export function apiSuccess<T>(
  data: T,
  options?: ResponseOptions
): NextResponse<ApiSuccessResponse<T>> {
  const status = options?.status ?? 200;
  const payload = formatSuccessResponse(data, options);
  
  const res = NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });

  return applySecurityHeaders(res);
}

/**
 * Crea un NextResponse estándar con código 201 CREATED
 */
export function apiCreated<T>(
  data: T,
  options?: Omit<ResponseOptions, "status">
): NextResponse<ApiSuccessResponse<T>> {
  return apiSuccess(data, {
    ...options,
    status: 201,
  });
}

/**
 * Crea un NextResponse estándar para colecciones paginadas
 */
export function apiPaginated<T>(
  items: T[],
  pagination: PaginationInput,
  options?: PaginatedResponseOptions
): NextResponse<ApiSuccessResponse<T[]>> {
  const status = options?.status ?? 200;
  const payload = formatPaginatedResponse(items, pagination, options);

  const res = NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });

  return applySecurityHeaders(res);
}

/**
 * Crea un NextResponse estándar para errores
 */
export function apiError(
  message: string,
  code: string = "INTERNAL_ERROR",
  options?: ResponseOptions & { statusCode?: number; details?: any }
): NextResponse<ApiErrorResponse> {
  const status = options?.statusCode ?? options?.status ?? 500;
  const payload = formatErrorResponse(message, code, {
    details: options?.details,
    meta: options?.meta,
  });

  const res = NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });

  return applySecurityHeaders(res);
}

/**
 * Crea un NextResponse estándar 204 No Content
 */
export function apiNoContent(headers?: HeadersInit): NextResponse {
  const res = new NextResponse(null, {
    status: 204,
    headers,
  });

  return applySecurityHeaders(res);
}
