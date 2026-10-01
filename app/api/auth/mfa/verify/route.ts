export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyMfaChallengeToken, consumeChallengeToken } from "@/lib/auth/challenge-token";
import { verifyMfaLogin } from "@/lib/services/mfa.service";
import { signSessionToken, setSessionCookie } from "@/lib/auth/session";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";
import { prisma } from "@/lib/db/prisma";

const MfaVerifySchema = z.object({
  challengeToken: z.string().min(20, "Challenge token requerido"),
  code: z.string().min(6, "Código de verificación o de recuperación requerido"),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `mfa:verify:${clientIp}`;

  // 1. Rate Limiting específico para verificación MFA (5 intentos / 3 minutos)
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.MFA_VERIFY);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: rateLimitResult.message,
        code: "MFA_RATE_LIMIT_EXCEEDED",
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await req.json();
    const validated = MfaVerifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de verificación inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const { challengeToken, code } = validated.data;

    // 2. Validar token de desafío MFA (debe ser válido, no expirado y no consumido)
    const challengePayload = await verifyMfaChallengeToken(challengeToken, "mfa_challenge");
    if (!challengePayload) {
      return NextResponse.json(
        {
          error: "El desafío de autenticación MFA es inválido o ha expirado. Por favor, inicie sesión nuevamente.",
          code: "INVALID_CHALLENGE_TOKEN",
        },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const userId = challengePayload.sub;
    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // 3. Verificar código TOTP o Recovery Code
    const verificationResult = await verifyMfaLogin(userId, code, {
      ipAddress,
      userAgent,
    });

    // 4. Invalidar token de desafío inmediatamente (Single-Use Enforcement)
    await consumeChallengeToken(challengePayload.jti, userId);

    // 5. Obtener datos actualizados del usuario para el JWT
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

    // 6. Emitir JWT de sesión administrativa de privilegio completo
    const sessionToken = await signSessionToken({
      sub: userId,
      email: challengePayload.email,
      firstName,
      lastName,
      isSystemAdmin: true,
      permissions: ["*"],
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json(
      {
        success: true,
        redirectUrl: "/system/dashboard",
        method: verificationResult.method,
        remainingRecoveryCodes: verificationResult.remainingRecoveryCodes,
        user: {
          id: userId,
          email: challengePayload.email,
          name: `${firstName} ${lastName}`,
          isSystemAdmin: true,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Código de verificación MFA inválido o expirado." },
      { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
