/**
 * Aurenis Token Revocation & Invalidation Store
 * Gestiona la lista negra (blacklist) de tokens revocados tras el cierre de sesión (Logout),
 * rotación de credenciales y prevención de fijación de sesión.
 */

// Almacena tokens revocados mapeados a su fecha límite de expiración (Timestamp en ms)
const revokedTokensStore = new Map<string, number>();

// Intervalo de depuración de tokens cuya vigencia natural ya expiró
const REVOCATION_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRevocations() {
  const now = Date.now();
  if (now - lastCleanup < REVOCATION_CLEANUP_INTERVAL_MS) return;

  lastCleanup = now;
  for (const [token, expiry] of revokedTokensStore.entries()) {
    if (now >= expiry) {
      revokedTokensStore.delete(token);
    }
  }
}

/**
 * Registra un token en la lista de revocación inmediata.
 * @param token Token JWT completo o identificador JTI
 * @param ttlMs Tiempo de vida en ms durante el cual recordar la revocación (por defecto 7 días)
 */
export function revokeToken(token: string, ttlMs: number = 7 * 24 * 60 * 60 * 1000): void {
  if (!token) return;
  cleanupExpiredRevocations();

  const expiry = Date.now() + ttlMs;
  revokedTokensStore.set(token.trim(), expiry);
}

/**
 * Comprueba si un token ha sido revocado.
 */
export function isTokenRevoked(token: string): boolean {
  if (!token) return false;
  cleanupExpiredRevocations();

  const trimmed = token.trim();
  const expiry = revokedTokensStore.get(trimmed);
  if (!expiry) return false;

  if (Date.now() >= expiry) {
    revokedTokensStore.delete(trimmed);
    return false;
  }

  return true;
}

/**
 * Limpia todos los tokens revocados (útil para pruebas unitarias).
 */
export function clearRevocationStore(): void {
  revokedTokensStore.clear();
}
