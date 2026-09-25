export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { authenticateUser } from "@/lib/services/user.service";
import { setSessionCookie, signSessionToken } from "@/lib/auth/session";
import {
  checkRateLimit,
  resetRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `login:${clientIp}`;

  // Verificar límite de tasa para mitigar ataques de fuerza bruta (Rate Limiting)
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.LOGIN);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: rateLimitResult.message,
        code: "TOO_MANY_REQUESTS",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const requestedSlug = validated.data.schoolSlug?.trim().toLowerCase();
    const user = await authenticateUser(validated.data.email, validated.data.password, requestedSlug);

    // Tras autenticación exitosa, restablecer el contador de intentos fallidos
    await resetRateLimit(rateLimitKey);

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
    const activeMemberships = user.memberships || [];

    if (activeMemberships.length === 0) {
      return NextResponse.json(
        { error: "No tienes una membresía activa en ninguna institución educativa." },
        { status: 403 }
      );
    }

    // Si se solicitó un colegio o tiene exactamente 1 colegio asociado, activamos su contexto inmediatamente
    let selectedMem: any = null;
    if (requestedSlug) {
      selectedMem = activeMemberships.find(
        (m: any) => m.school?.slug?.toLowerCase() === requestedSlug || m.school?.id === requestedSlug
      );
    }

    if (!selectedMem && activeMemberships.length === 1) {
      selectedMem = activeMemberships[0];
    }

    if (selectedMem) {
      const mem = selectedMem;
      const permissions = mem.role.permissions.map((rp: any) => rp.permission.code);

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
          roleName: mem.role.name,
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
  } catch (error: unknown) {
    const statusCode = typeof (error as any)?.statusCode === "number" ? (error as any).statusCode : 401;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno al iniciar sesión." },
      { status: statusCode, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
