import { AuditAction, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { CreateStudentInput, UpdateStudentInput, StudentFilters } from "@/lib/validations/student.schema";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "@/lib/constants/roles";

export class StudentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StudentServiceError";
  }
}

/**
 * Crear un nuevo estudiante con su usuario, perfil y matrícula
 */
export async function createStudent(data: CreateStudentInput, creatorUserId?: string) {
  // 1. Verificar que el colegio existe
  const school = await prisma.school.findUnique({
    where: { id: data.schoolId },
  });

  if (!school) {
    throw new StudentServiceError("El colegio especificado no existe");
  }

  // 2. Verificar que el curso existe y pertenece al colegio
  const course = await prisma.course.findUnique({
    where: { id: data.courseId },
  });

  if (!course || course.schoolId !== data.schoolId) {
    throw new StudentServiceError("El curso especificado no existe o no pertenece al colegio");
  }

  // 3. Verificar que el email no esté en uso
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw new StudentServiceError("El correo electrónico ya está en uso");
  }

  // 4. Ejecutar transacción para crear usuario, perfil y matrícula
  const result = await prisma.$transaction(async (tx) => {
    // A. Crear usuario
    const hashedPassword = await hashPassword(data.password);
    const user = await tx.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        rutOrNationalId: data.rutOrNationalId,
        phone: data.phone,
        status: UserStatus.ACTIVE,
      },
    });

    // B. Obtener o crear rol de estudiante para el colegio
    let studentRole = await tx.role.findFirst({
      where: {
        schoolId: data.schoolId,
        name: DEFAULT_SCHOOL_ROLES.STUDENT,
      },
    });

    if (!studentRole) {
      // Crear rol de estudiante si no existe
      const studentPreset = ROLE_PRESETS[DEFAULT_SCHOOL_ROLES.STUDENT];
      studentRole = await tx.role.create({
        data: {
          schoolId: data.schoolId,
          name: studentPreset.name,
          displayName: studentPreset.displayName,
          description: studentPreset.description,
          isSystem: true,
        },
      });

      // Asignar permisos al rol
      const systemPermissions = await tx.permission.findMany();
      const rolePermissionData = studentPreset.permissions
        .map((code) => {
          const perm = systemPermissions.find((p) => p.code === code);
          return perm ? { roleId: studentRole!.id, permissionId: perm.id } : null;
        })
        .filter(Boolean) as { roleId: string; permissionId: string }[];

      if (rolePermissionData.length > 0) {
        await tx.rolePermission.createMany({
          data: rolePermissionData,
        });
      }
    }

    // C. Crear membresía
    const membership = await tx.membership.create({
      data: {
        userId: user.id,
        schoolId: data.schoolId,
        roleId: studentRole.id,
        isActive: true,
      },
    });

    // D. Crear perfil de estudiante
    const studentProfile = await tx.studentProfile.create({
      data: {
        membershipId: membership.id,
        enrollmentNumber: data.enrollmentNumber,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        medicalNotes: data.medicalNotes,
      },
    });

    // E. Crear matrícula en el curso
    const enrollment = await tx.enrollment.create({
      data: {
        schoolId: data.schoolId,
        courseId: data.courseId,
        studentProfileId: studentProfile.id,
        year: data.year,
        status: "ACTIVE",
      },
    });

    return {
      user,
      membership,
      studentProfile,
      enrollment,
    };
  });

  // 5. Registrar auditoría
  await logAuditEvent({
    schoolId: data.schoolId,
    userId: creatorUserId,
    action: AuditAction.CREATE,
    entityType: "STUDENT",
    entityId: result.studentProfile.id,
    details: {
      email: result.user.email,
      name: `${result.user.firstName} ${result.user.lastName}`,
      courseId: data.courseId,
      year: data.year,
    },
  });

  return result;
}

/**
 * Obtener estudiantes con paginación y filtros
 */
export async function getStudents(filters: StudentFilters, requestorSchoolId?: string, isSystemAdmin?: boolean) {
  const { page, limit, search, courseId, year, schoolId } = filters;
  const skip = (page - 1) * limit;

  // Construir where clause
  const where: any = {};

  // Si no es system admin, filtrar por colegio del solicitante
  if (!isSystemAdmin && requestorSchoolId) {
    where.schoolId = requestorSchoolId;
  } else if (schoolId) {
    where.schoolId = schoolId;
  }

  // Filtro por curso
  if (courseId) {
    where.courseId = courseId;
  }

  // Filtro por año
  if (year) {
    where.year = year;
  }

  // Búsqueda por nombre o RUT
  if (search) {
    where.OR = [
      {
        student: {
          membership: {
            user: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { rutOrNationalId: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        },
      },
    ];
  }

  // Obtener total y datos
  const [total, students] = await Promise.all([
    prisma.enrollment.count({ where }),
    prisma.enrollment.findMany({
      where,
      skip,
      take: limit,
      include: {
        student: {
          include: {
            membership: {
              include: {
                user: true,
              },
            },
            guardians: {
              include: {
                guardian: {
                  include: {
                    membership: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        course: {
          include: {
            educationLevel: true,
          },
        },
      },
      orderBy: [
        { year: "desc" },
        { course: { gradeNumber: "asc" } },
        { course: { name: "asc" } },
        { student: { membership: { user: { lastName: "asc" } } } },
      ],
    }),
  ]);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Alias para compatibilidad - Listar estudiantes por colegio
 */
export async function listStudentsBySchool(filters: StudentFilters, requestorSchoolId?: string, isSystemAdmin?: boolean) {
  return getStudents(filters, requestorSchoolId, isSystemAdmin);
}

/**
 * Obtener un estudiante por ID
 */
export async function getStudentById(studentProfileId: string, requestorSchoolId?: string, isSystemAdmin?: boolean) {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentProfileId,
      ...(requestorSchoolId && !isSystemAdmin && { schoolId: requestorSchoolId }),
    },
    include: {
      student: {
        include: {
          membership: {
            include: {
              user: true,
              role: true,
            },
          },
        },
      },
      course: {
        include: {
          educationLevel: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new StudentServiceError("Estudiante no encontrado");
  }

  return enrollment;
}

/**
 * Actualizar un estudiante
 */
export async function updateStudent(studentProfileId: string, data: UpdateStudentInput, updaterUserId?: string, requestorSchoolId?: string) {
  // 1. Verificar que el estudiante existe y pertenece al colegio
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentProfileId,
      ...(requestorSchoolId && { schoolId: requestorSchoolId }),
    },
    include: {
      student: {
        include: {
          membership: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new StudentServiceError("Estudiante no encontrado");
  }

  // 2. Actualizar datos
  const result = await prisma.$transaction(async (tx) => {
    // Actualizar usuario si se proporcionan datos
    if (data.email || data.firstName || data.lastName || data.rutOrNationalId || data.phone) {
      await tx.user.update({
        where: { id: enrollment.student.membership.user.id },
        data: {
          ...(data.email && { email: data.email.toLowerCase() }),
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
          ...(data.rutOrNationalId !== undefined && { rutOrNationalId: data.rutOrNationalId }),
          ...(data.phone !== undefined && { phone: data.phone }),
        },
      });
    }

    // Actualizar perfil de estudiante
    const updatedProfile = await tx.studentProfile.update({
      where: { id: studentProfileId },
      data: {
        ...(data.enrollmentNumber !== undefined && { enrollmentNumber: data.enrollmentNumber }),
        ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
        ...(data.medicalNotes !== undefined && { medicalNotes: data.medicalNotes }),
      },
    });

    return updatedProfile;
  });

  // 3. Registrar auditoría
  await logAuditEvent({
    schoolId: enrollment.schoolId,
    userId: updaterUserId,
    action: AuditAction.UPDATE,
    entityType: "STUDENT",
    entityId: studentProfileId,
    details: {
      email: enrollment.student.membership.user.email,
      changes: data,
    },
  });

  return result;
}

/**
 * Soft delete de un estudiante
 */
export async function deleteStudent(studentProfileId: string, deleterUserId?: string, requestorSchoolId?: string) {
  // 1. Verificar que el estudiante existe y pertenece al colegio
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentProfileId,
      ...(requestorSchoolId && { schoolId: requestorSchoolId }),
    },
    include: {
      student: {
        include: {
          membership: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new StudentServiceError("Estudiante no encontrado");
  }

  // 2. Soft delete de la matrícula
  const result = await prisma.$transaction(async (tx) => {
    // Soft delete matrícula
    const updatedEnrollment = await tx.enrollment.update({
      where: { id: enrollment.id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Soft delete membresía
    await tx.membership.update({
      where: { id: enrollment.student.membership.id },
      data: {
        isActive: false,
      },
    });

    // Soft delete usuario
    await tx.user.update({
      where: { id: enrollment.student.membership.user.id },
      data: {
        status: UserStatus.SUSPENDED,
        deletedAt: new Date(),
      },
    });

    return updatedEnrollment;
  });

  // 3. Registrar auditoría
  await logAuditEvent({
    schoolId: enrollment.schoolId,
    userId: deleterUserId,
    action: AuditAction.DELETE,
    entityType: "STUDENT",
    entityId: studentProfileId,
    details: {
      email: enrollment.student.membership.user.email,
      name: `${enrollment.student.membership.user.firstName} ${enrollment.student.membership.user.lastName}`,
    },
  });

  return result;
}