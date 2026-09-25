export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES } from "@/lib/constants/roles";
import { listStudentsBySchool } from "@/lib/services/student.service";
import bcrypt from "bcryptjs";
import { encryptField } from "@/lib/security/encryption";
import { sanitizeErrorMessage } from "@/lib/api/response";

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
    const school = await prisma.school.findFirst({
      where: {
        OR: [{ id: schoolId }, { slug: schoolId }],
      },
    });

    if (!school) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    const tenantDb = createTenantPrisma(school.id);
    const students = await listStudentsBySchool(tenantDb, school.id);

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al obtener estudiantes" },
      { status: 500 }
    );
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
          rp.permission.code === PERMISSIONS.PEOPLE_STUDENTS_MANAGE ||
          rp.permission.code === PERMISSIONS.PEOPLE_ENROLLMENT_MANAGE ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return NextResponse.json(
          { error: "No tienes permiso para matricular estudiantes en esta institución." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      rutOrNationalId,
      courseId,
      enrollmentNumber,
    } = body;

    if (!firstName || !lastName || !email || !courseId) {
      return NextResponse.json(
        { error: "Nombres, apellidos, correo y curso son obligatorios." },
        { status: 400 }
      );
    }

    // Validación estricta de pertenencia multi-tenant del curso (Autor: Maicol R.)
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        schoolId: school.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "El curso especificado no existe o no pertenece a esta institución educativa." },
        { status: 400 }
      );
    }

    // Buscar o crear usuario estudiante
    let studentUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    let generatedPassword: string | null = null;
    if (!studentUser) {
      // Generación de contraseña temporal con alta entropía CSPRNG (Autor: Lucas P.)
      generatedPassword = `${crypto.randomBytes(8).toString("base64url")}!A1`;
      const defaultPassword = await bcrypt.hash(generatedPassword, 10);
      studentUser = await prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          rutOrNationalId: rutOrNationalId ? encryptField(rutOrNationalId.trim()) : null,
          passwordHash: defaultPassword,
          status: "ACTIVE",
        },
      });
    }

    // Obtener rol STUDENT del colegio
    const studentRole = school.roles.find(
      (r) => r.name === DEFAULT_SCHOOL_ROLES.STUDENT
    );

    if (!studentRole) {
      return NextResponse.json(
        { error: "El rol de Estudiante no está configurado en este colegio." },
        { status: 500 }
      );
    }

    // Membresía institucional
    let membership = await prisma.membership.findUnique({
      where: {
        userId_schoolId: {
          userId: studentUser.id,
          schoolId: school.id,
        },
      },
    });

    if (!membership) {
      membership = await prisma.membership.create({
        data: {
          userId: studentUser.id,
          schoolId: school.id,
          roleId: studentRole.id,
          isActive: true,
        },
      });
    }

    // Perfil de estudiante
    let studentProfile = await prisma.studentProfile.findFirst({
      where: { membershipId: membership.id },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          membershipId: membership.id,
          enrollmentNumber: enrollmentNumber || `MAT-${Date.now().toString().slice(-6)}`,
        },
      });
    }

    // Matrícula en curso
    const tenantDb = createTenantPrisma(school.id);
    const currentYear = new Date().getFullYear();

    const enrollment = await tenantDb.enrollment.create({
      data: {
        schoolId: school.id,
        studentProfileId: studentProfile.id,
        courseId,
        year: currentYear,
        status: "ACTIVE",
      },
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "CREATE",
        entityType: "STUDENT_ENROLLMENT",
        entityId: enrollment.id,
        details: {
          student: `${firstName} ${lastName}`,
          courseId,
          year: currentYear,
        },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Estudiante matriculado exitosamente",
      enrollmentId: enrollment.id,
      ...(generatedPassword ? { temporaryPassword: generatedPassword } : {}),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: sanitizeErrorMessage(error.message || "Error al matricular estudiante") },
      { status: 500 }
    );
  }
}
