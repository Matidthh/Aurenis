export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { generateClassSessionToken } from "@/lib/services/class-session-token.service";
import { z } from "zod";

const GenerateTokenSchema = z.object({
  schoolSlug: z.string().min(1, "slug es requerido"),
  courseId: z.string().min(1, "courseId es requerido"),
  subjectId: z.string().optional().nullable(),
  ttlSeconds: z.number().int().min(5).max(300).optional().default(30),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "No autenticado. Inicie sesión para generar tokens de clase." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = GenerateTokenSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Parámetros de entrada inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const tokenData = await generateClassSessionToken({
      schoolSlug: validated.data.schoolSlug,
      courseId: validated.data.courseId,
      subjectId: validated.data.subjectId,
      teacherUserId: session.userId,
      teacherName: `${session.firstName} ${session.lastName}`,
      ttlSeconds: validated.data.ttlSeconds,
    });

    return NextResponse.json({
      success: true,
      data: tokenData,
    });
  } catch (err: any) {
    console.error("[POST /api/class-session/token] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error al generar token temporal de sesión de clase." },
      { status: 500 }
    );
  }
}
