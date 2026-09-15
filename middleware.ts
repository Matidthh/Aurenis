import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isPublicRoute, isSystemRoute } from "@/lib/navigation/routes";
import { getCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";
import { applySecurityHeaders } from "@/lib/security/headers";
import { formatErrorResponse } from "@/lib/api/response";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";

export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Manejo de preflight CORS (OPTIONS)
  if (request.method === "OPTIONS") {
    const preflightRes = handleCorsPreflight(request);
    return applySecurityHeaders(preflightRes);
  }

  const { pathname } = request.nextUrl;

  // Redirección amigable de alias /sanjose/... -> /colegio-san-jose/...
  if (pathname === "/sanjose" || pathname.startsWith("/sanjose/")) {
    const targetPath = pathname.replace(/^\/sanjose/, "/colegio-san-jose");
    const redirectUrl = new URL(targetPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  // Ignorar archivos estáticos, favicon y assets de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/webhooks") ||
    pathname === "/_not-found" ||
    pathname === "/404" ||
    pathname === "/500" ||
    pathname === "/_error" ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    const response = NextResponse.next();
    // Añadir headers CORS y de seguridad a assets estáticos
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return applySecurityHeaders(response);
  }

  // Verificar si la ruta es pública según la definición centralizada
  const isPublic = isPublicRoute(pathname);

  // Obtener token de sesión: desde cookie de sesión o desde encabezado Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value || bearerToken;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      sessionPayload = payload;
    } catch {
      sessionPayload = null;
    }
  }

  // Comprobar autenticación y autorización
  let response = NextResponse.next();

  if (!sessionPayload && !isPublic) {
    if (pathname.startsWith("/api/")) {
      response = NextResponse.json(
        formatErrorResponse("No autenticado. Inicie sesión para continuar.", "UNAUTHORIZED"),
        { status: 401 }
      );
    } else {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      response = NextResponse.redirect(loginUrl);
    }
  } else if (sessionPayload && pathname === "/login") {
    if (sessionPayload.isSystemAdmin) {
      response = NextResponse.redirect(new URL("/system/dashboard", request.url));
    } else if (sessionPayload.schoolSlug) {
      response = NextResponse.redirect(new URL(`/${sessionPayload.schoolSlug}/dashboard`, request.url));
    } else {
      response = NextResponse.redirect(new URL("/select-school", request.url));
    }
  } else if (isSystemRoute(pathname)) {
    // Permitir el catálogo de diseño y componentes públicamente para pruebas
    if (pathname.startsWith("/system/design-system")) {
      // Permitido sin bloqueo
    } else if (!sessionPayload?.isSystemAdmin) {
      if (pathname.startsWith("/api/")) {
        response = NextResponse.json(
          formatErrorResponse("Acceso denegado. Se requieren privilegios de SuperAdmin.", "FORBIDDEN"),
          { status: 403 }
        );
      } else {
        response = NextResponse.redirect(new URL("/select-school", request.url));
      }
    }
  }

  // Si es una ruta protegida o API privada, aplicar directivas estrictas anti-caché en el navegador
  if (!isPublic || pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
  }

  // Añadir Headers CORS a la respuesta final
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Aplicar cabeceras de seguridad HTTP (HSTS, CSP, X-Content-Type-Options, Anti-Clickjacking)
  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
