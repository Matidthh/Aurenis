/**
 * Aurenis Rate Limiter Module
 * Implementación en memoria con ventana deslizante (Sliding Window) para mitigación de ataques de fuerza bruta y DDoS.
 */

export interface RateLimitOptions {
  windowMs: number; // Duración de la ventana en milisegundos (ej. 60000 para 1 min)
  max: number; // Cantidad máxima de solicitudes permitidas en la ventana
  message?: string; // Mensaje devuelto al exceder el límite
  skipSuccessfulRequests?: boolean; // Opcional: ignorar peticiones exitosas
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Timestamp Unix en segundos
  retryAfter: number; // Segundos restantes para el desbloqueo
  message?: string;
}

interface RateLimitRecord {
  timestamps: number[];
  firstAttempt: number;
}

// Almacén en memoria indexado por clave
const rateLimitStore = new Map<string, RateLimitRecord>();

// Intervalo de limpieza periódica de registros antiguos
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

/**
 * Configuraciones predefinidas de limitación de tasa
 */
export const RATE_LIMIT_CONFIGS = {
  // Login: 5 intentos por minuto por IP/identificador para frenar fuerza bruta
  LOGIN: {
    windowMs: 60 * 1000,
    max: 5,
    message: "Demasiados intentos de inicio de sesión. Por favor, espere un minuto antes de reintentar.",
  },
  // API general: 100 peticiones por minuto
  API_GENERAL: {
    windowMs: 60 * 1000,
    max: 100,
    message: "Límite de peticiones de API excedido. Intente más tarde.",
  },
  // Recuperación de clave: 3 intentos cada 15 minutos
  PASSWORD_RESET: {
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: "Demasiadas solicitudes de recuperación. Intente en 15 minutos.",
  },
} as const;

/**
 * Verifica y registra un intento de solicitud bajo una clave específica.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = RATE_LIMIT_CONFIGS.LOGIN
): RateLimitResult {
  const now = Date.now();
  cleanupExpiredRecords(options.windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [], firstAttempt: now };
    rateLimitStore.set(key, record);
  }

  // Filtrar intentos dentro de la ventana de tiempo activa
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);

  const currentCount = record.timestamps.length;
  const allowed = currentCount < options.max;

  if (allowed) {
    // Registrar el timestamp actual
    record.timestamps.push(now);
  }

  const oldestTimestamp = record.timestamps[0] || now;
  const resetTimeMs = oldestTimestamp + options.windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));
  const remaining = Math.max(0, options.max - record.timestamps.length);

  return {
    allowed,
    limit: options.max,
    remaining,
    resetTime: Math.ceil(resetTimeMs / 1000),
    retryAfter: allowed ? 0 : retryAfterSeconds,
    message: allowed ? undefined : (options.message || "Límite de solicitudes excedido."),
  };
}

/**
 * Obtiene el estado actual de la tasa sin consumir un intento.
 */
export function peekRateLimit(
  key: string,
  options: RateLimitOptions = RATE_LIMIT_CONFIGS.LOGIN
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return {
      allowed: true,
      limit: options.max,
      remaining: options.max,
      resetTime: Math.ceil((now + options.windowMs) / 1000),
      retryAfter: 0,
    };
  }

  const validTimestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
  const currentCount = validTimestamps.length;
  const allowed = currentCount < options.max;
  const oldestTimestamp = validTimestamps[0] || now;
  const resetTimeMs = oldestTimestamp + options.windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));
  const remaining = Math.max(0, options.max - currentCount);

  return {
    allowed,
    limit: options.max,
    remaining,
    resetTime: Math.ceil(resetTimeMs / 1000),
    retryAfter: allowed ? 0 : retryAfterSeconds,
    message: allowed ? undefined : (options.message || "Límite de solicitudes excedido."),
  };
}

/**
 * Restablece los intentos para una clave dada (ej. tras un login exitoso).
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Extrae el identificador del cliente a partir de la cabecera IP de la petición NextRequest.
 */
export function getClientIdentifier(req: { headers: { get: (name: string) => string | null } }): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Construye encabezados HTTP estándar de limitación de tasa (RFC 6585 y draft IETF).
 */
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
