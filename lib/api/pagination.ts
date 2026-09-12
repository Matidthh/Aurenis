/**
 * Utilidades y metadatos de paginación estandarizados para la API de Aurenis
 */

import { NextRequest } from "next/server";
import { PaginationInput, PaginationMeta, PaginationParams } from "./types";

/**
 * Construye metadatos de paginación normalizados y consistentes
 */
export function buildPaginationMeta(input: PaginationInput): PaginationMeta {
  const total = Math.max(0, Math.floor(input.total || 0));
  const limit = Math.max(1, Math.floor(input.limit || 20));
  
  let page: number;
  let offset: number;

  if (typeof input.offset === "number" && input.offset >= 0) {
    offset = Math.floor(input.offset);
    page = Math.floor(offset / limit) + 1;
  } else {
    page = Math.max(1, Math.floor(input.page || 1));
    offset = (page - 1) * limit;
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    offset,
  };
}

/**
 * Parsea y sanitiza parámetros de paginación desde requests, URLs o searchParams
 */
export function parsePaginationParams(
  input: NextRequest | URL | URLSearchParams | { page?: any; limit?: any; offset?: any } | undefined,
  defaultLimit = 20,
  maxLimit = 100
): PaginationParams {
  let rawPage: any;
  let rawLimit: any;
  let rawOffset: any;

  if (!input) {
    rawPage = 1;
    rawLimit = defaultLimit;
  } else if ("nextUrl" in input && input.nextUrl?.searchParams) {
    rawPage = input.nextUrl.searchParams.get("page");
    rawLimit = input.nextUrl.searchParams.get("limit");
    rawOffset = input.nextUrl.searchParams.get("offset");
  } else if ("searchParams" in input && input.searchParams instanceof URLSearchParams) {
    rawPage = input.searchParams.get("page");
    rawLimit = input.searchParams.get("limit");
    rawOffset = input.searchParams.get("offset");
  } else if (input instanceof URLSearchParams) {
    rawPage = input.get("page");
    rawLimit = input.get("limit");
    rawOffset = input.get("offset");
  } else if (typeof input === "object") {
    const obj = input as Record<string, any>;
    rawPage = obj.page;
    rawLimit = obj.limit;
    rawOffset = obj.offset;
  }

  let limit = parseInt(String(rawLimit || defaultLimit), 10);
  if (isNaN(limit) || limit < 1) limit = defaultLimit;
  if (limit > maxLimit) limit = maxLimit;

  let page = 1;
  let offset = 0;

  if (rawOffset !== undefined && rawOffset !== null && String(rawOffset).trim() !== "") {
    const parsedOffset = parseInt(String(rawOffset), 10);
    if (!isNaN(parsedOffset) && parsedOffset >= 0) {
      offset = parsedOffset;
      page = Math.floor(offset / limit) + 1;
    }
  } else if (rawPage !== undefined && rawPage !== null) {
    const parsedPage = parseInt(String(rawPage), 10);
    if (!isNaN(parsedPage) && parsedPage >= 1) {
      page = parsedPage;
      offset = (page - 1) * limit;
    }
  }

  return {
    page,
    limit,
    offset,
    skip: offset,
    take: limit,
  };
}

/**
 * Helper combinado para calcular paginación de Prisma y metadatos en un solo paso
 */
export function calculatePagination(
  total: number,
  pageOrParams?: number | { page?: any; limit?: any; offset?: any },
  limit?: number,
  offset?: number
): { meta: PaginationMeta; skip: number; take: number } {
  let parsed: PaginationParams;

  if (typeof pageOrParams === "object" && pageOrParams !== null) {
    parsed = parsePaginationParams(pageOrParams);
  } else {
    parsed = parsePaginationParams({
      page: pageOrParams,
      limit,
      offset,
    });
  }

  const meta = buildPaginationMeta({
    total,
    page: parsed.page,
    limit: parsed.limit,
    offset: parsed.offset,
  });

  return {
    meta,
    skip: parsed.skip,
    take: parsed.take,
  };
}
