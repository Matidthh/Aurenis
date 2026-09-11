import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { CreateCourseSchema } from "@/lib/validations/course.schema";
import { listCoursesByYear, createCourse } from "@/lib/services/academic.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId } = await params;

    // Verificar pertenencia al colegio
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: { userId: session.userId, schoolId },
        },
      });

      if (!membership || !membership.isActive) {
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()), 10);

    const tenantDb = createTenantPrisma(schoolId);
    const courses = await listCoursesByYear(tenantDb, schoolId, year);

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener cursos" }, { status: 500 });
  }
}

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

    // Verificar permiso para gestionar cursos (ACADEMIC_COURSES_MANAGE)
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: { userId: session.userId, schoolId },
        },
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const canManageCourses = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE
      );

      if (!canManageCourses) {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren privilegios de administración de cursos (rol Escuela o Director)." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = CreateCourseSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de curso inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(schoolId);
    const course = await createCourse(tenantDb, schoolId, validated.data, session.userId);

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear curso" }, { status: 500 });
  }
}
