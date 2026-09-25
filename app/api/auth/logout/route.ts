export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";

export async function POST() {
  await clearSessionCookie();
  const response = NextResponse.json({ success: true, redirectUrl: "/login" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "none",
    secure: true,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function GET(req: NextRequest) {
  await clearSessionCookie();
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "none",
    secure: true,
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
