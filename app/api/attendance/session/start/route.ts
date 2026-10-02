export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { StartAttendanceSessionSchema } from "@/lib/validations/attendance.schema";
import { startAttendanceSession } from "@/lib/services/attendance-session.service";
import { getSchoolBySlug } from "@/lib/services/school.service";

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
    const validated = StartAttendanceSessionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const school = await getSchoolBySlug(validated.data.schoolSlug);
    if (!school) {
      return NextResponse.json(
        { error: "Institución no encontrada." },
        { status: 404 }
      );
    }

    const sessionState = await startAttendanceSession({
      schoolId: school.id,
      courseId: validated.data.courseId,
      subjectId: validated.data.subjectId,
      teacherUserId: session.userId,
      teacherName: `${session.firstName} ${session.lastName}`,
      dateStr: validated.data.date,
    });

    return NextResponse.json({
      success: true,
      sessionState,
    });
  } catch (err: any) {
    console.error("[POST /api/attendance/session/start] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al iniciar la sesión de asistencia." },
      { status: 500 }
    );
  }
}
