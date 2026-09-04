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

/**
 * Registra un evento en la bitácora de auditoría.
 * Ejecuta de forma segura para no interrumpir el flujo principal de negocio.
 */
export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        schoolId: params.schoolId || null,
        userId: params.userId || null,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        details: (params.details as Prisma.InputJsonValue) || Prisma.DbNull,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
      },
    });
  } catch (error) {
    console.error("⚠️ Error no fatal registrando evento de auditoría:", error);
  }
}
