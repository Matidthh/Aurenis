import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isPublicRoute, isSystemRoute } from "@/lib/navigation/routes";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";

export async function middleware(request: NextRequest) {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
  const corsHeaders = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Client-Version, X-Tenant-Id, Authorization",
  };

  // Manejo de preflight CORS (OPTIONS)
  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
  }

  const { pathname } = request.nextUrl;

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
    // Añadir headers CORS a archivos estáticos por si acaso
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
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
      sessionPayload = null;
    }
  }

  // Comprobar autenticación y autorización
  let response = NextResponse.next();

  if (!sessionPayload && !isPublic) {
    if (pathname.startsWith("/api/")) {
      response = NextResponse.json(
        { error: "No autenticado. Inicie sesión para continuar." },
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
    if (!sessionPayload?.isSystemAdmin) {
      if (pathname.startsWith("/api/")) {
        response = NextResponse.json(
          { error: "Acceso denegado. Se requieren privilegios de SuperAdmin." },
          { status: 403 }
        );
      } else {
        response = NextResponse.redirect(new URL("/select-school", request.url));
      }
    }
  }

  // Añadir Headers CORS a la respuesta final
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto archivos estáticos
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
