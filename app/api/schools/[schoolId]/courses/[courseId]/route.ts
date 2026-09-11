import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { UpdateCourseSchema } from "@/lib/validations/course.schema";
import { updateCourse, deleteCourse } from "@/lib/services/academic.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; courseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, courseId } = await params;

    // Verificar pertenencia al colegio y permisos para gestionar cursos
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
        return NextResponse.json(
          { error: "Acceso denegado a esta institución (violación de aislamiento multi-tenant)" },
          { status: 403 }
        );
      }

      const canManageCourses = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE
      );

      if (!canManageCourses) {
        return NextResponse.json(
          { error: "Acceso denegado. El rol Profesor o no-administrador no tiene permitido alterar cursos." },
          { status: 403 }
        );
      }
    }

    // Verificar si el curso existe y pertenece al colegio actual
    const targetCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!targetCourse) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    if (targetCourse.schoolId !== schoolId) {
      return NextResponse.json(
        { error: "Acceso denegado. No está permitido alterar cursos pertenecientes a otra institución o ajenos." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validated = UpdateCourseSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(schoolId);
    const updated = await updateCourse(tenantDb, schoolId, courseId, validated.data, session.userId);

    return NextResponse.json({ success: true, course: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar curso" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; courseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, courseId } = await params;

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
        return NextResponse.json(
          { error: "Acceso denegado a esta institución" },
          { status: 403 }
        );
      }

      const canManage = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE
      );

      if (!canManage) {
        return NextResponse.json(
          { error: "Acceso denegado. Permisos insuficientes para eliminar cursos." },
          { status: 403 }
        );
      }
    }

    const targetCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!targetCourse) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    if (targetCourse.schoolId !== schoolId) {
      return NextResponse.json(
        { error: "Acceso denegado. Intento de eliminación de curso ajeno." },
        { status: 403 }
      );
    }

    const tenantDb = createTenantPrisma(schoolId);
    await deleteCourse(tenantDb, schoolId, courseId, session.userId);

    return NextResponse.json({ success: true, message: "Curso eliminado con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar curso" }, { status: 500 });
  }
}
