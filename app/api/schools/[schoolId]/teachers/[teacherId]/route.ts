import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";

export async function GET(
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

    const tenantDb = createTenantPrisma(school.id);
    const teacher = await tenantDb.teacherProfile.findFirst({
      where: {
        id: teacherId,
        membership: { schoolId: school.id },
      },
      include: {
        membership: {
          include: { user: true },
        },
        subjects: {
          where: { schoolId: school.id },
          include: {
            course: {
              include: { educationLevel: true },
            },
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, teacher });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener información del docente" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
          rp.permission.code === PERMISSIONS.PEOPLE_TEACHERS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permiso para modificar datos docentes." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { specialty, firstName, lastName, phone, rutOrNationalId } = body;

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

    // Actualizar perfil docente
    if (specialty !== undefined) {
      await prisma.teacherProfile.update({
        where: { id: teacherId },
        data: { specialty: specialty ? specialty.trim() : null },
      });
    }

    // Actualizar datos de usuario vinculados
    if (firstName || lastName || phone !== undefined || rutOrNationalId !== undefined) {
      await prisma.user.update({
        where: { id: teacher.membership.userId },
        data: {
          ...(firstName ? { firstName: firstName.trim() } : {}),
          ...(lastName ? { lastName: lastName.trim() } : {}),
          ...(phone !== undefined ? { phone: phone ? phone.trim() : null } : {}),
          ...(rutOrNationalId !== undefined
            ? { rutOrNationalId: rutOrNationalId ? rutOrNationalId.trim() : null }
            : {}),
        },
      });
    }

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "UPDATE",
        entityType: "TEACHER_PROFILE",
        entityId: teacherId,
        details: {
          updatedFields: { specialty, firstName, lastName, phone },
        },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Datos del docente actualizados exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar datos del docente" },
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
          rp.permission.code === PERMISSIONS.PEOPLE_TEACHERS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permiso para desvincular profesores." },
          { status: 403 }
        );
      }
    }

    const teacher = await prisma.teacherProfile.findFirst({
      where: {
        id: teacherId,
        membership: { schoolId: school.id },
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: "Docente no encontrado" }, { status: 404 });
    }

    // Desasignar asignaturas primero
    await prisma.subject.updateMany({
      where: {
        teacherProfileId: teacherId,
        schoolId: school.id,
      },
      data: {
        teacherProfileId: null,
      },
    });

    // Desactivar membresía o eliminar perfil
    await prisma.teacherProfile.delete({
      where: { id: teacherId },
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "DELETE",
        entityType: "TEACHER_PROFILE",
        entityId: teacherId,
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Docente desvinculado exitosamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al desvincular docente" },
      { status: 500 }
    );
  }
}
