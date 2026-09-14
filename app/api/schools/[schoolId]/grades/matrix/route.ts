import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { getGradeMatrixData } from "@/lib/services/grade.service";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;

    // Verificar pertenencia y permisos
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

      const hasView = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.GRADES_VIEW
      );
      if (!hasView) {
        return apiError("Acceso denegado. Sin permisos de lectura de calificaciones.", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || undefined;
    const subjectId = searchParams.get("subjectId") || undefined;
    const periodId = searchParams.get("periodId") || undefined;

    const tenantDb = createTenantPrisma(schoolId);
    const matrixData = await getGradeMatrixData(tenantDb, schoolId, {
      courseId,
      subjectId,
      periodId,
    });

    return apiSuccess(matrixData);
  } catch (error: any) {
    return apiError(error.message || "Error al obtener matriz de calificaciones", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
