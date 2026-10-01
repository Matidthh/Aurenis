import { Redis } from "@upstash/redis";

/**
 * Aurenis Distributed Rate Limiter Module — Security Hardening Phase 3
 * Autores: Frank M. (QA/Seguridad), Maicol R. (Backend) y Malcom Marcelo (Frontend)
 * Características:
 * - Almacén compartido en Redis (Upstash) con fallback en memoria.
 * - Modo Fail-Closed estricto para operaciones críticas de autenticación (Login, MFA, Password Reset, Step-Up).
 * - Identificación compuesta: userId + IP o IP pura para solicitudes no autenticadas.
 */

let redisClient: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (err) {
  console.warn("[RATE_LIMIT] No se pudo inicializar cliente Redis Upstash. Usando fallback en memoria (Fail-Open/Fail-Closed según endpoint).", err);
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter: number;
  message?: string;
}

// Fallback en memoria si Redis no está disponible
const memoryStore = new Map<string, { timestamps: number[] }>();

export const RATE_LIMIT_CONFIGS = {
  LOGIN: {
    windowMs: 60 * 1000,
    max: 5,
    message: "Demasiados intentos de inicio de sesión. Por favor, espere un minuto.",
  },
  MFA_VERIFY: {
    windowMs: 180 * 1000, // 3 minutos
    max: 5,
    message: "Demasiados intentos de verificación de segundo factor (MFA). Cuenta temporalmente bloqueada por 3 minutos.",
  },
  MFA_ENROLL: {
    windowMs: 300 * 1000, // 5 minutos
    max: 5,
    message: "Demasiadas solicitudes de enrolamiento MFA. Por favor, intente más tarde.",
  },
  MFA_RECOVERY: {
    windowMs: 900 * 1000, // 15 minutos
    max: 3,
    message: "Límite de uso de códigos de recuperación excedido. Intente en 15 minutos.",
  },
  STEP_UP: {
    windowMs: 300 * 1000, // 5 minutos
    max: 5,
    message: "Demasiados intentos de re-autenticación Step-Up. Por favor, espere 5 minutos.",
  },
  API_GENERAL: {
    windowMs: 60 * 1000,
    max: 1000,
    message: "Límite de peticiones excedido.",
  },
  BULK_EXPORT: {
    windowMs: 60 * 1000,
    max: 10,
    message: "Demasiadas solicitudes de exportación masiva. Intente más tarde.",
  },
  PASSWORD_RESET: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Demasiadas solicitudes de recuperación de contraseña.",
  },
} as const;

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = RATE_LIMIT_CONFIGS.LOGIN
): Promise<RateLimitResult> {
  const windowSecs = Math.ceil(options.windowMs / 1000);
  const now = Date.now();
  const resetTime = Math.ceil((now + options.windowMs) / 1000);

  const isAuthEndpoint =
    key.startsWith("login:") ||
    key.startsWith("mfa:") ||
    key.startsWith("step_up:") ||
    key.startsWith("password_reset:");

  if (redisClient) {
    try {
      const redisKey = `ratelimit:${key}`;
      const currentCount = await redisClient.incr(redisKey);
      if (currentCount === 1) {
        await redisClient.expire(redisKey, windowSecs);
      }
      const allowed = currentCount <= options.max;
      const remaining = Math.max(0, options.max - currentCount);

      return {
        allowed,
        limit: options.max,
        remaining,
        resetTime,
        retryAfter: allowed ? 0 : windowSecs,
        message: allowed ? undefined : (options.message || "Límite de solicitudes excedido."),
      };
    } catch (err) {
      if (isAuthEndpoint) {
        console.error(
          "[CRITICAL_SECURITY_ALERT] Redis down during AUTH rate limit check. Applying Fail-Closed conservative local limit.",
          err
        );
      } else {
        console.warn("[RATE_LIMIT_REDIS_ERROR] Redis down for general endpoint. Applying Fail-Open fallback.", err);
      }
    }
  }

  // --- Fallback en memoria con política diferenciada ---
  const effectiveMax = isAuthEndpoint ? Math.min(options.max, 5) : options.max;
  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
  const currentCount = record.timestamps.length;
  const allowed = currentCount < effectiveMax;

  if (allowed) {
    record.timestamps.push(now);
  }

  const remaining = Math.max(0, effectiveMax - record.timestamps.length);

  return {
    allowed,
    limit: effectiveMax,
    remaining,
    resetTime,
    retryAfter: allowed ? 0 : windowSecs,
    message: allowed ? undefined : (options.message || "Límite de solicitudes de autenticación excedido por seguridad."),
  };
}

export function getClientIdentifier(
  req: { headers: { get: (name: string) => string | null } },
  userId?: string
): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  let ip = "127.0.0.1";

  if (forwardedFor) {
    ip = forwardedFor.split(",")[0].trim() || ip;
  } else {
    ip = req.headers.get("x-real-ip")?.trim() || req.headers.get("cf-connecting-ip")?.trim() || ip;
  }

  if (userId) {
    return `user:${userId}:${ip}`;
  }

  return `ip:${ip}`;
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetTime),
  };

  if (!result.allowed && result.retryAfter > 0) {
    headers["Retry-After"] = String(result.retryAfter);
  }

  return headers;
}

export async function resetRateLimit(key: string): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(`ratelimit:${key}`);
    } catch (err) {
      console.error("Error resetting rate limit in Redis:", err);
    }
  }
  memoryStore.delete(key);
}
