import { Redis } from "@upstash/redis";

/**
 * Módulo Distribuido de Revocación de Sesiones y JWT (Blacklist)
 * Autores: Maicol R. & Frank M.
 * Sec-Find-003 Remediation: Integración con Upstash Redis para sincronización inmediata
 * entre múltiples réplicas (Instance A y Instance B), con fallback en memoria y
 * comportamiento fail-closed ante fallos de infraestructura para operaciones de seguridad.
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
  console.warn("[SESSION_REVOCATION] No se pudo inicializar Redis Upstash. Usando fallback en memoria.", err);
}

// Fallback local en memoria
const inMemoryRevokedTokens = new Map<string, number>();

function cleanupMemoryTokens() {
  const now = Date.now();
  for (const [key, expiry] of inMemoryRevokedTokens.entries()) {
    if (now >= expiry) {
      inMemoryRevokedTokens.delete(key);
    }
  }
}

export async function revokeToken(jti: string, userId: string, expiresAt: Date): Promise<void> {
  if (!jti) return;
  const now = Date.now();
  const ttlSeconds = Math.max(60, Math.ceil((expiresAt.getTime() - now) / 1000));

  // 1. Almacenar en Redis si está disponible
  if (redisClient) {
    try {
      await redisClient.set(`revoked:jti:${jti}`, "1", { ex: ttlSeconds });
    } catch (err) {
      console.error("[SESSION_REVOCATION] Error al revocar token en Redis:", err);
    }
  }

  // 2. Almacenar en memoria local de respaldo
  cleanupMemoryTokens();
  inMemoryRevokedTokens.set(`jti:${jti}`, expiresAt.getTime());
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  if (!userId) return;
  const centinelKey = `user_all_${userId}`;
  const ttlSeconds = 7 * 24 * 60 * 60; // 7 días
  const expiryTime = Date.now() + ttlSeconds * 1000;

  if (redisClient) {
    try {
      await redisClient.set(`revoked:${centinelKey}`, "1", { ex: ttlSeconds });
    } catch (err) {
      console.error("[SESSION_REVOCATION] Error al revocar todas las sesiones de usuario en Redis:", err);
    }
  }

  inMemoryRevokedTokens.set(centinelKey, expiryTime);
}

export async function isTokenRevoked(jti: string, userId?: string): Promise<boolean> {
  if (!jti) return false;
  const now = Date.now();

  // 1. Consultar Redis distribuidamente si está disponible
  if (redisClient) {
    try {
      const isJtiRevoked = await redisClient.get(`revoked:jti:${jti}`);
      if (isJtiRevoked) return true;

      if (userId) {
        const isUserRevoked = await redisClient.get(`revoked:user_all_${userId}`);
        if (isUserRevoked) return true;
      }
    } catch (err) {
      console.error("[CRITICAL_SECURITY_ALERT] Redis down during token revocation check. Aplicando Fail-Closed por seguridad.", err);
      // Comportamiento Fail-Closed para operaciones críticas de seguridad:
      // Si la blacklist distribuida falla, ante la duda asumimos revocación/riesgo para evitar bypass por caída de infraestructura.
      return true;
    }
  }

  // 2. Fallback / Comprobación en memoria local
  cleanupMemoryTokens();
  const tokenExp = inMemoryRevokedTokens.get(`jti:${jti}`);
  if (tokenExp && now < tokenExp) {
    return true;
  }

  if (userId) {
    const userExp = inMemoryRevokedTokens.get(`user_all_${userId}`);
    if (userExp && now < userExp) {
      return true;
    }
  }

  return false;
}

export async function cleanupExpiredRevokedTokens(): Promise<number> {
  const initialSize = inMemoryRevokedTokens.size;
  cleanupMemoryTokens();
  return initialSize - inMemoryRevokedTokens.size;
}
