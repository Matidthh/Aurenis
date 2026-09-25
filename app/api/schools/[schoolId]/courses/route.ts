export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { sanitizeErrorMessage } from "@/lib/api/response";

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
          rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren privilegios de administración de cursos." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { name, gradeNumber, letter, educationLevelId, year } = body;

    if (!name || !letter || !educationLevelId) {
      return NextResponse.json(
        { error: "Nombre, letra de sección y nivel educativo son obligatorios." },
        { status: 400 }
      );
    }

    // Validación de pertenencia multi-tenant del nivel educativo (Autor: Maicol R.)
    const level = await prisma.educationLevel.findFirst({
      where: {
        id: educationLevelId,
        schoolId: school.id,
      },
    });

    if (!level) {
      return NextResponse.json(
        { error: "El nivel educativo especificado no existe o no pertenece a esta institución." },
        { status: 400 }
      );
    }

    const currentYear = year || new Date().getFullYear();
    const tenantDb = createTenantPrisma(school.id);

    const newCourse = await tenantDb.course.create({
      data: {
        name: name.trim(),
        gradeNumber: parseInt(gradeNumber, 10) || 1,
        letter: letter.trim().toUpperCase(),
        educationLevelId,
        year: currentYear,
        schoolId: school.id,
      },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "CREATE",
        entityType: "COURSE",
        entityId: newCourse.id,
        details: { name: newCourse.name, year: currentYear },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Curso creado exitosamente",
      course: newCourse,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: sanitizeErrorMessage(error.message || "Error al crear el curso") },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado. Inicie sesión para continuar.", code: "UNAUTHORIZED" }, { status: 401 });
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

    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId: school.id,
          },
        },
      });

      if (!membership || !membership.isActive) {
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }
    }

    const tenantDb = createTenantPrisma(school.id);
    const courses = await tenantDb.course.findMany({
      where: { schoolId: school.id },
      include: {
        educationLevel: true,
      },
      orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
    });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: sanitizeErrorMessage(error.message || "Error al obtener cursos") },
      { status: 500 }
    );
  }
}

