import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; teacherId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, teacherId } = await params;
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
          rp.permission.code === PERMISSIONS.PEOPLE_TEACHERS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permisos para asignar asignaturas a profesores." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { subjectId, hoursPerWeek, createNewSubject } = body;

    const teacher = await prisma.teacherProfile.findFirst({
      where: {
        id: teacherId,
        membership: { schoolId: school.id },
      },
      include: {
        membership: {
          include: { user: true },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });
    }

    const tenantDb = createTenantPrisma(school.id);

    // Caso 1: Crear y asignar una nueva asignatura directamente
    if (createNewSubject) {
      const { name, code, courseId } = createNewSubject;
      if (!name || !courseId) {
        return NextResponse.json(
          { error: "Nombre de asignatura y curso son requeridos para crear una nueva asignación." },
          { status: 400 }
        );
      }

      const newSubject = await tenantDb.subject.create({
        data: {
          name: name.trim(),
          code: code ? code.trim().toUpperCase() : null,
          courseId,
          teacherProfileId: teacherId,
          hoursPerWeek: parseInt(hoursPerWeek, 10) || 4,
          schoolId: school.id,
        },
        include: {
          course: {
            include: { educationLevel: true },
          },
        },
      });

      // Auditoría
      await prisma.auditLog.create({
        data: {
          schoolId: school.id,
          userId: session.userId,
          action: "CREATE",
          entityType: "SUBJECT_ASSIGNMENT",
          entityId: newSubject.id,
          details: {
            teacher: `${teacher.membership.user.firstName} ${teacher.membership.user.lastName}`,
            subject: newSubject.name,
            courseId,
          },
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Asignatura creada y asignada exitosamente",
        subject: newSubject,
      });
    }

    // Caso 2: Vincular asignatura existente
    if (!subjectId) {
      return NextResponse.json(
        { error: "Debe especificar la asignatura a asignar" },
        { status: 400 }
      );
    }

    const existingSubject = await tenantDb.subject.findFirst({
      where: { id: subjectId, schoolId: school.id },
      include: { course: true },
    });

    if (!existingSubject) {
      return NextResponse.json({ error: "Asignatura no encontrada" }, { status: 404 });
    }

    const updatedSubject = await tenantDb.subject.update({
      where: { id: subjectId },
      data: {
        teacherProfileId: teacherId,
        ...(hoursPerWeek !== undefined ? { hoursPerWeek: parseInt(hoursPerWeek, 10) || 4 } : {}),
      },
      include: {
        course: {
          include: { educationLevel: true },
        },
      },
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "UPDATE",
        entityType: "SUBJECT_ASSIGNMENT",
        entityId: subjectId,
        details: {
          teacher: `${teacher.membership.user.firstName} ${teacher.membership.user.lastName}`,
          subject: updatedSubject.name,
          course: existingSubject.course.name,
        },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Asignatura asignada al docente exitosamente",
      subject: updatedSubject,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al procesar la asignación" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; teacherId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, teacherId } = await params;
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
          rp.permission.code === PERMISSIONS.PEOPLE_TEACHERS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permisos para desvincular asignaturas de profesores." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { subjectId } = body;

    if (!subjectId) {
      return NextResponse.json(
        { error: "Se requiere el identificador de la asignatura a desvincular." },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(school.id);

    const subject = await tenantDb.subject.findFirst({
      where: {
        id: subjectId,
        teacherProfileId: teacherId,
        schoolId: school.id,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "La asignatura no pertenece a este profesor o no existe." },
        { status: 404 }
      );
    }

    await tenantDb.subject.update({
      where: { id: subjectId },
      data: {
        teacherProfileId: null,
      },
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "UPDATE",
        entityType: "SUBJECT_UNASSIGNMENT",
        entityId: subjectId,
        details: { teacherId, subjectName: subject.name },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Asignatura desvinculada del docente exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al desvincular la asignatura" },
      { status: 500 }
    );
  }
}
