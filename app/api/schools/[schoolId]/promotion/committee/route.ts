export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { registerCommitteeResolution } from "@/lib/services/promotion.service";
import { apiSuccess, apiError } from "@/lib/api/response";

/**
 * ============================================================================
 * ACTAS Y RESOLUCIONES DEL COMITÉ DE EVALUACIÓN (DECRETO 67/2018 ART. 11)
 * ============================================================================
 * Registra acuerdos del Consejo de Profesores para estudiantes en situación de
 * asistencia < 85% o casos pedagógicos excepcionales con firma de Dirección.
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;

    // Solo directores o administradores con permisos de gestión institucional
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: { userId: session.userId, schoolId },
        },
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const canManageCommittee = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
          rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE ||
          rp.permission.code === "*"
      );

      if (!canManageCommittee) {
        return apiError(
          "Acceso denegado. Solo la Dirección del colegio puede firmar acuerdos del Comité de Evaluación (Art. 11).",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const { enrollmentId, courseId, decision, reason, justification, committeeMembers } = body;

    if (!enrollmentId || !courseId || !decision || !reason || !justification) {
      return apiError(
        "Faltan campos obligatorios: enrollmentId, courseId, decision, reason y justification.",
        "VALIDATION_ERROR",
        { statusCode: 400 }
      );
    }

    if (decision !== "PROMOTED" && decision !== "REPEATED") {
      return apiError("La decisión debe ser 'PROMOTED' o 'REPEATED'.", "VALIDATION_ERROR", {
        statusCode: 400,
      });
    }

    const tenantDb = createTenantPrisma(schoolId);
    const result = await registerCommitteeResolution(
      tenantDb,
      schoolId,
      {
        enrollmentId,
        courseId,
        decision,
        reason,
        justification,
        committeeMembers: committeeMembers || ["Dirección", "Profesor Jefe", "Equipo PIE"],
        directorApproved: true,
      },
      session.userId
    );

    return apiSuccess(result, {
      message: "Resolución del Comité de Evaluación registrada y asentada en el Libro de Clases Oficial.",
    });
  } catch (error: any) {
    return apiError(error.message || "Error al registrar resolución del comité", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
