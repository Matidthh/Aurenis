import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { UpdateAcademicPeriodSchema } from "@/lib/validations/school.schema";
import { updateAcademicPeriod, deleteAcademicPeriod } from "@/lib/services/school.service";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; periodId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId, periodId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return apiError("Institución no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // Verificar permisos
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId: school.id,
          },
        },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const hasPermission = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
          rp.permission.code === "academic:periods:manage"
      );

      if (!hasPermission) {
        return apiError("No tienes permisos para modificar periodos académicos", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const body = await req.json();
    const validated = UpdateAcademicPeriodSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos inválidos para actualizar el periodo", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const updated = await updateAcademicPeriod(school.id, periodId, validated.data, session.userId);

    return apiSuccess(
      { period: updated },
      { message: "Periodo académico actualizado con éxito" }
    );
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al actualizar periodo académico",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; periodId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId, periodId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return apiError("Institución no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // Verificar permisos
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId: school.id,
          },
        },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const hasPermission = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
          rp.permission.code === "academic:periods:manage"
      );

      if (!hasPermission) {
        return apiError("No tienes permisos para eliminar periodos académicos", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const result = await deleteAcademicPeriod(school.id, periodId, session.userId);

    return apiSuccess(
      result,
      { message: "Periodo académico eliminado exitosamente" }
    );
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al eliminar periodo académico",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}
