import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isPublicRoute, isSystemRoute } from "@/lib/navigation/routes";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar archivos estáticos, favicon y assets de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Verificar si la ruta es pública según la definición centralizada
  const isPublic = isPublicRoute(pathname);

  // Obtener cookie de sesión
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      sessionPayload = payload;
    } catch {
      // Token inválido o expirado
      sessionPayload = null;
    }
  }

  // Si no hay sesión y la ruta no es pública
  if (!sessionPayload && !isPublic) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "No autenticado. Inicie sesión para continuar." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario ya está autenticado e intenta acceder al login, redirigir al dashboard adecuado
  if (sessionPayload && pathname === "/login") {
    if (sessionPayload.isSystemAdmin) {
      return NextResponse.redirect(new URL("/system/dashboard", request.url));
    }
    if (sessionPayload.schoolSlug) {
      return NextResponse.redirect(new URL(`/${sessionPayload.schoolSlug}/dashboard`, request.url));
    }
    return NextResponse.redirect(new URL("/select-school", request.url));
  }

  // Protección de rutas del Panel Global (/system/* y /api/system/*)
  if (isSystemRoute(pathname)) {
    if (!sessionPayload?.isSystemAdmin) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren privilegios de SuperAdmin." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/select-school", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
