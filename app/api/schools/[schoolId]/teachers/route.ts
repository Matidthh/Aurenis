import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES } from "@/lib/constants/roles";
import bcrypt from "bcryptjs";

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
      include: {
        roles: true,
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
          { error: "No tienes permiso para gestionar profesores en esta institución." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { firstName, lastName, email, rutOrNationalId, specialty, phone } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Nombres, apellidos y correo son obligatorios." },
        { status: 400 }
      );
    }

    // Buscar o crear usuario profesor
    let teacherUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!teacherUser) {
      const defaultPassword = await bcrypt.hash("Profesor2026!", 10);
      teacherUser = await prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rutOrNationalId: rutOrNationalId ? rutOrNationalId.trim() : null,
          phone: phone ? phone.trim() : null,
          passwordHash: defaultPassword,
          status: "ACTIVE",
        },
      });
    }

    // Obtener rol TEACHER del colegio
    const teacherRole = school.roles.find(
      (r) => r.name === DEFAULT_SCHOOL_ROLES.TEACHER
    );

    if (!teacherRole) {
      return NextResponse.json(
        { error: "El rol de Profesor no está configurado en este colegio." },
        { status: 500 }
      );
    }

    // Membresía institucional
    let membership = await prisma.membership.findUnique({
      where: {
        userId_schoolId: {
          userId: teacherUser.id,
          schoolId: school.id,
        },
      },
    });

    if (!membership) {
      membership = await prisma.membership.create({
        data: {
          userId: teacherUser.id,
          schoolId: school.id,
          roleId: teacherRole.id,
          isActive: true,
        },
      });
    }

    // Perfil docente
    let teacherProfile = await prisma.teacherProfile.findFirst({
      where: { membershipId: membership.id },
    });

    if (!teacherProfile) {
      teacherProfile = await prisma.teacherProfile.create({
        data: {
          membershipId: membership.id,
          specialty: specialty ? specialty.trim() : "Docente General",
        },
      });
    }

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "CREATE",
        entityType: "TEACHER_PROFILE",
        entityId: teacherProfile.id,
        details: {
          teacher: `${firstName} ${lastName}`,
          specialty,
        },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profesor registrado exitosamente",
      teacherProfileId: teacherProfile.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al registrar profesor" },
      { status: 500 }
    );
  }
}
