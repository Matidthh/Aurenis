import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@prisma/client";

/**
 * Servicio de Cumplimiento Ley 21.719 (Privacidad y Derechos ARCO / Supresión)
 * Autores: Carlos M. (Cumplimiento Legal) y Malcom Marcelo (Arquitectura)
 */

export interface RightToBeForgottenParams {
  studentId: string;
  requestId: string;
  requesterUserId: string;
  schoolId: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function executeRightToBeForgotten(
  tenantDb: TenantPrismaClient,
  params: RightToBeForgottenParams
): Promise<{ success: boolean; message: string }> {
  const { studentId, requestId, requesterUserId, schoolId, ipAddress, userAgent } = params;

  // 1. Verificar la existencia de la solicitud formal (DataSubjectRequest) con filtro estricto de schoolId (BOLA/IDOR prevention)
  const dsr = await tenantDb.dataSubjectRequest.findFirst({
    where: { id: requestId, schoolId },
  });

  if (!dsr || dsr.requestType !== "SUPPRESSION") {
    throw new Error("Solicitud de supresión (Derecho al Olvido) no encontrada o no pertenece a la institución.");
  }

  if (dsr.status !== "APPROVED_PENDING_EXECUTION") {
    throw new Error("La solicitud no cuenta con la aprobación en dos pasos requerida para su ejecución.");
  }

  // 2. Verificar que el solicitante sea Administrador de Colegio o Apoderado Legal vinculado
  const requesterMembership = await tenantDb.membership.findFirst({
    where: {
      userId: requesterUserId,
      schoolId,
      isActive: true,
    },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
      guardianProfile: {
        include: {
          students: {
            where: { studentProfileId: studentId },
          },
        },
      },
    },
  });

  if (!requesterMembership) {
    throw new Error("Acceso denegado: El solicitante no pertenece a la institución.");
  }

  const isAdmin = requesterMembership.role.name === "SCHOOL_ADMIN" || requesterMembership.role.isSystem;
  const isAuthorizedGuardian = requesterMembership.guardianProfile && requesterMembership.guardianProfile.students.length > 0;

  if (!isAdmin && !isAuthorizedGuardian) {
    throw new Error("No autorizado: Solo el apoderado legal del estudiante o un administrador pueden ejecutar la supresión.");
  }

  // 3. Ejecutar la anonimización / supresión segura cumpliendo Ley 21.719 con verificación estricta de pertenencia al tenant
  const student = await tenantDb.studentProfile.findFirst({
    where: {
      id: studentId,
      membership: { schoolId },
    },
    include: { membership: { include: { user: true } } },
  });

  if (!student) {
    throw new Error("Estudiante no encontrado o no pertenece a esta institución.");
  }

  const userId = student.membership.userId;

  // Transacción de anonimización
  await tenantDb.$transaction(async (tx) => {
    // Anonimizar perfil de usuario vinculado
    await tx.user.update({
      where: { id: userId },
      data: {
        firstName: "ANÓNIMO",
        lastName: "ANÓNIMO",
        email: `deleted_student_${studentId}@anonymized.local`,
        rutOrNationalId: null,
        phone: null,
        avatarUrl: null,
        status: "SUSPENDED",
      },
    });

    // Limpiar notas médicas y datos sensibles del perfil estudiantil
    await tx.studentProfile.update({
      where: { id: studentId },
      data: {
        medicalNotes: "[SUPRIMIDO POR DERECHO AL OLVIDO - LEY 21.719]",
        birthDate: null,
        enrollmentNumber: "ANON",
      },
    });

    // Actualizar estado de la solicitud a COMPLETED
    await tx.dataSubjectRequest.update({
      where: { id: requestId },
      data: {
        status: "COMPLETED",
        resolution: `Ejecutado exitosamente por usuario ${requesterUserId} bajo protocolo de doble confirmación.`,
      },
    });
  });

  // 4. Registrar en AuditLog con referencia cruzada
  await logAuditEvent({
    schoolId,
    userId: requesterUserId,
    action: AuditAction.DELETE,
    entityType: "StudentProfile",
    entityId: studentId,
    details: {
      actionType: "RIGHT_TO_BE_FORGOTTEN",
      dataSubjectRequestId: requestId,
      reason: "Cumplimiento Ley 21.719 - Supresión de datos personales de menor.",
    },
    ipAddress,
    userAgent,
  });

  return { success: true, message: "Datos personales del estudiante anonimizados y suprimidos exitosamente." };
}
