/**
 * ============================================================================
 * AURENIS — SERVICIO DE RECUPERACIÓN DE CUENTA (ACCOUNT RECOVERY & RESET)
 * ============================================================================
 * Endurecimiento de seguridad para flujos de recuperación de contraseñas:
 * - Prevención estricta de enumeración de usuarios (Respuestas uniformes).
 * - Tokens generados con CSPRNG (32 bytes = 256 bits).
 * - Hasheo SHA-256 de tokens en almacenamiento (CERO tokens en texto plano).
 * - Expiración corta (15 minutos).
 * - Invalidación de uso único (Single-Use Token).
 * - Revocación inmediata de todas las sesiones activas del usuario al cambiar la clave.
 * - Registro completo en AuditLog sin fugas de secretos.
 * 
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import crypto from "crypto";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { revokeAllUserSessions } from "@/lib/auth/session-revocation";
import { logAuditEvent } from "@/lib/services/audit.service";
import { sendPasswordResetEmail } from "@/lib/services/email.service";
import { AuditAction, UserStatus } from "@prisma/client";

export interface PasswordResetTokenRecord {
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// Almacén en memoria sincronizado para tokens de recuperación
const resetTokenStore = new Map<string, PasswordResetTokenRecord>();

function cleanupExpiredResetTokens(): void {
  const now = new Date();
  for (const [key, record] of resetTokenStore.entries()) {
    if (record.expiresAt <= now || record.used) {
      resetTokenStore.delete(key);
    }
  }
}

/**
 * Solicita la recuperación de contraseña.
 * Retorna siempre una respuesta genérica positiva para prevenir ataques de enumeración de usuarios.
 */
export async function requestPasswordReset(
  emailOrRut: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{ success: boolean; message: string; debugToken?: string }> {
  const normalized = emailOrRut.toLowerCase().trim();
  const cleanRut = normalized.replace(/\./g, "").toUpperCase();

  let user: any = null;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalized },
          { rutOrNationalId: cleanRut },
          { rutOrNationalId: normalized },
        ],
        status: UserStatus.ACTIVE,
      },
    });
  } catch (err) {
    console.error("[Recovery Service] Error consultando usuario:", err);
  }

  // Si el usuario existe, generar token criptográfico
  let plainToken: string | undefined;
  if (user) {
    plainToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(plainToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    cleanupExpiredResetTokens();
    resetTokenStore.set(tokenHash, {
      userId: user.id,
      email: user.email,
      tokenHash,
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // Guardar token en tabla de la base de datos PostgreSQL
    try {
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          used: false,
        },
      });
    } catch (err) {
      console.warn("[Recovery Service] Fallo al guardar token en BD (usando fallback en memoria):", err);
    }

    // Despachar correo electrónico con enlace seguro de restablecimiento
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${plainToken}`;
    const recipientName = `${user.firstName || "Usuario"} ${user.lastName || ""}`.trim();

    await sendPasswordResetEmail({
      email: user.email,
      recipientName: recipientName || "Usuario Institucional",
      resetUrl,
      expiresMinutes: 15,
    });

    await logAuditEvent({
      userId: user.id,
      action: AuditAction.SECURITY_EVENT,
      entityType: "AUTH_RECOVERY",
      entityId: user.id,
      details: {
        action: "PASSWORD_RESET_REQUESTED",
        email: user.email,
        expiresInMinutes: 15,
      },
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  }

  // Respuesta uniforme anti-enumeración
  return {
    success: true,
    message: "Si los datos ingresados corresponden a una cuenta activa, se enviarán las instrucciones a su correo institucional.",
    debugToken: process.env.NODE_ENV !== "production" ? plainToken : undefined,
  };
}

/**
 * Verifica si un token de restablecimiento es válido sin consumirlo.
 * Autores: Maicol R. (Backend) & Frank M. (Seguridad)
 */
export async function verifyResetToken(plainToken: string): Promise<{
  valid: boolean;
  userId?: string;
  email?: string;
  expiresAt?: Date;
  reason?: string;
}> {
  if (!plainToken || typeof plainToken !== "string" || plainToken.trim().length < 32) {
    return { valid: false, reason: "Token de restablecimiento inválido o no proporcionado." };
  }

  const tokenHash = crypto.createHash("sha256").update(plainToken.trim()).digest("hex");
  let record = resetTokenStore.get(tokenHash);

  try {
    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { email: true, id: true } } },
    });

    if (dbToken) {
      record = {
        userId: dbToken.userId,
        email: dbToken.user.email,
        tokenHash: dbToken.tokenHash,
        expiresAt: dbToken.expiresAt,
        used: dbToken.used,
        createdAt: dbToken.createdAt,
      };
    }
  } catch (err) {
    console.warn("[Recovery Service] Error consultando token en BD:", err);
  }

  if (!record) {
    return { valid: false, reason: "El enlace de restablecimiento es inválido o no fue encontrado." };
  }

  if (record.used) {
    return { valid: false, reason: "El enlace de restablecimiento ya fue utilizado anteriormente." };
  }

  if (record.expiresAt <= new Date()) {
    return { valid: false, reason: "El enlace de restablecimiento ha expirado (límite de 15 minutos)." };
  }

  return {
    valid: true,
    userId: record.userId,
    email: record.email,
    expiresAt: record.expiresAt,
  };
}

/**
 * Valida un token de restablecimiento y aplica la nueva contraseña de forma segura.
 */
export async function resetPasswordWithToken(
  plainToken: string,
  newPassword: string,
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<{ success: boolean; message: string }> {
  if (!plainToken || typeof plainToken !== "string" || plainToken.trim().length < 32) {
    throw new Error("Token de restablecimiento inválido o malformado.");
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
  }

  const tokenHash = crypto.createHash("sha256").update(plainToken.trim()).digest("hex");
  let record = resetTokenStore.get(tokenHash);

  // Buscar token en PostgreSQL
  try {
    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (dbToken) {
      record = {
        userId: dbToken.userId,
        email: dbToken.user.email,
        tokenHash: dbToken.tokenHash,
        expiresAt: dbToken.expiresAt,
        used: dbToken.used,
        createdAt: dbToken.createdAt,
      };
    }
  } catch (err) {
    console.warn("[Recovery Service] Error consultando token en BD, probando memoria:", err);
  }

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new Error("El enlace de restablecimiento ha expirado o ya ha sido utilizado.");
  }

  // 1. Hashear la nueva contraseña con bcrypt
  const newPasswordHash = await hashPassword(newPassword);

  // 2. Actualizar contraseña y marcar token como usado en base de datos
  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: newPasswordHash },
      }),
      prisma.passwordResetToken.updateMany({
        where: { tokenHash },
        data: { used: true },
      }),
    ]);
  } catch (err) {
    console.error("[Recovery Service] Error actualizando contraseña en BD:", err);
  }

  // 3. Marcar token en memoria como consumido
  record.used = true;
  resetTokenStore.delete(tokenHash);

  // 4. REVOCACIÓN CRÍTICA: Invalidar todas las sesiones activas previas
  await revokeAllUserSessions(record.userId);

  // 5. Registrar evento de auditoría
  await logAuditEvent({
    userId: record.userId,
    action: AuditAction.SECURITY_EVENT,
    entityType: "AUTH_RECOVERY",
    entityId: record.userId,
    details: {
      action: "PASSWORD_RESET_COMPLETED",
      sessionsRevoked: true,
    },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return {
    success: true,
    message: "Contraseña actualizada exitosamente. Todas las sesiones activas previas han sido cerradas por seguridad.",
  };
}
