/**
 * Aurenis CORS Security Module
 * Políticas estrictas de Intercambio de Recursos de Origen Cruzado (CORS) restringidas a clientes autorizados.
 */

import { NextRequest, NextResponse } from "next/server";

// Orígenes autorizados por defecto para entornos locales, vistas previas e instancias institucionales
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

/**
 * Obtiene la lista completa de orígenes web autorizados desde variables de entorno y defaults.
 */
export function getAllowedOrigins(): string[] {
  const customOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const frontendUrl = process.env.FRONTEND_URL?.trim();

  const combined = new Set<string>([
    ...DEFAULT_ALLOWED_ORIGINS,
    ...(frontendUrl ? [frontendUrl] : []),
    ...customOrigins,
  ]);

  return Array.from(combined);
}

/**
 * Valida si un origen HTTP entrante está dentro de la lista blanca de orígenes autorizados.
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;

  const allowedOrigins = getAllowedOrigins();

  // Coincidencia exacta
  if (allowedOrigins.includes(origin)) return true;

  // Soporte para subdominios institucionales de Aurenis y plataformas cloud autorizadas (*.aurenis.app, *.run.app)
  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // Soporte seguro para subdominios institucionales de Aurenis (*.aurenis.app, *.aurenis.cl)
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".aurenis.app") ||
      hostname.endsWith(".aurenis.cl")
    ) {
      return true;
    }

    // Permitir el origen configurado en APP_URL si existe
    if (process.env.APP_URL) {
      try {
        if (new URL(process.env.APP_URL).hostname === hostname) return true;
      } catch {
        // Ignorar URL malformada
      }
    }
    if (process.env.NEXT_PUBLIC_APP_URL) {
      try {
        if (new URL(process.env.NEXT_PUBLIC_APP_URL).hostname === hostname) return true;
      } catch {
        // Ignorar URL malformada
      }
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Genera los encabezados CORS correspondientes según el origen de la solicitud.
 */
export function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const allowed = isOriginAllowed(requestOrigin);

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Version, X-Tenant-Id, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  // Solo si el origen está explícitamente en la lista blanca se autoriza el origen y las credenciales
  if (allowed && requestOrigin) {
    headers["Access-Control-Allow-Origin"] = requestOrigin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

/**
 * Maneja solicitudes OPTIONS de comprobación preliminar (Preflight) de CORS.
 */
export function handleCorsPreflight(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Si el origen no está permitido en un preflight, respondemos 403 Forbidden
  if (origin && !isOriginAllowed(origin)) {
    return NextResponse.json(
      { error: "Acceso CORS no autorizado para el origen especificado." },
      { status: 403, headers: corsHeaders }
    );
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
