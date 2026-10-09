/**
 * ============================================================================
 * AURENIS — UPSTASH RATELIMIT MIDDLEWARE PARA RUTAS DE AUTENTICACIÓN (/api/auth/*)
 * ============================================================================
 * Autores: Maicol R. (Backend Lead) & Frank M. (Seguridad & QA)
 * 
 * Misión:
 * 1. Implementa rate limiting estricto basado en IP usando `@upstash/ratelimit`.
 * 2. Mitiga ataques de fuerza bruta en intentos de inicio de sesión y autenticación.
 * 3. Proporciona fallback robusto en memoria si Redis no está configurado.
 * ============================================================================
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { getClientIdentifier } from "./rate-limiter";

let ratelimitInstance: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // 5 solicitudes por cada ventana de 60 segundos por IP
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "aurenis_auth_rl",
    });
  }
} catch (err) {
  console.warn("[UPSTASH_RATELIMIT] No se pudo inicializar Upstash Ratelimit. Activando fallback local.", err);
}

// Fallback en memoria para desarrollo o entornos sin Redis configurado
const localMemoryStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Middleware de Rate Limiting para rutas /api/auth/*
 * Retorna NextResponse con HTTP 429 si se excede el límite de intentos fallidos.
 */
export async function enforceAuthRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const clientIp = getClientIdentifier(req);
  const identifier = `auth_ip_${clientIp}`;

  if (ratelimitInstance) {
    try {
      const { success, limit, remaining, reset } = await ratelimitInstance.limit(identifier);

      if (!success) {
        const retryAfterSecs = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: "Demasiados intentos de inicio de sesión desde esta IP. Cuenta/IP temporalmente bloqueada por seguridad.",
            code: "TOO_MANY_REQUESTS",
            retryAfter: Math.max(1, retryAfterSecs),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(reset),
              "Retry-After": String(Math.max(1, retryAfterSecs)),
            },
          }
        );
      }
      return null;
    } catch (err) {
      console.warn("[UPSTASH_RATELIMIT] Falló la verificación en Upstash. Usando fallback local.", err);
    }
  }

  // Fallback local en memoria
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 5;

  let record = localMemoryStore.get(identifier);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
    localMemoryStore.set(identifier, record);
  }

  record.count++;

  if (record.count > maxAttempts) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: "Demasiados intentos de inicio de sesión. IP temporalmente bloqueada por seguridad.",
        code: "TOO_MANY_REQUESTS",
        retryAfter: Math.max(1, retryAfter),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, retryAfter)),
        },
      }
    );
  }

  return null;
}
