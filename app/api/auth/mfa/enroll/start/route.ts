export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { verifyMfaChallengeToken } from "@/lib/auth/challenge-token";
import { startMfaEnrollment } from "@/lib/services/mfa.service";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `mfa:enroll:start:${clientIp}`;

  // 1. Rate Limiting para inicio de enrolamiento
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.MFA_ENROLL);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message, code: "MFA_RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    let userId: string | null = null;
    let email: string = "";

    // A. Intentar autenticación mediante sesión activa
    const session = await getSession();
    if (session) {
      userId = session.userId;
      email = session.email;
    } else {
      // B. Intentar autenticación mediante challenge token de enrolamiento
      const body = await req.json().catch(() => ({}));
      const challengeToken = body?.challengeToken || req.headers.get("x-challenge-token");

      if (challengeToken) {
        const payload = await verifyMfaChallengeToken(challengeToken, "mfa_enrollment_challenge");
        if (payload) {
          userId = payload.sub;
          email = payload.email;
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere sesión activa o token de desafío de enrolamiento.", code: "UNAUTHORIZED" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // 2. Generar secreto TOTP y recovery codes (Devueltos UNA SOLA VEZ)
    const enrollmentData = await startMfaEnrollment(userId, email, {
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enrolamiento MFA iniciado. Guarde los códigos de recuperación en un lugar seguro.",
        secret: enrollmentData.secret,
        otpAuthUri: enrollmentData.otpAuthUri,
        recoveryCodes: enrollmentData.recoveryCodes,
        mfaStatus: enrollmentData.mfaStatus,
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error al iniciar enrolamiento MFA." },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
