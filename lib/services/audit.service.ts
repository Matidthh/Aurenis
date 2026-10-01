/**
 * ============================================================================
 * AURENIS — SERVICIO DE AUDITORÍA Y BITÁCORA DE SEGURIDAD (AUDIT LOGGING)
 * ============================================================================
 * Registra eventos críticos de seguridad, autenticación, MFA y control de acceso.
 * 
 * Regla Fundamental de Privacidad y Seguridad:
 * - CERO REGISTRO DE SECRETOS: Se sanitizan y purgan automáticamente campos
 *   como password, totp, secret, jwt, recoveryCode, cookie, etc.
 * 
 * Autores: Maicol R. (Backend) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import { AuditAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface LogAuditEventParams {
  schoolId?: string | null;
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "secret",
  "totp",
  "totpcode",
  "code",
  "recoverycode",
  "recoverycodes",
  "token",
  "jwt",
  "challengetoken",
  "stepuptoken",
  "authtag",
  "iv",
  "ciphertext",
  "session",
  "cookie",
]);

/**
 * Sanitiza recursivamente cualquier objeto o valor para remover información sensible antes de persistir
 */
export function sanitizeAuditDetails(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeAuditDetails(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = "[REDACTED_BY_SECURITY_POLICY]";
    } else if (typeof val === "object" && val !== null) {
      sanitized[key] = sanitizeAuditDetails(val);
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}

/**
 * Registra un evento en la bitácora de auditoría de manera segura y no bloqueante.
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    const safeDetails = params.details
      ? (sanitizeAuditDetails(params.details) as Prisma.InputJsonValue)
      : Prisma.DbNull;

    await prisma.auditLog.create({
      data: {
        schoolId: params.schoolId || null,
        userId: params.userId || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        details: safeDetails,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error("⚠️ Error no fatal registrando evento de auditoría:", error);
  }
}
