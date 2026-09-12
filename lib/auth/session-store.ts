/**
 * Almacén de Sesiones y Control de Tokens
 * Maneja rotación de refresh tokens, detección de reuso, revocación granular e invalidación global por usuario (tras cambio de contraseña o logout)
 */

import { AuthCookiePayload, RefreshTokenRecord } from "@/types/auth";

class SessionStore {
  // Tokens individuales explícitamente revocados (jti -> timestamp de revocación)
  private revokedTokens = new Map<string, number>();

  // Familias de tokens comprometidas por reuso de refresh token
  private compromisedFamilies = new Set<string>();

  // Registro de refresh tokens activos y rotados (jti -> record)
  private refreshTokens = new Map<string, RefreshTokenRecord>();

  // Marcas temporales de revocación global por usuario (userId -> timestamp en ms)
  // Cualquier token emitido antes de este timestamp es automáticamente inválido
  private userRevocationTimestamps = new Map<string, number>();

  // Versiones de credenciales de usuario (userId -> version number)
  private userTokenVersions = new Map<string, number>();

  constructor() {
    // Tarea periódica de limpieza de registros expirados cada 30 minutos
    if (typeof setInterval !== "undefined") {
      const interval = setInterval(() => {
        this.cleanExpiredRecords();
      }, 30 * 60 * 1000);
      if (interval.unref) {
        interval.unref();
      }
    }
  }

  /**
   * Registra un nuevo refresh token en el almacén
   */
  public registerRefreshToken(record: Omit<RefreshTokenRecord, "isUsed" | "isRevoked">): void {
    this.refreshTokens.set(record.tokenId, {
      ...record,
      isUsed: false,
      isRevoked: false,
    });
  }

  /**
   * Ejecuta la rotación de un refresh token con detección estricta de reuso
   */
  public rotateRefreshToken(
    oldTokenId: string,
    newRecord: Omit<RefreshTokenRecord, "isUsed" | "isRevoked">
  ): {
    success: boolean;
    reuseDetected?: boolean;
    error?: string;
  } {
    const existing = this.refreshTokens.get(oldTokenId);

    // Si la familia ya fue marcada como comprometida
    if (newRecord.familyId && this.compromisedFamilies.has(newRecord.familyId)) {
      return {
        success: false,
        reuseDetected: true,
        error: "Familia de tokens revocada por motivos de seguridad.",
      };
    }

    // Caso 1: El token no existe o ya fue revocado directamente
    if (this.revokedTokens.has(oldTokenId)) {
      if (existing?.familyId) {
        this.compromisedFamilies.add(existing.familyId);
      }
      return {
        success: false,
        reuseDetected: true,
        error: "El token de refresco ya no es válido.",
      };
    }

    // Caso 2: DETECCIÓN DE REUSO DE TOKEN (Token Reuse Detection)
    // Si el token existe y ya había sido utilizado previamente, alguien intentó reutilizarlo
    if (existing && existing.isUsed) {
      console.warn(
        `🚨 [Seguridad] Detección de reuso de token: ${oldTokenId} en familia: ${existing.familyId} para usuario: ${existing.userId}`
      );
      this.compromisedFamilies.add(existing.familyId);
      this.revokeAllUserSessions(existing.userId, "Detección de reuso de refresh token");

      return {
        success: false,
        reuseDetected: true,
        error:
          "Intento de reuso de token detectado. Todas las sesiones han sido revocadas inmediatamente por seguridad.",
      };
    }

    // Caso 3: Verificar si las sesiones del usuario fueron revocadas globalmente (ej. tras cambio de contraseña)
    if (newRecord.userId) {
      const userRevocation = this.isUserRevoked(newRecord.userId, existing?.issuedAt ? Math.floor(existing.issuedAt / 1000) : undefined);
      if (userRevocation.revoked) {
        return {
          success: false,
          error: userRevocation.reason || "La sesión fue revocada por cambio de credenciales.",
        };
      }
    }

    // Caso 4: Token válido no utilizado aún
    if (existing) {
      existing.isUsed = true;
      existing.replacedByTokenId = newRecord.tokenId;
    }

    // Registrar el nuevo token rotado en la misma familia
    this.registerRefreshToken(newRecord);

    return { success: true };
  }

  /**
   * Revoca un token específico (Access Token o Refresh Token)
   */
  public revokeToken(tokenId: string, reason = "Logout"): void {
    if (!tokenId) return;
    this.revokedTokens.set(tokenId, Date.now());

    const ref = this.refreshTokens.get(tokenId);
    if (ref) {
      ref.isRevoked = true;
    }
  }

  /**
   * Revoca una familia completa de tokens
   */
  public revokeFamily(familyId: string): void {
    if (!familyId) return;
    this.compromisedFamilies.add(familyId);
  }

  /**
   * Invalida todas las sesiones de un usuario (usado en cambio de contraseña o revocación forzada)
   */
  public revokeAllUserSessions(userId: string, reason = "Cambio de contraseña o revocación global"): void {
    if (!userId) return;

    const now = Date.now();
    this.userRevocationTimestamps.set(userId, now);

    // Incrementar versión del token de usuario
    const currentVersion = this.userTokenVersions.get(userId) || 1;
    this.userTokenVersions.set(userId, currentVersion + 1);

    // Marcar como revocados todos los refresh tokens de este usuario
    for (const [tokenId, record] of this.refreshTokens.entries()) {
      if (record.userId === userId) {
        record.isRevoked = true;
        this.revokedTokens.set(tokenId, now);
      }
    }

    console.info(`🔒 [Seguridad] Todas las sesiones del usuario ${userId} han sido invalidadas. Razón: ${reason}`);
  }

  /**
   * Obtiene la versión actual del token de un usuario
   */
  public getUserTokenVersion(userId: string): number {
    return this.userTokenVersions.get(userId) || 1;
  }

  /**
   * Comprueba si un token ha sido revocado o si pertenece a una sesión/familia invalidada
   */
  public isTokenRevoked(payload: AuthCookiePayload): { revoked: boolean; reason?: string } {
    // 1. Verificación por Token ID individual
    if (payload.tokenId && this.revokedTokens.has(payload.tokenId)) {
      return { revoked: true, reason: "El token fue revocado explícitamente" };
    }

    // 2. Verificación por Familia comprometida
    if (payload.familyId && this.compromisedFamilies.has(payload.familyId)) {
      return { revoked: true, reason: "La familia de sesión fue invalidada por reuso de token" };
    }

    // 3. Verificación de Refresh Token específico
    if (payload.tokenId && payload.tokenType === "refresh") {
      const record = this.refreshTokens.get(payload.tokenId);
      if (record && (record.isRevoked || record.isUsed)) {
        return { revoked: true, reason: "El token de refresco ya fue utilizado o revocado" };
      }
    }

    // 4. Verificación de Revocación Global de Usuario (ej. tras cambio de contraseña)
    if (payload.sub) {
      const userCheck = this.isUserRevoked(payload.sub, payload.iat, payload.tokenVersion);
      if (userCheck.revoked) {
        return userCheck;
      }
    }

    return { revoked: false };
  }

  /**
   * Verifica si un usuario específico fue revocado globalmente
   */
  public isUserRevoked(
    userId: string,
    iatSeconds?: number,
    tokenVersion?: number
  ): { revoked: boolean; reason?: string } {
    const userRevokedAt = this.userRevocationTimestamps.get(userId);
    if (userRevokedAt && iatSeconds) {
      const tokenIssuedAtMs = iatSeconds * 1000;
      if (tokenIssuedAtMs < userRevokedAt - 1000) {
        return {
          revoked: true,
          reason: "La sesión fue revocada tras un cambio de contraseña o cierre masivo de sesiones",
        };
      }
    }

    if (tokenVersion !== undefined) {
      const currentVersion = this.getUserTokenVersion(userId);
      if (tokenVersion < currentVersion) {
        return {
          revoked: true,
          reason: "La versión de credenciales del usuario ha sido actualizada",
        };
      }
    }

    return { revoked: false };
  }

  /**
   * Limpia registros de memoria que ya han expirado
   */
  private cleanExpiredRecords(): void {
    const now = Date.now();

    for (const [tokenId, record] of this.refreshTokens.entries()) {
      if (record.expiresAt < now) {
        this.refreshTokens.delete(tokenId);
        this.revokedTokens.delete(tokenId);
      }
    }
  }

  /**
   * Método para pruebas y reseteo
   */
  public clearAllForTesting(): void {
    this.revokedTokens.clear();
    this.compromisedFamilies.clear();
    this.refreshTokens.clear();
    this.userRevocationTimestamps.clear();
    this.userTokenVersions.clear();
  }
}

// Exportar instancia singleton
export const sessionStore = new SessionStore();
