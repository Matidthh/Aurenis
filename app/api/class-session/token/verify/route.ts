export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { validateClassSessionToken } from "@/lib/services/class-session-token.service";
import { z } from "zod";

const VerifyTokenSchema = z.object({
  token: z.string().min(1, "token es requerido"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = VerifyTokenSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Token requerido", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const payload = await validateClassSessionToken(validated.data.token);

    return NextResponse.json({
      valid: true,
      payload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: err.message || "Token inválido o expirado" },
      { status: 400 }
    );
  }
}
