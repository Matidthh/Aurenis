import { NextRequest } from "next/server";
import { getSession, setSessionCookie, signSessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SelectSchoolSchema } from "@/lib/validations/auth.schema";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const body = await req.json();
    const validated = SelectSchoolSchema.safeParse(body);
    if (!validated.success) {
      return apiError("ID de institución inválido", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    // Buscar la membresía del usuario en la institución solicitada
    const membership = await prisma.membership.findUnique({
      where: {
        userId_schoolId: {
          userId: session.userId,
          schoolId: validated.data.schoolId,
        },
      },
      include: {
        school: true,
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!membership || !membership.isActive || membership.school.status !== "ACTIVE") {
      return apiError("No tienes permisos activos en esta institución.", "FORBIDDEN", {
        statusCode: 403,
      });
    }

    const permissions = membership.role.permissions.map((rp) => rp.permission.code);

    const token = await signSessionToken({
      sub: session.userId,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      isSystemAdmin: session.isSystemAdmin,
      schoolId: membership.school.id,
      schoolSlug: membership.school.slug,
      membershipId: membership.id,
      roleName: membership.role.name,
      permissions,
    });

    await setSessionCookie(token);

    return apiSuccess(
      {
        redirectUrl: `/${membership.school.slug}/dashboard`,
        school: {
          id: membership.school.id,
          slug: membership.school.slug,
          name: membership.school.name,
        },
      },
      { message: "Institución educativa seleccionada exitosamente" }
    );
  } catch (error: unknown) {
    return apiError(error instanceof Error ? error.message : "Error al seleccionar institución", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}

