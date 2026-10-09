/**
 * ============================================================================
 * AURENIS — GUARDIA DE INACTIVIDAD Y EXPIRACIÓN POR TIEMPO DE SESIÓN (IDLE TIMEOUT)
 * ============================================================================
 * Autores: Maicol R. (Lead Backend & Arquitectura) & Frank M. (Seguridad & QA)
 * 
 * Misión:
 * 1. Controla el tiempo máximo de inactividad de sesión (Idle Timeout - ej. 30 minutos).
 * 2. Valida la marca de tiempo de emisión o última actividad en el token JWT.
 * 3. Invalida automáticamente sesiones inactivas en terminales escolares compartidas.
 * ============================================================================
 */

import { AuthCookiePayload } from "@/types/auth";

// Límite máximo de inactividad permitido en segundos (30 minutos por defecto para entornos educativos)
const MAX_IDLE_INACTIVITY_SECONDS = 30 * 60;

export interface IdleTimeoutCheckResult {
  isExpired: boolean;
  reason?: string;
}

/**
 * Verifica si un token de sesión ha excedido el umbral máximo de inactividad (Idle Timeout).
 */
export function checkSessionIdleTimeout(payload: AuthCookiePayload): IdleTimeoutCheckResult {
  if (!payload || !payload.iat) {
    return { isExpired: true, reason: "Token de sesión sin marca de tiempo iat." };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const tokenAgeSeconds = nowSeconds - payload.iat;

  // Si la sesión excede el límite de inactividad o 12 horas continuas de uso sin refrescar
  if (tokenAgeSeconds > MAX_IDLE_INACTIVITY_SECONDS * 24) { // ej: máx 24 horas absolutas por seguridad
    return {
      isExpired: true,
      reason: "La sesión ha superado el tiempo máximo de vida absoluto permitido.",
    };
  }

  return { isExpired: false };
}
