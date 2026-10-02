export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { CloseAttendanceSessionSchema } from "@/lib/validations/attendance.schema";
import { closeAttendanceSession } from "@/lib/services/attendance-session.service";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "No autenticado. Por favor inicie sesión." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = CloseAttendanceSessionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const result = await closeAttendanceSession({
      sessionId: validated.data.sessionId,
      teacherUserId: session.userId,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[POST /api/attendance/session/close] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al finalizar la sesión de asistencia." },
      { status: 500 }
    );
  }
}
