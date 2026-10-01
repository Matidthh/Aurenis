export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getMfaRecord } from "@/lib/services/mfa.service";
import { decryptField } from "@/lib/security/encryption";
import { verifyTotpCode } from "@/lib/security/totp";
import { signStepUpToken } from "@/lib/auth/challenge-token";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@prisma/client";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

const StepUpSchema = z.object({
  code: z.string().min(6, "Código TOTP de 6 dígitos requerido"),
  action: z.string().optional().default("*"),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "No autenticado. Inicie sesión para continuar.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const clientIp = getClientIdentifier(req, session.userId);
  const rateLimitKey = `step_up:${clientIp}`;

  // 1. Rate Limiting específico para Step-Up (5 intentos / 5 minutos)
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.STEP_UP);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message, code: "STEP_UP_RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const body = await req.json();
    const validated = StepUpSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const { code, action } = validated.data;
    const mfaRecord = await getMfaRecord(session.userId);

    if (mfaRecord.mfaStatus !== "MFA_ENABLED" || !mfaRecord.encryptedSecret) {
      return NextResponse.json(
        { error: "MFA no está configurado para este usuario.", code: "MFA_NOT_CONFIGURED" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const plainSecret = decryptField(mfaRecord.encryptedSecret);
    if (!plainSecret) {
      return NextResponse.json(
        { error: "Error de descifrado del secreto MFA.", code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    // 2. Verificar código TOTP
    const verification = await verifyTotpCode({
      secret: plainSecret,
      code,
      userId: session.userId,
      windowTolerance: 1,
    });

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    if (!verification.valid) {
      await logAuditEvent({
        userId: session.userId,
        action: AuditAction.SECURITY_EVENT,
        entityType: "STEP_UP_AUTH",
        entityId: session.userId,
        details: {
          action: "STEP_UP_FAILED",
          targetAction: action,
          reason: verification.reason || "Código TOTP incorrecto",
        },
        ipAddress,
        userAgent,
      });

      return NextResponse.json(
        { error: verification.reason || "Código de verificación incorrecto.", code: "INVALID_TOTP" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 3. Emitir token de Step-Up (válido por 15 minutos)
    const { stepUpToken, expiresInSeconds } = await signStepUpToken({
      userId: session.userId,
      action,
    });

    await logAuditEvent({
      userId: session.userId,
      action: AuditAction.SECURITY_EVENT,
      entityType: "STEP_UP_AUTH",
      entityId: session.userId,
      details: {
        action: "STEP_UP_SUCCESS",
        targetAction: action,
        expiresInSeconds,
      },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        stepUpToken,
        expiresInSeconds,
        message: "Re-autenticación Step-Up exitosa. Operación sensible autorizada por 15 minutos.",
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error al procesar Step-Up authentication." },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
