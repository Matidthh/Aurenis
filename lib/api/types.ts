/**
 * Tipos estandarizados para respuestas y paginación de la API de Aurenis
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  offset?: number;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  offset?: number;
  total: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  skip: number;
  take: number;
}

export interface ApiMeta {
  pagination?: PaginationMeta;
  [key: string]: any;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
  meta?: ApiMeta;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ResponseOptions {
  status?: number;
  headers?: HeadersInit;
  meta?: Record<string, any>;
  message?: string;
}

export interface PaginatedResponseOptions extends ResponseOptions {
  meta?: Record<string, any>;
}
