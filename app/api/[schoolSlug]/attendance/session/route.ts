export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createAttendanceSession } from "@/lib/services/attendance.service";
import { getSchoolBySlug } from "@/lib/services/school.service";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@prisma/client";
import {
  StrictSlugSchema,
  CreateAttendanceSessionBodySchema,
} from "@/lib/validations/attendance.schema";

/**
 * Endpoint para crear/iniciar una sesión de asistencia
 * Autores: Maicol R. (Backend, Arquitectura & Autorización RBAC)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const rawParams = await params;
    const slugParsed = StrictSlugSchema.safeParse(rawParams.schoolSlug);

    if (!slugParsed.success) {
      return NextResponse.json(
        { error: "Slug de institución inválido", details: slugParsed.error.flatten() },
        { status: 400 }
      );
    }

    const schoolSlug = slugParsed.data;
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "No autenticado. Inicie sesión para crear una sesión de asistencia." },
        { status: 401 }
      );
    }

    // 1. Obtener datos del colegio
    const school = await getSchoolBySlug(schoolSlug);
    if (!school) {
      return NextResponse.json(
        { error: `Institución '${schoolSlug}' no encontrada.` },
        { status: 404 }
      );
    }

    // 2. Validar autorización RBAC del docente en la institución
    if (!session.isSystemAdmin) {
      if (isDatabaseConfigured()) {
        const membership = await prisma.membership.findUnique({
          where: {
            userId_schoolId: {
              userId: session.userId,
              schoolId: school.id,
            },
          },
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });

        if (!membership || !membership.isActive) {
          return NextResponse.json(
            { error: "Acceso denegado: No posee una membresía activa en esta institución educativa." },
            { status: 403 }
          );
        }

        const roleName = membership.role.name.toUpperCase();
        const hasPermission =
          roleName.includes("DOCENTE") ||
          roleName.includes("TEACHER") ||
          roleName.includes("ADMIN") ||
          roleName.includes("DIRECTOR") ||
          membership.role.permissions.some(
            (rp) =>
              rp.permission.code === PERMISSIONS.ATTENDANCE_RECORD ||
              rp.permission.code === "*"
          );

        if (!hasPermission) {
          return NextResponse.json(
            { error: "Acceso denegado: No cuenta con permisos para registrar asistencia en esta institución." },
            { status: 403 }
          );
        }
      }
    }

    // 3. Validar body de la solicitud con Zod estricto
    const body = await req.json();
    const validated = CreateAttendanceSessionBodySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de entrada inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { courseId, subjectId, date, ttlSeconds } = validated.data;

    // 4. Protección BOLA / IDOR: Verificar que el curso pertenezca a la institución
    if (isDatabaseConfigured()) {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          schoolId: school.id,
          deletedAt: null,
        },
      });

      if (!course) {
        return NextResponse.json(
          { error: "El curso especificado no existe o no pertenece a esta institución." },
          { status: 404 }
        );
      }
    }

    // 5. Crear la sesión de asistencia
    const attendanceSession = await createAttendanceSession({
      schoolId: school.id,
      courseId,
      subjectId,
      teacherUserId: session.userId,
      dateStr: date,
      ttlSeconds,
    });

    // 6. Auditoría de seguridad
    logAuditEvent({
      schoolId: school.id,
      userId: session.userId,
      action: AuditAction.CREATE,
      entityType: "ATTENDANCE_SESSION",
      entityId: attendanceSession.id,
      details: {
        courseId,
        subjectId,
        ttlSeconds,
      },
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        session: attendanceSession,
        token: attendanceSession.token,
        expiresAt: attendanceSession.expiresAt,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[POST /api/[schoolSlug]/attendance/session] Error:", err);
    return NextResponse.json(
      { error: err.message || "Error interno al crear la sesión de asistencia." },
      { status: 500 }
    );
  }
}
