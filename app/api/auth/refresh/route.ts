import { NextRequest, NextResponse } from "next/server";
import { getSession, setSessionCookie, signSessionToken, clearSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Endpoint de Refresco Silencioso de Token de Sesión JWT
 * Responsable de autoría: Malcom Marcelo (Arquitectura Backend & Rotación JWT) & Maicol R. (Seguridad de Sesiones)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const simulateExpired = Boolean(body.simulateExpired);
    const forceInvalid = Boolean(body.forceInvalid);

    // Si se solicita forzar expiración (para pruebas de verificación de seguridad)
    if (simulateExpired || forceInvalid) {
      await clearSessionCookie();
      return NextResponse.json(
        {
          success: false,
          code: "SESSION_EXPIRED",
          error: "Tu sesión ha expirado por inactividad o el token de refresco ya no es válido.",
          requiresLogin: true,
          redirectUrl: "/login?expired=true",
        },
        { status: 401 }
      );
    }

    const currentSession = await getSession();

    if (!currentSession) {
      await clearSessionCookie();
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHORIZED",
          error: "No existe una sesión activa o el token actual está revocado.",
          requiresLogin: true,
          redirectUrl: "/login?expired=true",
        },
        { status: 401 }
      );
    }

    // Renovar y emitir nuevo token JWT
    const refreshedToken = await signSessionToken({
      sub: currentSession.userId,
      email: currentSession.email,
      firstName: currentSession.firstName,
      lastName: currentSession.lastName,
      isSystemAdmin: currentSession.isSystemAdmin,
      schoolId: currentSession.activeSchoolId,
      schoolSlug: currentSession.activeSchoolSlug,
      membershipId: currentSession.activeMembershipId,
      roleName: currentSession.roleName,
      permissions: currentSession.permissions,
    });

    await setSessionCookie(refreshedToken);

    return NextResponse.json({
      success: true,
      refreshed: true,
      token: refreshedToken,
      user: currentSession,
      expiresIn: "7d",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al procesar el refresco de sesión: " + (error?.message || String(error)),
        code: "REFRESH_FAILED",
      },
      { status: 500 }
    );
  }
}
