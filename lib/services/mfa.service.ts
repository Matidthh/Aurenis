/**
 * ============================================================================
 * AURENIS — SERVICIO MAESTRO DE AUTENTICACIÓN MULTIFACTOR (MFA TOTP)
 * ============================================================================
 * Gestiona el ciclo de vida completo de MFA para Administradores del Sistema:
 * - Estados: MFA_NOT_ENROLLED, MFA_PENDING, MFA_ENABLED.
 * - Cifrado AES-256-GCM para secretos TOTP en reposo.
 * - Hashing SHA-256 de un solo uso para Códigos de Recuperación.
 * - Prevención de ataques de repetición (Replay Prevention).
 * - Sanitización estricta de DTOs (CERO secretos en logs ni respuestas API públicas).
 * 
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import {
  generateTotpSecret,
  generateTotpUri,
  verifyTotpCode,
  generateRecoveryCodes,
  verifyRecoveryCode,
} from "@/lib/security/totp";
import { encryptField, decryptField } from "@/lib/security/encryption";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@prisma/client";

export type MfaStatus = "MFA_NOT_ENROLLED" | "MFA_PENDING" | "MFA_ENABLED";

export interface MfaRecord {
  userId: string;
  mfaStatus: MfaStatus;
  encryptedSecret?: string | null;
  pendingEncryptedSecret?: string | null;
  recoveryCodeHashes: string[];
  enrolledAt?: Date | null;
  lastUsedAt?: Date | null;
}

// Almacén persistente / Mock DB sincronizado en memoria
const mfaStore = new Map<string, MfaRecord>();

/**
 * Obtiene el registro MFA de un usuario
 */
export async function getMfaRecord(userId: string): Promise<MfaRecord> {
  const existing = mfaStore.get(userId);
  if (existing) {
    return existing;
  }

  const defaultRecord: MfaRecord = {
    userId,
    mfaStatus: "MFA_NOT_ENROLLED",
    encryptedSecret: null,
    pendingEncryptedSecret: null,
    recoveryCodeHashes: [],
    enrolledAt: null,
    lastUsedAt: null,
  };
  mfaStore.set(userId, defaultRecord);
  return defaultRecord;
}

/**
 * Obtiene el estado actual de enrolamiento MFA de un usuario
 */
export async function getUserMfaStatus(userId: string): Promise<MfaStatus> {
  const record = await getMfaRecord(userId);
  return record.mfaStatus;
}

/**
 * Inicia el proceso de enrolamiento MFA.
 * Genera un secreto TOTP nuevo y códigos de recuperación.
 * Cifra el secreto con AES-256-GCM y lo almacena en estado MFA_PENDING.
 * Retorna el secreto plano y recovery codes UNA SOLA VEZ.
 */
export async function startMfaEnrollment(
  userId: string,
  email: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{
  secret: string;
  otpAuthUri: string;
  recoveryCodes: string[];
  mfaStatus: "MFA_PENDING";
}> {
  const plainSecret = generateTotpSecret(20);
  const otpAuthUri = generateTotpUri({
    secret: plainSecret,
    accountName: email,
    issuer: "Aurenis",
  });

  const { plainCodes, hashedCodes } = generateRecoveryCodes(8);
  const encryptedSecret = encryptField(plainSecret);

  const record: MfaRecord = {
    userId,
    mfaStatus: "MFA_PENDING",
    encryptedSecret: null,
    pendingEncryptedSecret: encryptedSecret,
    recoveryCodeHashes: hashedCodes,
    enrolledAt: null,
    lastUsedAt: null,
  };

  mfaStore.set(userId, record);

  await logAuditEvent({
    userId,
    action: AuditAction.SECURITY_EVENT,
    entityType: "MFA",
    entityId: userId,
    details: {
      action: "MFA_ENROLL_STARTED",
      mfaStatus: "MFA_PENDING",
      recoveryCodesGenerated: 8,
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return {
    secret: plainSecret,
    otpAuthUri,
    recoveryCodes: plainCodes,
    mfaStatus: "MFA_PENDING",
  };
}

/**
 * Valida el código TOTP inicial para confirmar el enrolamiento y activar MFA_ENABLED.
 */
export async function verifyMfaEnrollment(
  userId: string,
  totpCode: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{ success: boolean; mfaStatus: "MFA_ENABLED" }> {
  const record = await getMfaRecord(userId);

  if (record.mfaStatus !== "MFA_PENDING" || !record.pendingEncryptedSecret) {
    throw new Error("No hay un proceso de enrolamiento MFA pendiente para esta cuenta.");
  }

  const plainSecret = decryptField(record.pendingEncryptedSecret);
  if (!plainSecret) {
    throw new Error("Error interno al descifrar el secreto de enrolamiento.");
  }

  const verification = await verifyTotpCode({
    secret: plainSecret,
    code: totpCode,
    userId,
    windowTolerance: 1,
    skipReplayCheck: true, // Durante enrolamiento solo se confirma configuración inicial
  });

  if (!verification.valid) {
    await logAuditEvent({
      userId,
      action: AuditAction.SECURITY_EVENT,
      entityType: "MFA",
      entityId: userId,
      details: {
        action: "MFA_ENROLL_FAILED",
        reason: verification.reason || "Código de verificación incorrecto",
      },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
    throw new Error(verification.reason || "Código TOTP inválido.");
  }

  // Activar formalmente MFA_ENABLED
  record.mfaStatus = "MFA_ENABLED";
  record.encryptedSecret = record.pendingEncryptedSecret;
  record.pendingEncryptedSecret = null;
  record.enrolledAt = new Date();
  record.lastUsedAt = new Date();
  mfaStore.set(userId, record);

  await logAuditEvent({
    userId,
    action: AuditAction.SECURITY_EVENT,
    entityType: "MFA",
    entityId: userId,
    details: {
      action: "MFA_ENROLL_SUCCESS",
      mfaStatus: "MFA_ENABLED",
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { success: true, mfaStatus: "MFA_ENABLED" };
}

/**
 * Verifica el segundo factor durante el login (TOTP o Recovery Code).
 */
export async function verifyMfaLogin(
  userId: string,
  codeOrRecovery: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{
  success: boolean;
  method: "totp" | "recovery_code";
  remainingRecoveryCodes?: number;
}> {
  const record = await getMfaRecord(userId);

  if (record.mfaStatus !== "MFA_ENABLED" || !record.encryptedSecret) {
    throw new Error("MFA no está habilitado para esta cuenta.");
  }

  const cleanInput = codeOrRecovery.trim();
  const isTotp = /^\d{6}$/.test(cleanInput);

  if (isTotp) {
    // 1. Verificación por TOTP de 6 dígitos
    const plainSecret = decryptField(record.encryptedSecret);
    if (!plainSecret) {
      throw new Error("Fallo de seguridad al descifrar el secreto TOTP.");
    }

    const verification = await verifyTotpCode({
      secret: plainSecret,
      code: cleanInput,
      userId,
      windowTolerance: 1,
    });

    if (!verification.valid) {
      await logAuditEvent({
        userId,
        action: AuditAction.SECURITY_EVENT,
        entityType: "MFA",
        entityId: userId,
        details: {
          action: "MFA_LOGIN_FAILED",
          method: "totp",
          reason: verification.reason || "Código TOTP incorrecto",
        },
        ipAddress: meta?.ipAddress,
        userAgent: meta?.userAgent,
      });
      throw new Error(verification.reason || "Código de verificación TOTP inválido o expirado.");
    }

    record.lastUsedAt = new Date();
    mfaStore.set(userId, record);

    await logAuditEvent({
      userId,
      action: AuditAction.LOGIN,
      entityType: "MFA",
      entityId: userId,
      details: {
        action: "MFA_LOGIN_SUCCESS",
        method: "totp",
      },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });

    return { success: true, method: "totp" };
  }

  // 2. Verificación por Código de Recuperación (Recovery Code)
  const matchedIndex = verifyRecoveryCode(cleanInput, record.recoveryCodeHashes);
  if (matchedIndex === -1) {
    await logAuditEvent({
      userId,
      action: AuditAction.SECURITY_EVENT,
      entityType: "MFA",
      entityId: userId,
      details: {
        action: "MFA_LOGIN_FAILED",
        method: "recovery_code",
        reason: "Código de recuperación inválido o ya utilizado",
      },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
    throw new Error("Código de recuperación inválido o ya consumido.");
  }

  // Invalidar código utilizado inmediatamente (Single-Use)
  record.recoveryCodeHashes.splice(matchedIndex, 1);
  record.lastUsedAt = new Date();
  mfaStore.set(userId, record);

  await logAuditEvent({
    userId,
    action: AuditAction.LOGIN,
    entityType: "MFA",
    entityId: userId,
    details: {
      action: "MFA_RECOVERY_USED",
      method: "recovery_code",
      remainingCodes: record.recoveryCodeHashes.length,
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return {
    success: true,
    method: "recovery_code",
    remainingRecoveryCodes: record.recoveryCodeHashes.length,
  };
}

/**
 * Desactiva MFA para una cuenta (Requiere autorización de SuperAdmin y Step-Up).
 */
export async function disableMfa(
  adminUserId: string,
  targetUserId: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{ success: boolean; message: string }> {
  const record = await getMfaRecord(targetUserId);

  record.mfaStatus = "MFA_NOT_ENROLLED";
  record.encryptedSecret = null;
  record.pendingEncryptedSecret = null;
  record.recoveryCodeHashes = [];
  record.enrolledAt = null;
  mfaStore.set(targetUserId, record);

  await logAuditEvent({
    userId: adminUserId,
    action: AuditAction.SECURITY_EVENT,
    entityType: "MFA",
    entityId: targetUserId,
    details: {
      action: "MFA_DISABLED",
      targetUserId,
      disabledBy: adminUserId,
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { success: true, message: "MFA desactivado exitosamente para el usuario." };
}

/**
 * Regenera nuevos códigos de recuperación para un usuario (Requiere Step-Up).
 */
export async function regenerateRecoveryCodes(
  userId: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{ recoveryCodes: string[] }> {
  const record = await getMfaRecord(userId);

  if (record.mfaStatus !== "MFA_ENABLED") {
    throw new Error("MFA debe estar habilitado para regenerar códigos de recuperación.");
  }

  const { plainCodes, hashedCodes } = generateRecoveryCodes(8);
  record.recoveryCodeHashes = hashedCodes;
  mfaStore.set(userId, record);

  await logAuditEvent({
    userId,
    action: AuditAction.SECURITY_EVENT,
    entityType: "MFA",
    entityId: userId,
    details: {
      action: "MFA_RECOVERY_REGENERATED",
      newCodesCount: 8,
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return { recoveryCodes: plainCodes };
}
