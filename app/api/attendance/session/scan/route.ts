export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { RecordQRScanSchema } from "@/lib/validations/attendance.schema";
import { recordAttendanceViaQR } from "@/lib/services/attendance-session.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "No autenticado. Debe iniciar sesión como estudiante para escanear el código QR." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = RecordQRScanSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Código QR inválido o datos incompletos.", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const result = await recordAttendanceViaQR({
      schoolSlug: validated.data.schoolSlug,
      qrToken: validated.data.qrToken,
      studentUserId: session.userId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[POST /api/attendance/session/scan] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al procesar el código QR de asistencia." },
      { status: 400 }
    );
  }
}
