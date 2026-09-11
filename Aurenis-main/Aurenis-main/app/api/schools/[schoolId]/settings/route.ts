import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { UpdateSchoolSettingsSchema } from "@/lib/validations/school.schema";
import { updateSchoolSettings } from "@/lib/services/school.service";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const hasUpdatePermission = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE
      );

      if (!hasUpdatePermission) {
        return NextResponse.json(
          { error: "No posees el permiso para modificar la configuración del colegio." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = UpdateSchoolSettingsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de formulario inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await updateSchoolSettings(schoolId, validated.data, session.userId);

    return NextResponse.json({
      success: true,
      message: "Configuración actualizada con éxito",
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar" }, { status: 500 });
  }
}
