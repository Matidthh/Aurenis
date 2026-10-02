export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { BulkManualAttendanceSchema } from "@/lib/validations/attendance.schema";
import { saveBulkManualAttendance } from "@/lib/services/attendance-session.service";
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
    const validated = BulkManualAttendanceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
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

    const result = await saveBulkManualAttendance({
      schoolId: school.id,
      courseId: validated.data.courseId,
      dateStr: validated.data.date,
      teacherUserId: session.userId,
      records: validated.data.records,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[POST /api/attendance/session/manual] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al guardar el registro manual de asistencia." },
      { status: 500 }
    );
  }
}
