import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { AuthCookiePayload, UserSession } from "@/types/auth";
import { getValidatedJwtSecret } from "@/lib/security/crypto-keys";

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";
export const SESSION_EXPIRY = "7d"; // 7 días de duración de sesión

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
};

export async function signSessionToken(payload: Omit<AuthCookiePayload, "iat" | "exp">): Promise<string> {
  const secretKey = getValidatedJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AuthCookiePayload | null> {
  try {
    const secretKey = getValidatedJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AuthCookiePayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  // Borra la cookie tanto para SameSite=none como SameSite=lax para consistencia absoluta entre entornos
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "none",
    secure: true,
    maxAge: 0,
    expires: new Date(0),
  });
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
  });
  try {
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // ignore
  }
}

export async function getSession(): Promise<UserSession | null> {
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  } catch {
    // cookies() might not be available in some contexts
  }

  if (!token) {
    try {
      const headerStore = await headers();
      const authHeader = headerStore.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    } catch {
      // headers() might not be available in some contexts
    }
  }

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload || !payload.sub) return null;

  return {
    userId: payload.sub,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    isSystemAdmin: payload.isSystemAdmin || false,
    activeSchoolId: payload.schoolId,
    activeSchoolSlug: payload.schoolSlug,
    activeMembershipId: payload.membershipId,
    roleName: payload.roleName,
    permissions: payload.permissions || [],
  };
}
