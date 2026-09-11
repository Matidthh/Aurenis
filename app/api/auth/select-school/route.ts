import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie, signSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SelectSchoolSchema } from "@/lib/validations/auth.schema";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const validated = SelectSchoolSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "ID de institución inválido" }, { status: 400 });
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
      return NextResponse.json(
        { error: "No tienes permisos activos en esta institución." },
        { status: 403 }
      );
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

    const response = NextResponse.json({
      success: true,
      redirectUrl: `/${membership.school.slug}/dashboard`,
      school: {
        id: membership.school.id,
        slug: membership.school.slug,
        name: membership.school.name,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al seleccionar institución" },
      { status: 500 }
    );
  }
}
