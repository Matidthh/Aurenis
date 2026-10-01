export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, setSessionCookie, signSessionToken } from "@/lib/auth/session";
import { verifyMfaChallengeToken, consumeChallengeToken } from "@/lib/auth/challenge-token";
import { verifyMfaEnrollment } from "@/lib/services/mfa.service";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";
import { prisma } from "@/lib/db/prisma";

const EnrollVerifySchema = z.object({
  code: z.string().min(6, "Código TOTP de 6 dígitos requerido"),
  challengeToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `mfa:enroll:verify:${clientIp}`;

  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.MFA_ENROLL);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message, code: "MFA_RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const body = await req.json();
    const validated = EnrollVerifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    let userId: string | null = null;
    let email: string = "";
    let isChallengeFlow = false;
    let challengeJti: string | null = null;

    // A. Intentar autenticación mediante sesión activa
    const session = await getSession();
    if (session) {
      userId = session.userId;
      email = session.email;
    } else if (validated.data.challengeToken) {
      // B. Flujo de login con challenge token de enrolamiento
      const payload = await verifyMfaChallengeToken(validated.data.challengeToken, "mfa_enrollment_challenge");
      if (payload) {
        userId = payload.sub;
        email = payload.email;
        isChallengeFlow = true;
        challengeJti = payload.jti;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado. Token de enrolamiento inválido o expirado.", code: "UNAUTHORIZED" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // 2. Validar código inicial y activar MFA_ENABLED
    const result = await verifyMfaEnrollment(userId, validated.data.code, {
      ipAddress,
      userAgent,
    });

    // 3. Si venía de login challenge, emitir sesión completa y revocar el challenge
    if (isChallengeFlow && challengeJti) {
      await consumeChallengeToken(challengeJti, userId);

      let firstName = "SuperAdmin";
      let lastName = "Aurenis";
      try {
        const userRecord = await prisma.user.findUnique({ where: { id: userId } });
        if (userRecord) {
          firstName = userRecord.firstName;
          lastName = userRecord.lastName;
        }
      } catch {
        // Fallback
      }

      const sessionToken = await signSessionToken({
        sub: userId,
        email,
        firstName,
        lastName,
        isSystemAdmin: true,
        permissions: ["*"],
      });

      await setSessionCookie(sessionToken);
    }

    return NextResponse.json(
      {
        success: true,
        mfaStatus: result.mfaStatus,
        message: "Autenticación Multifactor (MFA) activada exitosamente.",
        redirectUrl: "/system/dashboard",
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Código TOTP inválido." },
      { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
