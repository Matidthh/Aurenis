/**
 * ============================================================================
 * AURENIS — MOTOR DE CHALLENGE TOKENS Y STEP-UP AUTHENTICATION
 * ============================================================================
 * Maneja tokens efímeros y no privilegiados para:
 * 1. MFA Challenge (Login en dos pasos de SuperAdmin): Token de 5 minutos, de un solo uso.
 * 2. MFA Enrollment Challenge (Enrolamiento obligatorio): Token de 10 minutos para configuración inicial.
 * 3. Step-Up Token (Operaciones críticas): Token de 15 minutos que valida re-autenticación TOTP reciente.
 * 
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { getValidatedJwtSecret } from "@/lib/security/crypto-keys";
import { isTokenRevoked, revokeToken } from "@/lib/auth/session-revocation";

export const CHALLENGE_ISSUER = "aurenis-mfa-auth";
export const CHALLENGE_AUDIENCE = "aurenis-challenge";

export interface MfaChallengePayload {
  sub: string; // userId
  email: string;
  isSystemAdmin: boolean;
  purpose: "mfa_challenge" | "mfa_enrollment_challenge" | "step_up_auth";
  action?: string;
  jti: string;
  iat?: number;
  exp?: number;
}

/**
 * Emite un token de desafío MFA temporal de un solo uso (5 minutos).
 * Este token NO otorga acceso a rutas de sistema ni sesiones normales.
 */
export async function signMfaChallengeToken(params: {
  userId: string;
  email: string;
  isSystemAdmin: boolean;
  purpose?: "mfa_challenge" | "mfa_enrollment_challenge";
}): Promise<{ challengeToken: string; jti: string; expiresInSeconds: number }> {
  const secretKey = getValidatedJwtSecret();
  const jti = crypto.randomUUID();
  const purpose = params.purpose || "mfa_challenge";
  const expiresInSeconds = purpose === "mfa_challenge" ? 300 : 600; // 5m o 10m

  const token = await new SignJWT({
    sub: params.userId,
    email: params.email,
    isSystemAdmin: params.isSystemAdmin,
    purpose,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(CHALLENGE_ISSUER)
    .setAudience(CHALLENGE_AUDIENCE)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secretKey);

  return { challengeToken: token, jti, expiresInSeconds };
}

/**
 * Verifica y valida un challenge token. Comprueba firma, emisor, expiración y estado de revocación.
 */
export async function verifyMfaChallengeToken(
  token: string,
  expectedPurpose?: "mfa_challenge" | "mfa_enrollment_challenge"
): Promise<MfaChallengePayload | null> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return null;
  }

  try {
    const secretKey = getValidatedJwtSecret();
    const { payload } = await jwtVerify(token.trim(), secretKey, {
      algorithms: ["HS256"],
      issuer: CHALLENGE_ISSUER,
      audience: CHALLENGE_AUDIENCE,
    });

    const jti = (payload as any).jti;
    const userId = (payload as any).sub;
    const purpose = (payload as any).purpose;

    if (!userId || !jti) return null;

    if (expectedPurpose && purpose !== expectedPurpose) {
      return null;
    }

    // Verificar si el token ya fue revocado o consumido previamente (Single-Use Enforcement)
    if (await isTokenRevoked(jti, userId)) {
      return null;
    }

    return payload as unknown as MfaChallengePayload;
  } catch {
    return null;
  }
}

/**
 * Consume y revoca inmediatamente un challenge token para evitar reutilización (Single-Use).
 */
export async function consumeChallengeToken(jti: string, userId: string, expSeconds: number = 300): Promise<void> {
  const expiresAt = new Date(Date.now() + expSeconds * 1000);
  await revokeToken(jti, userId, expiresAt);
}

// ============================================================================
// STEP-UP AUTHENTICATION (Re-autenticación para Operaciones Sensibles)
// ============================================================================

export interface StepUpVerificationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Emite un token de Step-Up válido por 15 minutos tras verificar TOTP reciente.
 */
export async function signStepUpToken(params: {
  userId: string;
  action: string;
}): Promise<{ stepUpToken: string; jti: string; expiresInSeconds: number }> {
  const secretKey = getValidatedJwtSecret();
  const jti = crypto.randomUUID();
  const expiresInSeconds = 900; // 15 minutos

  const token = await new SignJWT({
    sub: params.userId,
    purpose: "step_up_auth",
    action: params.action,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(CHALLENGE_ISSUER)
    .setAudience(CHALLENGE_AUDIENCE)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds}s`)
    .sign(secretKey);

  return { stepUpToken: token, jti, expiresInSeconds };
}

/**
 * Verifica un token de Step-Up presentado para una acción sensible específica.
 */
export async function verifyStepUpToken(
  token: string,
  userId: string,
  requiredAction?: string
): Promise<StepUpVerificationResult> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return { allowed: false, reason: "Se requiere verificación de segundo factor reciente (Step-up token faltante)." };
  }

  try {
    const secretKey = getValidatedJwtSecret();
    const { payload } = await jwtVerify(token.trim(), secretKey, {
      algorithms: ["HS256"],
      issuer: CHALLENGE_ISSUER,
      audience: CHALLENGE_AUDIENCE,
    });

    const sub = (payload as any).sub;
    const purpose = (payload as any).purpose;
    const jti = (payload as any).jti;
    const action = (payload as any).action;

    if (sub !== userId) {
      return { allowed: false, reason: "El token de Step-up no pertenece al usuario autenticado." };
    }

    if (purpose !== "step_up_auth") {
      return { allowed: false, reason: "Propósito del token inválido para operación Step-up." };
    }

    if (jti && (await isTokenRevoked(jti, userId))) {
      return { allowed: false, reason: "El token de Step-up ha sido revocado o expirado." };
    }

    if (requiredAction && action && action !== requiredAction && action !== "*") {
      return { allowed: false, reason: "El token de Step-up no autoriza la acción requerida." };
    }

    return { allowed: true };
  } catch (err: any) {
    return { allowed: false, reason: "Token de Step-up inválido o expirado." };
  }
}
