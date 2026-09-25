/**
 * Módulo de Revocación de Sesiones y JWT (Blacklist) - 100% Edge-Safe
 * Autores: Malcom Marcelo y Frank M.
 */

// Memoria compartida / cache rápido para middleware y runtime stateless
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
  cleanupMemoryTokens();
  inMemoryRevokedTokens.set(jti, expiresAt.getTime());
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  if (!userId) return;
  const centinelJti = `user_all_${userId}`;
  const futureExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  inMemoryRevokedTokens.set(centinelJti, futureExpiry);
}

export async function isTokenRevoked(jti: string, userId?: string): Promise<boolean> {
  if (!jti) return false;
  cleanupMemoryTokens();

  const now = Date.now();
  const tokenExp = inMemoryRevokedTokens.get(jti);
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


