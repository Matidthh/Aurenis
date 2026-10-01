export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSystemAdminStepUp } from "@/lib/security/step-up-guard";
import { disableMfa } from "@/lib/services/mfa.service";

const DisableMfaSchema = z.object({
  targetUserId: z.string().min(1, "ID de usuario objetivo requerido"),
});

export async function POST(req: NextRequest) {
  // Operación altamente sensible: requiere rol SuperAdmin y re-autenticación Step-Up reciente
  const guard = await requireSystemAdminStepUp(req, "DISABLE_MFA");
  if (!guard.allowed) {
    return guard.response!;
  }

  try {
    const body = await req.json();
    const validated = DisableMfaSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { targetUserId } = validated.data;
    const ipAddress = req.headers.get("x-forwarded-for") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await disableMfa(guard.userId!, targetUserId, {
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error al desactivar MFA." },
      { status: 500 }
    );
  }
}
