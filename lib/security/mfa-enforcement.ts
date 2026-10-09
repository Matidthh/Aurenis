/**
 * ============================================================================
 * AURENIS — SERVICIO DE ENFORCEMIENTOS MFA Y STEP-UP AUTHENTICATION
 * ============================================================================
 * Autores: Maicol R. (Backend Lead) & Frank M. (Seguridad Institucional)
 * 
 * Misión:
 * 1. Evalúa si una acción de alto privilegio requiere verificación multifactor (MFA/TOTP).
 * 2. Verifica si el rol (ej. SCHOOL_ADMIN) exige MFA obligatorio.
 * ============================================================================
 */

import { verifyTotpCode } from "@/lib/security/totp";

export interface MfaEnforcementCheckInput {
  roleName: string;
  isMfaEnabledForUser: boolean;
  totpCode?: string;
  totpSecret?: string;
}

export interface MfaEnforcementResult {
  allowed: boolean;
  requiresMfaSetup: boolean;
  requiresMfaChallenge: boolean;
  reason?: string;
}

/**
 * Determina si el usuario debe superar un desafío MFA o configurar TOTP según su rol y estado.
 */
export async function enforceMfaPolicy(input: MfaEnforcementCheckInput): Promise<MfaEnforcementResult> {
  const privilegedRoles = ["SCHOOL_ADMIN", "SYSTEM_ADMIN"];
  const isPrivileged = privilegedRoles.includes(input.roleName);

  // Si es un rol directivo/admin, exigimos MFA obligatorio
  if (isPrivileged && !input.isMfaEnabledForUser) {
    return {
      allowed: false,
      requiresMfaSetup: true,
      requiresMfaChallenge: false,
      reason: "Las políticas de seguridad institucionales exigen la activación de Autenticación de Doble Factor (MFA) para cuentas administrativas.",
    };
  }

  // Si tiene MFA habilitado pero no envió código TOTP en una acción crítica
  if (input.isMfaEnabledForUser && !input.totpCode) {
    return {
      allowed: false,
      requiresMfaSetup: false,
      requiresMfaChallenge: true,
      reason: "Se requiere ingresar el código de verificación de su aplicación autenticadora (MFA).",
    };
  }

  // Si envió código TOTP, verificarlo criptográficamente
  if (input.isMfaEnabledForUser && input.totpCode && input.totpSecret) {
    const verification = await verifyTotpCode({
      secret: input.totpSecret,
      code: input.totpCode,
      userId: "user-mfa-check",
    });

    if (!verification.valid) {
      return {
        allowed: false,
        requiresMfaSetup: false,
        requiresMfaChallenge: true,
        reason: "Código de verificación MFA inválido o expirado.",
      };
    }
  }

  return {
    allowed: true,
    requiresMfaSetup: false,
    requiresMfaChallenge: false,
  };
}
