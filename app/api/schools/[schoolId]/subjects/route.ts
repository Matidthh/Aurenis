import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId } = await params;
    const school = await prisma.school.findFirst({
      where: {
        OR: [{ id: schoolId }, { slug: schoolId }],
      },
    });

    if (!school) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    // Comprobar permisos RBAC
    if (!session.isSystemAdmin) {
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
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const hasPermission = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permiso para gestionar asignaturas en esta institución." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { name, code, courseId, teacherProfileId, hoursPerWeek } = body;

    if (!name || !courseId) {
      return NextResponse.json(
        { error: "Nombre de la asignatura y curso son obligatorios." },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(school.id);

    const newSubject = await tenantDb.subject.create({
      data: {
        name: name.trim(),
        code: code ? code.trim().toUpperCase() : null,
        courseId,
        teacherProfileId: teacherProfileId || null,
        hoursPerWeek: parseInt(hoursPerWeek, 10) || 4,
        schoolId: school.id,
      },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "CREATE",
        entityType: "SUBJECT",
        entityId: newSubject.id,
        details: { name: newSubject.name, courseId },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Asignatura creada exitosamente",
      subject: newSubject,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al crear la asignatura" },
      { status: 500 }
    );
  }
}
