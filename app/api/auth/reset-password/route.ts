export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resetPasswordWithToken } from "@/lib/services/recovery.service";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/security/rate-limiter";

const ResetPasswordSchema = z.object({
  token: z.string().min(32, "Token de restablecimiento requerido"),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `password_reset:submit:${clientIp}`;

  const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMIT_CONFIGS.PASSWORD_RESET);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: rateLimitResult.message, code: "RATE_LIMIT_EXCEEDED" },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const body = await req.json();
    const validated = ResetPasswordSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const ipAddress = clientIp.replace("ip:", "").replace(/^user:[^:]+:/, "");
    const userAgent = req.headers.get("user-agent") || undefined;

    // Ejecutar cambio de contraseña, consumo del token y revocación de sesiones
    const result = await resetPasswordWithToken(
      validated.data.token,
      validated.data.newPassword,
      { ipAddress, userAgent }
    );

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Token de restablecimiento inválido o expirado." },
      { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}
