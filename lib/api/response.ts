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

/**
 * Genera el payload formateado para respuestas exitosas
 */
export function formatSuccessResponse<T>(
  data: T,
  options?: ResponseOptions
): ApiSuccessResponse<T> {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (options?.message) {
    response.message = options.message;
  }

  if (options?.meta && Object.keys(options.meta).length > 0) {
    response.meta = options.meta;
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
  const response: ApiErrorResponse = {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  };

  if (options?.details !== undefined) {
    response.details = options.details;
  }

  if (options?.meta && Object.keys(options.meta).length > 0) {
    response.meta = options.meta;
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
  
  return NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });
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

  return NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });
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

  return NextResponse.json(payload, {
    status,
    headers: options?.headers,
  });
}

/**
 * Crea un NextResponse estándar 204 No Content
 */
export function apiNoContent(headers?: HeadersInit): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
