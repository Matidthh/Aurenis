import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthCookiePayload, UserSession } from "@/types/auth";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "aurenis-default-super-secret-key-at-least-32-characters"
);

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";
export const SESSION_EXPIRY = "7d"; // 7 días de duración de sesión

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
};

export async function signSessionToken(payload: Omit<AuthCookiePayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRY)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<AuthCookiePayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AuthCookiePayload;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
  });
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
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
