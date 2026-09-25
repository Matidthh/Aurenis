export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { UpdateAssessmentSchema } from "@/lib/validations/grade.schema";
import { updateAssessment, deleteAssessment } from "@/lib/services/grade.service";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; assessmentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId, assessmentId } = await params;

    // Verificar permisos
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

      const canModify = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_MODIFY ||
          rp.permission.code === PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE
      );

      if (!canModify) {
        return apiError(
          "Acceso denegado. Permisos insuficientes para modificar evaluaciones.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = UpdateAssessmentSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos de evaluación inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const tenantDb = createTenantPrisma(schoolId);
    const updated = await updateAssessment(
      tenantDb,
      schoolId,
      assessmentId,
      validated.data,
      session.userId
    );

    return apiSuccess(updated, { message: "Evaluación actualizada exitosamente" });
  } catch (error: any) {
    return apiError(error.message || "Error al actualizar evaluación", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; assessmentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId, assessmentId } = await params;

    // Verificar permisos
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

      const canDelete = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_MODIFY ||
          rp.permission.code === PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE
      );

      if (!canDelete) {
        return apiError(
          "Acceso denegado. Permisos insuficientes para eliminar evaluaciones.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const tenantDb = createTenantPrisma(schoolId);
    await deleteAssessment(tenantDb, schoolId, assessmentId, session.userId);

    return apiSuccess({ id: assessmentId, deleted: true }, { message: "Evaluación eliminada" });
  } catch (error: any) {
    return apiError(error.message || "Error al eliminar evaluación", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
