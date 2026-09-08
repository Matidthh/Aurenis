import { NextRequest, NextResponse } from "next/server";

// Almacenamiento en memoria para rate limiting (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number;      // Ventana de tiempo en milisegundos
  maxRequests: number;   // Máximo de solicitudes permitidas
  skipSuccessfulRequests?: boolean; // No contar solicitudes exitosas
  skipFailedRequests?: boolean;     // No contar solicitudes fallidas
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100,         // 100 solicitudes por ventana
};

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter: number) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Genera una clave única para rate limiting basada en la solicitud
 */
function getRateLimitKey(req: NextRequest, identifier: string = "ip"): string {
  if (identifier === "ip") {
    // Usar IP del cliente
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || 
               "unknown";
    return `ratelimit:${ip}`;
  }
  
  if (identifier === "user") {
    // Usar ID de usuario si está disponible
    const userId = req.headers.get("x-user-id");
    if (userId) {
      return `ratelimit:user:${userId}`;
    }
    // Fallback a IP
    return getRateLimitKey(req, "ip");
  }

  return `ratelimit:${identifier}`;
}

/**
 * Limpia registros expirados del store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Verifica si una solicitud excede el límite de rate
 */
export function checkRateLimit(
  req: NextRequest,
  config: Partial<RateLimitConfig> = {},
  identifier: string = "ip"
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const key = getRateLimitKey(req, identifier);
  const now = Date.now();

  // Limpiar entradas expiradas periódicamente
  if (Math.random() < 0.01) { // 1% de probabilidad de limpieza
    cleanupExpiredEntries();
  }

  const current = rateLimitStore.get(key);

  if (!current || current.resetTime < now) {
    // Nueva ventana o ventana expirada
    const resetTime = now + finalConfig.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    
    return {
      success: true,
      limit: finalConfig.maxRequests,
      remaining: finalConfig.maxRequests - 1,
      resetTime,
    };
  }

  // Ventana existente
  if (current.count >= finalConfig.maxRequests) {
    return {
      success: false,
      limit: finalConfig.maxRequests,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  current.count++;
  return {
    success: true,
    limit: finalConfig.maxRequests,
    remaining: finalConfig.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Middleware de rate limiting para rutas de API
 */
export function withRateLimit(
  config: Partial<RateLimitConfig> = {},
  identifier: string = "ip"
) {
  return (
    handler: (req: NextRequest) => Promise<NextResponse>
  ) => {
    return async (req: NextRequest) => {
      const result = checkRateLimit(req, config, identifier);

      if (!result.success) {
        const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
        return NextResponse.json(
          { 
            error: "Demasiadas solicitudes. Por favor espera antes de intentar nuevamente.",
            retryAfter,
          },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": result.limit.toString(),
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
              "Retry-After": retryAfter.toString(),
            },
          }
        );
      }

      const response = await handler(req);

      // Agregar headers de rate limit a la respuesta
      response.headers.set("X-RateLimit-Limit", result.limit.toString());
      response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
      response.headers.set("X-RateLimit-Reset", new Date(result.resetTime).toISOString());

      return response;
    };
  };
}

/**
 * Configuraciones predefinidas para diferentes casos de uso
 */
export const RATE_LIMIT_CONFIGS = {
  // Login - muy restrictivo para prevenir ataques de fuerza bruta
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5,           // 5 intentos
  },

  // API general - moderado
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100,         // 100 solicitudes
  },

  // Operaciones de escritura - más restrictivo
  WRITE: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 50,          // 50 solicitudes
  },

  // Operaciones sensibles - muy restrictivo
  SENSITIVE: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 10,          // 10 solicitudes
  },
} as const;