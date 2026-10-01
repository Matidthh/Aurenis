export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { requireSystemAdminStepUp } from "@/lib/security/step-up-guard";
import { regenerateRecoveryCodes } from "@/lib/services/mfa.service";

export async function POST(req: NextRequest) {
  const guard = await requireSystemAdminStepUp(req, "REGENERATE_RECOVERY_CODES");
  if (!guard.allowed) {
    return guard.response!;
  }

  try {
    const ipAddress = req.headers.get("x-forwarded-for") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await regenerateRecoveryCodes(guard.userId!, {
      ipAddress,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      recoveryCodes: result.recoveryCodes,
      message: "Códigos de recuperación regenerados exitosamente. Guarde estos códigos en un lugar seguro.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Error al regenerar códigos de recuperación." },
      { status: 500 }
    );
  }
}
