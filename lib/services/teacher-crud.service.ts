/**
 * Servicio CRUD para Profesores
 * Lógica de negocio para gestión de profesores con validaciones
 */

import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { validateRUT } from '@/lib/validations';
import { AuditAction } from '@prisma/client';
import { logAuditEvent } from './audit.service';

export class TeacherServiceError extends Error {
  constructor(message: string, public code: string = 'TEACHER_SERVICE_ERROR') {
    super(message);
    this.name = 'TeacherServiceError';
  }
}

/**
 * Verifica si un email ya existe en el sistema
 */
async function checkEmailUnique(email: string, excludeUserId?: string): Promise<boolean> {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      ...(excludeUserId && { id: { not: excludeUserId } }),
    },
  });

  return !existingUser;
}

/**
 * Verifica si un RUT ya existe en el sistema
 */
async function checkRutUnique(rut: string, excludeUserId?: string): Promise<boolean> {
  if (!rut) return true;

  const existingUser = await prisma.user.findFirst({
    where: {
      rutOrNationalId: rut.toUpperCase(),
      ...(excludeUserId && { id: { not: excludeUserId } }),
    },
  });

  return !existingUser;
}

/**
 * Crea un nuevo profesor
 */
export async function createTeacher(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  rutOrNationalId?: string;
  phone?: string;
  specialty: string;
  schoolId: string;
  checkEmailUnique?: boolean;
  checkRutUnique?: boolean;
}, creatorUserId?: string) {
  try {
    // Verificar unicidad de email si se solicita
    if (data.checkEmailUnique !== false) {
      const emailUnique = await checkEmailUnique(data.email);
      if (!emailUnique) {
        throw new TeacherServiceError(
          'El correo electrónico ya está registrado en el sistema',
          'DUPLICATE_EMAIL'
        );
      }
    }

    // Verificar unicidad de RUT si se proporciona y se solicita
    if (data.rutOrNationalId && data.checkRutUnique !== false) {
      const rutUnique = await checkRutUnique(data.rutOrNationalId);
      if (!rutUnique) {
        throw new TeacherServiceError(
          'El RUT ya está registrado en el sistema',
          'DUPLICATE_RUT'
        );
      }
    }

    // Validar formato de RUT si se proporciona
    if (data.rutOrNationalId && !validateRUT(data.rutOrNationalId)) {
      throw new TeacherServiceError(
        'El RUT no tiene un formato válido',
        'INVALID_RUT'
      );
    }

    // Obtener rol de profesor para el colegio
    const teacherRole = await prisma.role.findFirst({
      where: {
        schoolId: data.schoolId,
        name: 'TEACHER',
      },
    });

    if (!teacherRole) {
      throw new TeacherServiceError(
        'Rol de profesor no encontrado en este colegio',
        'ROLE_NOT_FOUND'
      );
    }

    // Crear usuario
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        rutOrNationalId: data.rutOrNationalId?.toUpperCase(),
        phone: data.phone,
        status: 'ACTIVE',
      },
    });

    // Crear membresía
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        schoolId: data.schoolId,
        roleId: teacherRole.id,
        isActive: true,
      },
    });

    // Crear perfil de profesor
    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        membershipId: membership.id,
        specialty: data.specialty,
      },
      include: {
        membership: {
          include: {
            user: true,
            role: true,
          },
        },
      },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId: data.schoolId,
      userId: creatorUserId,
      action: AuditAction.CREATE,
      entityType: 'TEACHER',
      entityId: teacherProfile.id,
      details: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        specialty: teacherProfile.specialty,
      },
    });

    return teacherProfile;
  } catch (error) {
    if (error instanceof TeacherServiceError) {
      throw error;
    }
    throw new TeacherServiceError(
      `Error al crear profesor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'CREATE_ERROR'
    );
  }
}

/**
 * Obtiene un profesor por ID
 */
export async function getTeacherById(teacherId: string, schoolId: string) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    include: {
      membership: {
        include: {
          user: true,
          role: true,
        },
      },
      subjects: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new TeacherServiceError('Profesor no encontrado', 'NOT_FOUND');
  }

  // Verificar que pertenezca al colegio
  if (teacher.membership.schoolId !== schoolId) {
    throw new TeacherServiceError('El profesor no pertenece a este colegio', 'FORBIDDEN');
  }

  return teacher;
}

/**
 * Actualiza un profesor
 */
export async function updateTeacher(
  teacherId: string,
  schoolId: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    rutOrNationalId?: string;
    phone?: string;
    specialty?: string;
  },
  updaterUserId?: string
) {
  try {
    const teacher = await getTeacherById(teacherId, schoolId);

    // Verificar unicidad de email si se actualiza
    if (data.email && data.email !== teacher.membership.user.email) {
      const emailUnique = await checkEmailUnique(data.email, teacher.membership.userId);
      if (!emailUnique) {
        throw new TeacherServiceError(
          'El correo electrónico ya está registrado en el sistema',
          'DUPLICATE_EMAIL'
        );
      }
    }

    // Verificar unicidad de RUT si se actualiza
    if (data.rutOrNationalId && data.rutOrNationalId !== teacher.membership.user.rutOrNationalId) {
      const rutUnique = await checkRutUnique(data.rutOrNationalId, teacher.membership.userId);
      if (!rutUnique) {
        throw new TeacherServiceError(
          'El RUT ya está registrado en el sistema',
          'DUPLICATE_RUT'
        );
      }

      // Validar formato de RUT
      if (!validateRUT(data.rutOrNationalId)) {
        throw new TeacherServiceError(
          'El RUT no tiene un formato válido',
          'INVALID_RUT'
        );
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: teacher.membership.userId },
      data: {
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.rutOrNationalId !== undefined && { rutOrNationalId: data.rutOrNationalId?.toUpperCase() }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });

    // Actualizar especialidad si se proporciona
    let updatedTeacher = teacher;
    if (data.specialty !== undefined) {
      updatedTeacher = await prisma.teacherProfile.update({
        where: { id: teacherId },
        data: { specialty: data.specialty },
        include: {
          membership: {
            include: {
              user: true,
              role: true,
            },
          },
          subjects: {
            include: {
              course: true,
            },
          },
        },
      });
    }

    // Registrar auditoría
    await logAuditEvent({
      schoolId,
      userId: updaterUserId,
      action: AuditAction.UPDATE,
      entityType: 'TEACHER',
      entityId: teacherId,
      details: {
        changes: data,
      },
    });

    return updatedTeacher;
  } catch (error) {
    if (error instanceof TeacherServiceError) {
      throw error;
    }
    throw new TeacherServiceError(
      `Error al actualizar profesor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'UPDATE_ERROR'
    );
  }
}

/**
 * Elimina un profesor (soft delete)
 */
export async function deleteTeacher(teacherId: string, schoolId: string, deleterUserId?: string) {
  try {
    const teacher = await getTeacherById(teacherId, schoolId);

    // Verificar que no tenga asignaturas activas
    const activeSubjects = await prisma.subject.findMany({
      where: {
        teacherProfileId: teacherId,
      },
    });

    if (activeSubjects.length > 0) {
      throw new TeacherServiceError(
        'No se puede eliminar el profesor porque tiene asignaturas activas',
        'HAS_ACTIVE_SUBJECTS'
      );
    }

    // Soft delete del usuario
    await prisma.user.update({
      where: { id: teacher.membership.userId },
      data: { deletedAt: new Date() },
    });

    // Desactivar membresía
    await prisma.membership.update({
      where: { id: teacher.membership.id },
      data: { isActive: false },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId,
      userId: deleterUserId,
      action: AuditAction.DELETE,
      entityType: 'TEACHER',
      entityId: teacherId,
      details: {
        teacherName: `${teacher.membership.user.firstName} ${teacher.membership.user.lastName}`,
      },
    });

    return { success: true, message: 'Profesor eliminado exitosamente' };
  } catch (error) {
    if (error instanceof TeacherServiceError) {
      throw error;
    }
    throw new TeacherServiceError(
      `Error al eliminar profesor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'DELETE_ERROR'
    );
  }
}

/**
 * Lista profesores de un colegio
 */
export async function listTeachers(schoolId: string, filters: {
  specialty?: string;
  courseId?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const where: any = {
    membership: {
      schoolId,
      isActive: true,
      user: {
        deletedAt: null,
      },
    },
  };

  if (filters.specialty) {
    where.specialty = {
      contains: filters.specialty,
      mode: 'insensitive',
    };
  }

  if (filters.search) {
    where.membership.user = {
      ...where.membership.user,
      OR: [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ],
    };
  }

  const teachers = await prisma.teacherProfile.findMany({
    where,
    include: {
      membership: {
        include: {
          user: true,
          role: true,
        },
      },
      subjects: filters.courseId ? {
        where: { courseId: filters.courseId },
        include: { course: true },
      } : true,
    },
    take: filters.limit || 20,
    skip: filters.offset || 0,
    orderBy: {
      membership: {
        user: {
          firstName: 'asc',
        },
      },
    },
  });

  const total = await prisma.teacherProfile.count({ where });

  return {
    teachers,
    pagination: {
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      total,
    },
  };
}

/**
 * Asigna profesor a asignatura
 */
export async function assignTeacherToSubject(
  teacherId: string,
  subjectId: string,
  schoolId: string,
  assignerUserId?: string
) {
  try {
    // Verificar que el profesor exista y pertenezca al colegio
    const teacher = await getTeacherById(teacherId, schoolId);

    // Verificar que la asignatura exista y pertenezca al colegio
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { school: true },
    });

    if (!subject || subject.schoolId !== schoolId) {
      throw new TeacherServiceError(
        'Asignatura no encontrada o no pertenece a este colegio',
        'SUBJECT_NOT_FOUND'
      );
    }

    // Verificar que la asignatura no tenga profesor asignado
    if (subject.teacherProfileId) {
      throw new TeacherServiceError(
        'La asignatura ya tiene un profesor asignado',
        'SUBJECT_HAS_TEACHER'
      );
    }

    // Asignar profesor
    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { teacherProfileId: teacherId },
      include: {
        teacher: {
          include: {
            membership: {
              include: {
                user: true,
              },
            },
          },
        },
        course: true,
      },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId,
      userId: assignerUserId,
      action: AuditAction.UPDATE,
      entityType: 'SUBJECT',
      entityId: subjectId,
      details: {
        teacherId,
        teacherName: `${teacher.membership.user.firstName} ${teacher.membership.user.lastName}`,
        subjectName: subject.name,
      },
    });

    return updatedSubject;
  } catch (error) {
    if (error instanceof TeacherServiceError) {
      throw error;
    }
    throw new TeacherServiceError(
      `Error al asignar profesor a asignatura: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'ASSIGN_ERROR'
    );
  }
}

/**
 * Desasigna profesor de asignatura
 */
export async function unassignTeacherFromSubject(
  subjectId: string,
  schoolId: string,
  unassignerUserId?: string
) {
  try {
    // Verificar que la asignatura exista y pertenezca al colegio
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { school: true },
    });

    if (!subject || subject.schoolId !== schoolId) {
      throw new TeacherServiceError(
        'Asignatura no encontrada o no pertenece a este colegio',
        'SUBJECT_NOT_FOUND'
      );
    }

    if (!subject.teacherProfileId) {
      throw new TeacherServiceError(
        'La asignatura no tiene profesor asignado',
        'NO_TEACHER_ASSIGNED'
      );
    }

    // Desasignar profesor
    const updatedSubject = await prisma.subject.update({
      where: { id: subjectId },
      data: { teacherProfileId: null },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId,
      userId: unassignerUserId,
      action: AuditAction.UPDATE,
      entityType: 'SUBJECT',
      entityId: subjectId,
      details: {
        subjectName: subject.name,
        action: 'unassign_teacher',
      },
    });

    return updatedSubject;
  } catch (error) {
    if (error instanceof TeacherServiceError) {
      throw error;
    }
    throw new TeacherServiceError(
      `Error al desasignar profesor: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'UNASSIGN_ERROR'
    );
  }
}