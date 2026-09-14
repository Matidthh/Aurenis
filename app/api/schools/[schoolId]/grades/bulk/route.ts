import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { BulkSaveGradesSchema } from "@/lib/validations/grade.schema";
import { saveBulkMatrixGrades } from "@/lib/services/grade.service";
import { apiSuccess, apiError } from "@/lib/api/response";

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

    // Verificar permisos para ingresar/modificar notas (GRADES_ENTER o GRADES_MODIFY)
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

      const canEnterOrModify = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_ENTER ||
          rp.permission.code === PERMISSIONS.GRADES_MODIFY
      );

      if (!canEnterOrModify) {
        return apiError(
          "Acceso denegado. Permisos insuficientes para ingresar o modificar calificaciones.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = BulkSaveGradesSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos de calificaciones masivas inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const tenantDb = createTenantPrisma(schoolId);
    const result = await saveBulkMatrixGrades(
      tenantDb,
      schoolId,
      validated.data.grades,
      session.userId
    );

    return apiSuccess(result, {
      message: `Se guardaron exitosamente ${result.savedCount} calificaciones.`,
    });
  } catch (error: any) {
    return apiError(error.message || "Error al procesar guardado masivo de calificaciones", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
