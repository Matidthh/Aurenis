import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { UpdateSchoolSettingsSchema } from "@/lib/validations/school.schema";
import { updateSchoolSettings } from "@/lib/services/school.service";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;

    // Verificar si tiene permisos para modificar la configuración
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId,
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

      const hasUpdatePermission = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE
      );

      if (!hasUpdatePermission) {
        return apiError("No posees el permiso para modificar la configuración del colegio.", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const body = await req.json();
    const validated = UpdateSchoolSettingsSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos de formulario inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const updated = await updateSchoolSettings(schoolId, validated.data, session.userId);

    return apiSuccess(
      { settings: updated },
      { message: "Configuración actualizada con éxito" }
    );
  } catch (error: unknown) {
    return apiError(error instanceof Error ? error.message : "Error al actualizar la configuración", "INTERNAL_ERROR", { statusCode: 500 });
  }
}

