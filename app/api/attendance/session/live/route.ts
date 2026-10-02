export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAttendanceSessionLiveState } from "@/lib/services/attendance-session.service";
import { getSchoolBySlug } from "@/lib/services/school.service";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "No autenticado. Por favor inicie sesión." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const schoolSlug = searchParams.get("schoolSlug") || "lpmm";
    const courseId = searchParams.get("courseId");
    const sessionId = searchParams.get("sessionId");
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!courseId || !sessionId) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: courseId o sessionId." },
        { status: 400 }
      );
    }

    const school = await getSchoolBySlug(schoolSlug);
    if (!school) {
      return NextResponse.json(
        { error: "Institución no encontrada." },
        { status: 404 }
      );
    }

    const sessionState = await getAttendanceSessionLiveState({
      sessionId,
      schoolId: school.id,
      courseId,
      dateStr,
    });

    return NextResponse.json({
      success: true,
      sessionState,
    });
  } catch (err: any) {
    console.error("[GET /api/attendance/session/live] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al obtener estado de asistencia." },
      { status: 500 }
    );
  }
}
