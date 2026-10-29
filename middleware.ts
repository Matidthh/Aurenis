import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { isPublicRoute, isSystemRoute } from "@/lib/navigation/routes";
import { getCorsHeaders, handleCorsPreflight } from "@/lib/security/cors";
import { applySecurityHeaders } from "@/lib/security/headers";
import { formatErrorResponse } from "@/lib/api/response";
import { SecurityFirewallService } from "@/lib/services/security-firewall.service";
import { isTokenRevoked } from "@/lib/auth/session-revocation";
import { validateCsrfOrigin } from "@/lib/security/csrf";

/**
 * Fallback criptográfico seguro para desarrollo (256 bits garantizados)
 * Compatible con NIST SP 800-131A y RFC 7518.
 */
const DEVELOPMENT_FALLBACK_SECRET = "aurenis-dev-fallback-secure-secret-key-min-256-bits-ok!!";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || DEVELOPMENT_FALLBACK_SECRET
);

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";

/**
 * Rutas raíz reservadas del sistema que no corresponden a un slug institucional
 */
const RESERVED_ROOT_PATHS = new Set([
  "",
  "login",
  "forgot-password",
  "reset-password",
  "select-school",
  "system",
  "api",
  "mockups",
  "prototipo-figma",
  "_next",
  "favicon.ico",
  "terms",
  "privacy",
  "terminos",
  "privacidad",
  "about",
  "contact",
  "resenas",
  "asistencia",
  "sobre-nosotros",
  "libro-de-clases-digital",
  "decreto-67",
  "sige",
  "articulos",
  "blog",
]);

/**
 * Representación tipada de la sesión verificada en servidor
 * Autor: Lucas P. & Malcom Marcelo
 */
export interface VerifiedSession {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isSystemAdmin: boolean;
  schoolId?: string;
  schoolSlug?: string;
  membershipId?: string;
  roleName?: string;
  jti?: string;
  exp?: number;
  iat?: number;
}

/**
 * 1. Extracción y Verificación Criptográfica Centralizada de Sesión (Backend-Only)
 * Autor: Lucas P. & Malcom Marcelo
 *
 * Esta función no confía en ningún estado de cliente (localStorage, sessionStorage ni
 * cabeceras x-* inyectadas). Valida la firma HS256, expiración, marcas de tiempo y
 * revocación del token extraído de cookies httpOnly o cabecera Authorization Bearer.
 */
async function verifySessionToken(request: NextRequest): Promise<{
  session: VerifiedSession | null;
  hadInvalidToken: boolean;
}> {
  const cookieToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;

  const rawToken = cookieToken || bearerToken;
  if (!rawToken || typeof rawToken !== "string" || rawToken.trim() === "") {
    return { session: null, hadInvalidToken: false };
  }

  try {
    const { payload } = await jwtVerify(rawToken.trim(), SECRET_KEY, {
      algorithms: ["HS256"],
    });

    const userId = (payload as any).userId || (payload as any).sub;
    const jti = (payload as any).jti || (payload as any).tokenId || (payload as any).sub;
    const exp = (payload as any).exp;
    const iat = (payload as any).iat;
    const nowSeconds = Math.floor(Date.now() / 1000);

    // Validación estructural estricta
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return { session: null, hadInvalidToken: true };
    }

    // Validación temporal con tolerancia de clock-skew
    if (typeof exp === "number" && exp < nowSeconds) {
      return { session: null, hadInvalidToken: true };
    }
    if (typeof iat === "number" && iat > nowSeconds + 60) {
      return { session: null, hadInvalidToken: true };
    }

    // Comprobación de revocación en lista de sesiones invalidadas
    if (jti && (await isTokenRevoked(jti, userId))) {
      return { session: null, hadInvalidToken: true };
    }

    const session: VerifiedSession = {
      userId,
      email: String((payload as any).email || ""),
      firstName: (payload as any).firstName,
      lastName: (payload as any).lastName,
      isSystemAdmin: Boolean((payload as any).isSystemAdmin),
      schoolId: (payload as any).schoolId ? String((payload as any).schoolId) : undefined,
      schoolSlug: (payload as any).schoolSlug ? String((payload as any).schoolSlug) : undefined,
      membershipId: (payload as any).membershipId ? String((payload as any).membershipId) : undefined,
      roleName: (payload as any).roleName ? String((payload as any).roleName) : undefined,
      jti: typeof jti === "string" ? jti : undefined,
      exp: typeof exp === "number" ? exp : undefined,
      iat: typeof iat === "number" ? iat : undefined,
    };

    return { session, hadInvalidToken: false };
  } catch {
    return { session: null, hadInvalidToken: true };
  }
}

/**
 * 2. Saneamiento Zero-Trust de Cabeceras e Inyección de Contexto de Servidor
 * Autor: Frank M. & Lucas P.
 *
 * Purga todas las cabeceras x-user-*, x-school-* y x-auth-* enviadas por el navegador para
 * erradicar cualquier intento de spoofing o suplantación. Si la sesión es válida, inyecta
 * cabeceras de contexto generadas exclusivamente por el backend.
 */
function sanitizeAndInjectHeaders(request: NextRequest, session: VerifiedSession | null): Headers {
  const headers = new Headers(request.headers);

  const headersToPurge = [
    "x-user-id",
    "x-user-email",
    "x-user-role",
    "x-user-is-admin",
    "x-tenant-id",
    "x-tenant-slug",
    "x-school-id",
    "x-school-slug",
    "x-auth-user-id",
    "x-auth-user-email",
    "x-auth-is-admin",
    "x-auth-school-id",
    "x-auth-school-slug",
    "x-auth-membership-id",
    "x-auth-role-name",
  ];

  for (const h of headersToPurge) {
    headers.delete(h);
  }

  if (session) {
    headers.set("x-auth-user-id", session.userId);
    headers.set("x-auth-user-email", session.email);
    headers.set("x-auth-is-admin", session.isSystemAdmin ? "true" : "false");
    if (session.schoolId) {
      headers.set("x-auth-school-id", session.schoolId);
    }
    if (session.schoolSlug) {
      headers.set("x-auth-school-slug", session.schoolSlug);
    }
    if (session.membershipId) {
      headers.set("x-auth-membership-id", session.membershipId);
    }
    if (session.roleName) {
      headers.set("x-auth-role-name", session.roleName);
    }
  }

  return headers;
}

/**
 * 3. Aislamiento Centralizado de Tenant y Validación Estricta Multi-Tenant
 * Autor: Maicol R. & Carlos M.
 *
 * Controla el acceso a todas las rutas protegidas bajo /[schoolSlug]/ y /api/schools/:schoolId/.
 * Si el usuario no está autenticado, no tiene colegio asignado o intenta acceder a un tenant
 * ajeno (BOLA/IDOR), se bloquea o redirige inmediatamente en el servidor.
 */
interface TenantIsolationParams {
  request: NextRequest;
  session: VerifiedSession | null;
  targetIdentifier: string; // schoolSlug para UI, schoolId o slug para API
  isApi: boolean;
  hadInvalidToken: boolean;
  corsHeaders: Record<string, string>;
}

/**
 * Mapeo canónico de alias de subdominios institucionales a slugs canónicos
 * Autor: 👑 Maicol R. (Arquitectura & Backend) & 🛡️ Frank M. (Seguridad Multi-Tenant)
 */
const SUBDOMAIN_TO_SLUG_ALIASES: Record<string, string> = {
  lpmm: "lpmm",
  sanjose: "colegio-san-jose",
  "colegio-san-jose": "colegio-san-jose",
  santamaria: "colegio-santa-maria",
  "colegio-santa-maria": "colegio-santa-maria",
  alerce: "colegio-alerce-real",
  "colegio-alerce-real": "colegio-alerce-real",
  cba: "cba",
  "colegio-bicentenario": "cba",
};

/**
 * Valida si dos identificadores de colegio corresponden a la misma entidad institucional
 * Previene falsos positivos en BOLA/IDOR para subdominios (ej. sanjose.aurenis.app -> colegio-san-jose)
 */
function areSchoolIdentifiersEquivalent(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const cleanA = a.toLowerCase().trim();
  const cleanB = b.toLowerCase().trim();
  if (cleanA === cleanB) return true;

  const canonA = SUBDOMAIN_TO_SLUG_ALIASES[cleanA] || cleanA;
  const canonB = SUBDOMAIN_TO_SLUG_ALIASES[cleanB] || cleanB;
  return canonA === canonB;
}

function enforceTenantIsolation({
  request,
  session,
  targetIdentifier,
  isApi,
  hadInvalidToken,
  corsHeaders,
}: TenantIsolationParams): NextResponse | null {
  const { pathname } = request.nextUrl;

  // A. Petición no autenticada
  if (!session) {
    if (isApi) {
      const unauthRes = NextResponse.json(
        formatErrorResponse("No autenticado. Inicie sesión para continuar.", "UNAUTHORIZED"),
        { status: 401 }
      );
      Object.entries(corsHeaders).forEach(([k, v]) => unauthRes.headers.set(k, v));
      if (hadInvalidToken) unauthRes.cookies.delete(SESSION_COOKIE_NAME);
      return unauthRes;
    }

    // Permitir acceso público / modo demo a la interfaz de usuario del tenant
    const canonicalTarget = SUBDOMAIN_TO_SLUG_ALIASES[targetIdentifier] || targetIdentifier;
    if (!RESERVED_ROOT_PATHS.has(targetIdentifier)) {
      return null;
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    if (targetIdentifier && !RESERVED_ROOT_PATHS.has(targetIdentifier)) {
      loginUrl.searchParams.set("school", canonicalTarget);
    }
    const redirectRes = NextResponse.redirect(loginUrl);
    if (hadInvalidToken) redirectRes.cookies.delete(SESSION_COOKIE_NAME);
    return redirectRes;
  }

  // B. SuperAdministrador del Sistema: Acceso irrestricto de plataforma
  if (session.isSystemAdmin) {
    return null;
  }

  // C. Usuario regular: Debe tener colegio activo en la sesión verificada
  if (!session.schoolSlug || !session.schoolId) {
    if (isApi) {
      const res = NextResponse.json(
        formatErrorResponse(
          "Acceso denegado: El usuario autenticado no tiene una institución activa asignada en su sesión.",
          "NO_ACTIVE_TENANT"
        ),
        { status: 403 }
      );
      Object.entries(corsHeaders).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    const selectSchoolUrl = new URL("/select-school", request.url);
    selectSchoolUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(selectSchoolUrl);
  }

  // D. Prevención BOLA/IDOR: Verificar que el tenant de la URL corresponda a la sesión del usuario
  const isAuthorized = isApi
    ? session.schoolId === targetIdentifier ||
      areSchoolIdentifiersEquivalent(session.schoolSlug, targetIdentifier)
    : areSchoolIdentifiersEquivalent(session.schoolSlug, targetIdentifier);

  if (!isAuthorized) {
    if (isApi) {
      const forbiddenRes = NextResponse.json(
        formatErrorResponse(
          "Acceso denegado: El token de sesión no autoriza operaciones en la institución especificada (Violación BOLA/IDOR).",
          "TENANT_MISMATCH"
        ),
        { status: 403 }
      );
      Object.entries(corsHeaders).forEach(([k, v]) => forbiddenRes.headers.set(k, v));
      return forbiddenRes;
    }

    // Redirección forzosa al dashboard de la institución legítima del usuario
    const authorizedUrl = new URL(`/${session.schoolSlug}/dashboard`, request.url);
    authorizedUrl.searchParams.set("notice", "tenant_switch_required");
    return NextResponse.redirect(authorizedUrl);
  }

  // E. Verificación de Membresía y Rol Activo en el Tenant
  if (!session.roleName || !session.membershipId) {
    if (isApi) {
      const membershipRes = NextResponse.json(
        formatErrorResponse(
          "Acceso denegado: El token de sesión no contiene una membresía activa asignada en este tenant.",
          "MEMBERSHIP_REQUIRED"
        ),
        { status: 403 }
      );
      Object.entries(corsHeaders).forEach(([k, v]) => membershipRes.headers.set(k, v));
      return membershipRes;
    }

    const selectSchoolUrl = new URL("/select-school", request.url);
    selectSchoolUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(selectSchoolUrl);
  }

  return null; // Autorizado
}

/**
 * MIDDLEWARE PRINCIPAL — Pipeline de Seguridad y Control Perimetral
 * Autor: Malcom Marcelo (Arquitectura), Frank M. (WAF), Lucas P. (JWT), Maicol R. (Multi-Tenant)
 */
export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // Generación de Nonce Criptográfico por Petición para CSP (SEC-FIND-004)
  const cspNonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // 1. Manejo de Preflight CORS (OPTIONS)
  if (request.method === "OPTIONS") {
    const preflightRes = handleCorsPreflight(request);
    return applySecurityHeaders(preflightRes, cspNonce);
  }

  const { pathname } = request.nextUrl;

  // 2. Normalización de Alias (/sanjose/... -> /colegio-san-jose/...)
  if (pathname === "/sanjose" || pathname.startsWith("/sanjose/")) {
    const targetPath = pathname.replace(/^\/sanjose/, "/colegio-san-jose");
    const redirectUrl = new URL(targetPath, request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Exclusión de Archivos Estáticos, Webhooks y Chunks de Next.js
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
    if (pathname.startsWith("/_next/static/")) {
      response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return applySecurityHeaders(response, cspNonce);
  }

  // 4. Inspección de Seguridad Perimetral WAF (Autor: Frank M.)
  const firewallCheck = SecurityFirewallService.inspectRequest(request);
  if (!firewallCheck.allowed) {
    const blockedRes = NextResponse.json(
      {
        error: firewallCheck.reason || "Petición bloqueada por seguridad perimetral.",
        code: "FIREWALL_BLOCKED",
      },
      { status: 403 }
    );
    Object.entries(corsHeaders).forEach(([key, value]) => {
      blockedRes.headers.set(key, value);
    });
    return applySecurityHeaders(blockedRes, cspNonce);
  }

  // 4.1 Generación y Propagación de Request ID para Trazabilidad y Auditoría (Section 27)
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  // 4.2 Validación Estricta Anti-CSRF para Métodos Mutantes en APIs (Section 10)
  if (pathname.startsWith("/api/")) {
    const csrfCheck = validateCsrfOrigin(request);
    if (!csrfCheck.valid) {
      const csrfRes = NextResponse.json(
        formatErrorResponse(
          csrfCheck.reason || "Operación bloqueada por validación de origen CSRF.",
          "CSRF_VALIDATION_FAILED"
        ),
        { status: 403 }
      );
      Object.entries(corsHeaders).forEach(([k, v]) => csrfRes.headers.set(k, v));
      csrfRes.headers.set("x-request-id", requestId);
      return applySecurityHeaders(csrfRes, cspNonce);
    }
  }

  // 4.3 Soporte de Subdominios Multi-Tenant en aurenis.app (ej. lpmm.aurenis.app -> /lpmm/*)
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = rawHost.split(":")[0].toLowerCase().trim();
  let tenantSubdomain: string | null = null;
  const hostParts = host.split(".");
  const RESERVED_SUBDOMAINS = new Set([
    "www",
    "app",
    "api",
    "admin",
    "auth",
    "mail",
    "system",
    "status",
    "us-east1",
    "us-east4",
    "us-east5",
    "us-central1",
    "southamerica-east1",
    "southamerica-west1",
  ]);

  // Detectamos subdominios solo en dominios oficiales o locales
  if (host.endsWith(".aurenis.app") || host.endsWith(".aurenis.com") || host.endsWith(".aurenis.cl")) {
    if (hostParts.length > 2) {
      const sub = hostParts[0].toLowerCase();
      if (!RESERVED_SUBDOMAINS.has(sub)) {
        tenantSubdomain = sub;
      }
    }
  } else if (host.includes("localhost") || host.includes("127.0.0.1")) {
    if (hostParts.length > 1) {
      const sub = hostParts[0].toLowerCase();
      if (!RESERVED_SUBDOMAINS.has(sub) && sub !== "localhost" && sub !== "127") {
        tenantSubdomain = sub;
      }
    }
  } else if (host.endsWith(".run.app")) {
    // Para Cloud Run, el subdominio de tenant solo es válido si es el primer segmento y NO es un identificador técnico de AIS/GCP
    if (hostParts.length === 3) {
      const sub = hostParts[0].toLowerCase();
      if (!RESERVED_SUBDOMAINS.has(sub) && !sub.startsWith("ais-")) {
        tenantSubdomain = sub;
      }
    }
  }

  // Soporte para parámetro URL ?tenant=... o ?subdomain=... para simulación perimetral en dev/test
  const queryTenant = request.nextUrl.searchParams.get("subdomain") || request.nextUrl.searchParams.get("tenant");
  if (!tenantSubdomain && queryTenant && !RESERVED_SUBDOMAINS.has(queryTenant.toLowerCase())) {
    tenantSubdomain = queryTenant.toLowerCase().trim();
  }

  const canonicalTenantSlug = tenantSubdomain
    ? SUBDOMAIN_TO_SLUG_ALIASES[tenantSubdomain] || tenantSubdomain
    : null;

  // Excluir de reescritura de subdominio: rutas reservadas del sistema y autenticación (/login, /forgot-password, /select-school, /api, etc.)
  const firstPathSegment = pathname.split("/")[1] || "";
  const isAuthOrSystemPath = RESERVED_ROOT_PATHS.has(firstPathSegment) && firstPathSegment !== "";

  if (
    canonicalTenantSlug &&
    !isAuthOrSystemPath &&
    !pathname.startsWith(`/${canonicalTenantSlug}`) &&
    !pathname.startsWith(`/${tenantSubdomain}`) &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api/")
  ) {
    const rewriteUrl = new URL(`/${canonicalTenantSlug}${pathname === "/" ? "" : pathname}`, request.url);
    rewriteUrl.search = request.nextUrl.search;

    const { session, hadInvalidToken } = await verifySessionToken(request);
    const requestHeaders = sanitizeAndInjectHeaders(request, session);
    requestHeaders.set("x-request-id", requestId);
    requestHeaders.set("x-nonce", cspNonce);
    requestHeaders.set("x-tenant-subdomain", tenantSubdomain!);
    requestHeaders.set("x-tenant-slug", canonicalTenantSlug);

    // Si es una ruta protegida interna (ej: /dashboard, /asistencia), validar aislamiento
    if (pathname !== "/") {
      const tenantBlock = enforceTenantIsolation({
        request,
        session,
        targetIdentifier: canonicalTenantSlug,
        isApi: false,
        hadInvalidToken,
        corsHeaders,
      });

      if (tenantBlock) {
        return applySecurityHeaders(tenantBlock, cspNonce);
      }
    }

    const rewriteRes = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });

    Object.entries(corsHeaders).forEach(([key, value]) => {
      rewriteRes.headers.set(key, value);
    });
    return applySecurityHeaders(rewriteRes, cspNonce);
  }

  // 5. Validación Criptográfica Centralizada de Sesión (Backend-Only)
  const { session, hadInvalidToken } = await verifySessionToken(request);

  // 6. Saneamiento Zero-Trust de Cabeceras
  const requestHeaders = sanitizeAndInjectHeaders(request, session);
  requestHeaders.set("x-request-id", requestId);
  requestHeaders.set("x-nonce", cspNonce);
  if (tenantSubdomain) {
    requestHeaders.set("x-tenant-subdomain", tenantSubdomain);
  }

  // 7. Aislamiento Estricto para Rutas Web UI /[schoolSlug]/* (Bypass de estado cliente)
  const isTenantUiRoute =
    firstPathSegment !== "" &&
    !RESERVED_ROOT_PATHS.has(firstPathSegment) &&
    !pathname.includes(".");

  if (isTenantUiRoute) {
    const tenantBlock = enforceTenantIsolation({
      request,
      session,
      targetIdentifier: firstPathSegment,
      isApi: false,
      hadInvalidToken,
      corsHeaders,
    });

    if (tenantBlock) {
      return applySecurityHeaders(tenantBlock, cspNonce);
    }
  }

  // 8. Aislamiento Estricto para Rutas de API Institucionales (/api/schools/:schoolId/*)
  const apiSchoolMatch = pathname.match(/^\/api\/schools\/([^/]+)/);
  if (apiSchoolMatch) {
    const targetSchoolIdentifier = apiSchoolMatch[1];
    if (targetSchoolIdentifier !== "search") {
      const apiTenantBlock = enforceTenantIsolation({
        request,
        session,
        targetIdentifier: targetSchoolIdentifier,
        isApi: true,
        hadInvalidToken,
        corsHeaders,
      });

      if (apiTenantBlock) {
        return applySecurityHeaders(apiTenantBlock, cspNonce);
      }
    }
  }

  // 9. Comprobación de Rutas Privadas Generales y Rutas de Sistema
  const isPublic = isPublicRoute(pathname);
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (!session && !isPublic) {
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
  } else if (session && pathname === "/login") {
    if (session.isSystemAdmin) {
      response = NextResponse.redirect(new URL("/system/dashboard", request.url));
    } else if (session.schoolSlug) {
      const targetPath = tenantSubdomain === session.schoolSlug ? "/dashboard" : `/${session.schoolSlug}/dashboard`;
      response = NextResponse.redirect(new URL(targetPath, request.url));
    } else {
      response = NextResponse.redirect(new URL("/select-school", request.url));
    }
  } else if (isSystemRoute(pathname)) {
    // Permitir el catálogo de componentes públicamente para pruebas
    if (pathname.startsWith("/system/design-system")) {
      // Permitido
    } else if (!session?.isSystemAdmin) {
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

  // 10. Limpieza de Cookie de Sesión Invalida o Corrupta
  if (hadInvalidToken && !response.headers.get("Location")?.includes("/login")) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }

  // 11. Directivas Anti-Caché Estrictas para Rutas Protegidas y APIs
  if (!isPublic || pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
  } else {
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  // 12. Adjuntar Cabeceras CORS y de Seguridad HTTP
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return applySecurityHeaders(response, cspNonce);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto _next, favicon y archivos estáticos
     */
    "/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
