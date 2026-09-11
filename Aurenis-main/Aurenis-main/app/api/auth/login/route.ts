import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { authenticateUser } from "@/lib/services/user.service";
import { setSessionCookie, signSessionToken } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const user = await authenticateUser(validated.data.email, validated.data.password);

    // Caso A: SuperAdmin del Sistema
    if (user.isSystemAdmin) {
      const token = await signSessionToken({
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSystemAdmin: true,
        permissions: ["*"],
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        redirectUrl: "/system/dashboard",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          isSystemAdmin: true,
        },
      });
    }

    // Caso B: Usuario institucional
    const activeMemberships = user.memberships;

    if (activeMemberships.length === 0) {
      return NextResponse.json(
        { error: "No tienes una membresía activa en ninguna institución educativa." },
        { status: 403 }
      );
    }

    // Si tiene exactamente 1 colegio asociado, activamos su contexto inmediatamente
    if (activeMemberships.length === 1) {
      const mem = activeMemberships[0];
      const permissions = mem.role.permissions.map((rp) => rp.permission.code);

      const token = await signSessionToken({
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSystemAdmin: false,
        schoolId: mem.school.id,
        schoolSlug: mem.school.slug,
        membershipId: mem.id,
        roleName: mem.role.name,
        permissions,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        redirectUrl: `/${mem.school.slug}/dashboard`,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          activeSchool: {
            id: mem.school.id,
            slug: mem.school.slug,
            name: mem.school.name,
          },
        },
      });
    }

    // Si tiene múltiples colegios, emitimos sesión parcial y lo enviamos al selector
    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSystemAdmin: false,
      permissions: [],
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      redirectUrl: "/select-school",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        multipleSchools: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al iniciar sesión." },
      { status: 401 }
    );
  }
}
