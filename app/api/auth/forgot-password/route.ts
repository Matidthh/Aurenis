export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/services/recovery.service";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

const ForgotPasswordSchema = z.object({
  email: z.string().min(3, "Correo electrónico o RUT requerido"),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `password_reset:${clientIp}`;

  // 1. Rate Limiting específico para recuperación de cuenta (5 solicitudes / 15 minutos)
  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.PASSWORD_RESET);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message, code: "RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const body = await req.json();
    const validated = ForgotPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // 2. Procesar solicitud con respuesta uniforme anti-enumeración
    const result = await requestPasswordReset(validated.data.email, {
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        debugToken: result.debugToken,
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error al procesar solicitud de recuperación." },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
