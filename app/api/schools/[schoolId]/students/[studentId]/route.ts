export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { validateStudentRecordAccess } from "@/lib/security/object-authorization";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; studentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, studentId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    // Comprobar pertenencia al colegio y permisos a nivel de objeto (BOLA / IDOR)
    const authResult = await validateStudentRecordAccess(
      session,
      school.id,
      studentId
    );

    if (!authResult.allowed) {
      return NextResponse.json(
        { error: authResult.reason || "Acceso denegado" },
        { status: authResult.statusCode || 403 }
      );
    }

    const tenantDb = createTenantPrisma(school.id);

    // Buscar por ID de studentProfile o enrollment
    const student = await tenantDb.studentProfile.findFirst({
      where: {
        OR: [
          { id: studentId },
          { membershipId: studentId },
          { enrollments: { some: { id: studentId } } },
        ],
        membership: { schoolId: school.id },
      },
      include: {
        membership: {
          include: { user: true },
        },
        enrollments: {
          where: { schoolId: school.id, deletedAt: null },
          include: {
            course: {
              include: { educationLevel: true },
            },
            grades: {
              include: { assessment: { include: { subject: true } } },
              orderBy: { createdAt: "desc" },
            },
          },
        },
        guardians: {
          include: {
            guardian: {
              include: {
                membership: {
                  include: { user: true },
                },
              },
            },
          },
        },
        attendances: {
          where: { schoolId: school.id },
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Ficha de estudiante no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener ficha" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; studentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, studentId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    // Verificar permisos
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
          { error: "No tienes permiso para modificar datos de estudiantes." },
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
      phone,
      birthDate,
      medicalNotes,
      enrollmentNumber,
      courseId,
      status,
      guardianFirstName,
      guardianLastName,
      guardianEmail,
      guardianPhone,
      guardianRelationship,
    } = body;

    const tenantDb = createTenantPrisma(school.id);

    // Encontrar student profile
    const student = await tenantDb.studentProfile.findFirst({
      where: {
        OR: [
          { id: studentId },
          { membershipId: studentId },
          { enrollments: { some: { id: studentId } } },
        ],
        membership: { schoolId: school.id },
      },
      include: {
        membership: true,
        guardians: true,
        enrollments: { where: { schoolId: school.id, deletedAt: null } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    // Actualizar User
    if (firstName || lastName || email || rutOrNationalId !== undefined || phone !== undefined) {
      await prisma.user.update({
        where: { id: student.membership.userId },
        data: {
          ...(firstName ? { firstName: firstName.trim() } : {}),
          ...(lastName ? { lastName: lastName.trim() } : {}),
          ...(email ? { email: email.trim().toLowerCase() } : {}),
          ...(rutOrNationalId !== undefined ? { rutOrNationalId: rutOrNationalId ? rutOrNationalId.trim() : null } : {}),
          ...(phone !== undefined ? { phone: phone ? phone.trim() : null } : {}),
        },
      });
    }

    // Actualizar Student Profile
    await tenantDb.studentProfile.update({
      where: { id: student.id },
      data: {
        ...(enrollmentNumber !== undefined ? { enrollmentNumber: enrollmentNumber.trim() } : {}),
        ...(medicalNotes !== undefined ? { medicalNotes: medicalNotes.trim() } : {}),
        ...(birthDate !== undefined ? { birthDate: birthDate ? new Date(birthDate) : null } : {}),
      },
    });

    // Actualizar o reasignar curso en la matrícula activa
    const activeEnrollment = student.enrollments[0];
    if (activeEnrollment && (courseId || status)) {
      await tenantDb.enrollment.update({
        where: { id: activeEnrollment.id },
        data: {
          ...(courseId ? { courseId } : {}),
          ...(status ? { status } : {}),
        },
      });
    }

    // Actualizar o crear Apoderado si se proporcionó información
    if (guardianFirstName && guardianLastName && guardianEmail) {
      let guardianUser = await prisma.user.findUnique({
        where: { email: guardianEmail.trim().toLowerCase() },
      });

      if (!guardianUser) {
        guardianUser = await prisma.user.create({
          data: {
            email: guardianEmail.trim().toLowerCase(),
            firstName: guardianFirstName.trim(),
            lastName: guardianLastName.trim(),
            phone: guardianPhone ? guardianPhone.trim() : null,
            passwordHash: "$2a$10$defaultHashPlaceholderForGuardianAccess",
            status: "ACTIVE",
          },
        });
      } else {
        await prisma.user.update({
          where: { id: guardianUser.id },
          data: {
            firstName: guardianFirstName.trim(),
            lastName: guardianLastName.trim(),
            ...(guardianPhone !== undefined ? { phone: guardianPhone ? guardianPhone.trim() : null } : {}),
          },
        });
      }

      // Membresía de apoderado
      const guardianRole = await prisma.role.findFirst({
        where: { schoolId: school.id, name: "GUARDIAN" },
      });

      if (guardianRole) {
        let guardianMembership = await prisma.membership.findUnique({
          where: {
            userId_schoolId: {
              userId: guardianUser.id,
              schoolId: school.id,
            },
          },
        });

        if (!guardianMembership) {
          guardianMembership = await prisma.membership.create({
            data: {
              userId: guardianUser.id,
              schoolId: school.id,
              roleId: guardianRole.id,
              isActive: true,
            },
          });
        }

        let guardianProfile = await prisma.guardianProfile.findFirst({
          where: { membershipId: guardianMembership.id },
        });

        if (!guardianProfile) {
          guardianProfile = await prisma.guardianProfile.create({
            data: {
              membershipId: guardianMembership.id,
            },
          });
        }

        // Vincular relación apoderado-alumno
        const existingRel = student.guardians.find((g) => g.guardianProfileId === guardianProfile?.id);
        if (!existingRel && guardianProfile) {
          await prisma.studentGuardian.create({
            data: {
              studentProfileId: student.id,
              guardianProfileId: guardianProfile.id,
              relationship: guardianRelationship || "Apoderado Titular",
              isEmergencyContact: true,
              canPickUp: true,
            },
          });
        } else if (existingRel && guardianRelationship) {
          await prisma.studentGuardian.update({
            where: { id: existingRel.id },
            data: {
              relationship: guardianRelationship,
            },
          });
        }
      }
    }

    // Auditoría
    await prisma.auditLog.create({
      data: {
        schoolId: school.id,
        userId: session.userId,
        action: "UPDATE",
        entityType: "STUDENT_PROFILE",
        entityId: student.id,
        details: {
          updatedFields: Object.keys(body),
        },
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Ficha del estudiante actualizada correctamente.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al actualizar la ficha del estudiante" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; studentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, studentId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    // Comprobar pertenencia al colegio y permisos para eliminar (aislamiento multi-tenant)
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
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const canManage = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.PEOPLE_STUDENTS_MANAGE ||
          rp.permission.code === "*"
      );

      if (!canManage) {
        return NextResponse.json({ error: "Acceso denegado. Sin permisos para eliminar estudiantes." }, { status: 403 });
      }
    }

    const tenantDb = createTenantPrisma(school.id);

    const student = await tenantDb.studentProfile.findFirst({
      where: {
        OR: [
          { id: studentId },
          { membershipId: studentId },
          { enrollments: { some: { id: studentId } } },
        ],
        membership: { schoolId: school.id },
      },
      include: {
        enrollments: { where: { schoolId: school.id } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 });
    }

    // Soft delete enrollments
    await tenantDb.enrollment.updateMany({
      where: { studentProfileId: student.id, schoolId: school.id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });

    return NextResponse.json({
      success: true,
      message: "Matrícula del estudiante dada de baja exitosamente.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al procesar la baja del estudiante" },
      { status: 500 }
    );
  }
}
