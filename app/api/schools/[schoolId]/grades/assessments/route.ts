export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { CreateAssessmentSchema } from "@/lib/validations/grade.schema";
import { createAssessment } from "@/lib/services/grade.service";
import { apiSuccess, apiError, apiCreated } from "@/lib/api/response";

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

    // Verificar permisos para crear evaluaciones (GRADES_ENTER o ACADEMIC_SUBJECTS_MANAGE)
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

      const canCreate = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_ENTER ||
          rp.permission.code === PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE
      );

      if (!canCreate) {
        return apiError(
          "Acceso denegado. Permisos insuficientes para crear evaluaciones.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = CreateAssessmentSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos de evaluación inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const tenantDb = createTenantPrisma(schoolId);
    const assessment = await createAssessment(
      tenantDb,
      schoolId,
      validated.data,
      session.userId
    );

    return apiCreated(assessment, {
      message: "Evaluación creada exitosamente",
    });
  } catch (error: any) {
    return apiError(error.message || "Error al crear evaluación", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
