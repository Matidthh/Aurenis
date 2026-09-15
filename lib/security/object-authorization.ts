/**
 * Aurenis - Motor de Autorización a Nivel de Objeto (BOLA / IDOR Protection)
 *
 * Protege contra vulnerabilidades Broken Object Level Authorization (BOLA / OWASP API1:2023)
 * e Insecure Direct Object References (IDOR):
 *
 * 1. Acceso a fichas de otros estudiantes bloqueado:
 *    - Un estudiante SÓLO puede consultar su propia ficha/perfil.
 *    - Un apoderado SÓLO puede consultar las fichas de sus pupilos directamente vinculados.
 *    - Intentos de acceder a fichas de otros estudiantes se bloquean con 403 Forbidden.
 *
 * 2. Consulta de notas de otros apoderados denegada:
 *    - Un apoderado sólo puede consultar calificaciones pertenecientes a sus propios pupilos.
 *    - Un estudiante sólo puede consultar sus propias calificaciones.
 *    - Parámetros de consulta cruzada (?studentId=otro) se bloquean con 403 Forbidden.
 *    - Listados generales de notas filtran estrictamente a nivel de objeto para ocultar
 *      calificaciones ajenas.
 *
 * 3. Respuestas 403 / 404 confirmadas:
 *    - Intento no autorizado sobre recurso existente de otro usuario -> 403 Forbidden.
 *    - Solicitud de recurso inexistente -> 404 Not Found.
 */

import { prisma } from "@/lib/db/prisma";
import { UserSession } from "@/types/auth";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES } from "@/lib/constants/roles";

export interface ObjectAuthResult {
  allowed: boolean;
  statusCode?: 200 | 403 | 404;
  reason?: string;
  roleName?: string;
  studentProfileId?: string;
  allowedStudentProfileIds?: string[];
}

/**
 * Valida la autorización para consultar la ficha de un estudiante específico (BOLA / IDOR).
 */
export async function validateStudentRecordAccess(
  session: UserSession,
  schoolId: string,
  targetStudentId: string
): Promise<ObjectAuthResult> {
  // 1. Administrador global del sistema tiene acceso total
  if (session.isSystemAdmin) {
    return { allowed: true, statusCode: 200, roleName: "SYSTEM_ADMIN" };
  }

  // 2. Obtener membresía institucional del usuario solicitante
  const membership = await prisma.membership.findUnique({
    where: {
      userId_schoolId: {
        userId: session.userId,
        schoolId,
      },
    },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });

  if (!membership || !membership.isActive) {
    return {
      allowed: false,
      statusCode: 403,
      reason: "Acceso denegado a esta institución educativa.",
    };
  }

  const roleName = membership.role.name;

  // 3. Administradores o personal con permiso de gestión de estudiantes
  const canManageStudents = membership.role.permissions.some(
    (rp) =>
      rp.permission.code === PERMISSIONS.PEOPLE_STUDENTS_MANAGE ||
      rp.permission.code === PERMISSIONS.PEOPLE_ENROLLMENT_MANAGE ||
      rp.permission.code === "*"
  );

  if (canManageStudents) {
    return { allowed: true, statusCode: 200, roleName };
  }

  // 4. Buscar si el registro de estudiante objetivo existe en el colegio
  const targetStudent = await prisma.studentProfile.findFirst({
    where: {
      OR: [
        { id: targetStudentId },
        { membershipId: targetStudentId },
        { enrollments: { some: { id: targetStudentId } } },
      ],
      membership: { schoolId },
    },
    include: {
      membership: true,
      guardians: {
        include: {
          guardian: {
            include: { membership: true },
          },
        },
      },
    },
  });

  // Si no existe en el colegio, retornar 404
  if (!targetStudent) {
    return {
      allowed: false,
      statusCode: 404,
      reason: "Ficha de estudiante no encontrada.",
    };
  }

  // 5. Caso: Rol ESTUDIANTE (STUDENT)
  if (roleName === DEFAULT_SCHOOL_ROLES.STUDENT) {
    const isOwnFicha =
      targetStudent.membership.userId === session.userId ||
      targetStudent.membershipId === membership.id;

    if (!isOwnFicha) {
      return {
        allowed: false,
        statusCode: 403,
        reason: "Acceso denegado (BOLA / IDOR): No tienes autorización para acceder a la ficha de otro estudiante.",
        roleName,
      };
    }

    return {
      allowed: true,
      statusCode: 200,
      roleName,
      studentProfileId: targetStudent.id,
      allowedStudentProfileIds: [targetStudent.id],
    };
  }

  // 6. Caso: Rol APODERADO (GUARDIAN)
  if (roleName === DEFAULT_SCHOOL_ROLES.GUARDIAN) {
    // Verificar si el estudiante objetivo está vinculado a este apoderado
    const isMyPupil = targetStudent.guardians.some(
      (g) => g.guardian.membership.userId === session.userId
    );

    if (!isMyPupil) {
      return {
        allowed: false,
        statusCode: 403,
        reason: "Acceso denegado (BOLA / IDOR): No tienes autorización para consultar la ficha de un estudiante que no es tu pupilo.",
        roleName,
      };
    }

    return {
      allowed: true,
      statusCode: 200,
      roleName,
      studentProfileId: targetStudent.id,
      allowedStudentProfileIds: [targetStudent.id],
    };
  }

  // Cualquier otro rol sin permisos directos
  return {
    allowed: false,
    statusCode: 403,
    reason: "Acceso denegado. Permisos insuficientes para acceder a fichas de estudiantes.",
    roleName,
  };
}

/**
 * Valida la autorización para consultar notas / evaluaciones (BOLA / IDOR).
 */
export async function validateGradesAccess(
  session: UserSession,
  schoolId: string,
  targetStudentId?: string | null
): Promise<ObjectAuthResult> {
  if (session.isSystemAdmin) {
    return { allowed: true, statusCode: 200, roleName: "SYSTEM_ADMIN" };
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_schoolId: {
        userId: session.userId,
        schoolId,
      },
    },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });

  if (!membership || !membership.isActive) {
    return {
      allowed: false,
      statusCode: 403,
      reason: "Acceso denegado a esta institución educativa.",
    };
  }

  const roleName = membership.role.name;

  const hasViewGrades = membership.role.permissions.some(
    (rp) =>
      rp.permission.code === PERMISSIONS.GRADES_VIEW ||
      rp.permission.code === PERMISSIONS.GRADES_ENTER ||
      rp.permission.code === PERMISSIONS.GRADES_MODIFY ||
      rp.permission.code === "*"
  );

  if (!hasViewGrades) {
    return {
      allowed: false,
      statusCode: 403,
      reason: "Acceso denegado. Sin permisos para consultar calificaciones.",
    };
  }

  // Personal académico o directivo (School Admin, Profesor con permisos)
  const isStaffOrAdmin =
    roleName === DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN ||
    roleName === DEFAULT_SCHOOL_ROLES.TEACHER ||
    membership.role.permissions.some((rp) => rp.permission.code === PERMISSIONS.GRADES_ENTER);

  if (isStaffOrAdmin) {
    return {
      allowed: true,
      statusCode: 200,
      roleName,
    };
  }

  // Caso: Rol APODERADO (GUARDIAN)
  if (roleName === DEFAULT_SCHOOL_ROLES.GUARDIAN) {
    // Buscar perfil de apoderado y sus pupilos vinculados
    const guardianProfile = await prisma.guardianProfile.findFirst({
      where: { membershipId: membership.id },
      include: {
        students: {
          include: { student: true },
        },
      },
    });

    const myPupilIds = (guardianProfile?.students || []).map((s) => s.studentProfileId);

    // Si especificó un targetStudentId puntual
    if (targetStudentId) {
      // Buscar si el targetStudentId existe en la escuela
      const targetStudent = await prisma.studentProfile.findFirst({
        where: {
          OR: [
            { id: targetStudentId },
            { membershipId: targetStudentId },
            { enrollments: { some: { id: targetStudentId } } },
          ],
          membership: { schoolId },
        },
      });

      if (!targetStudent) {
        return {
          allowed: false,
          statusCode: 404,
          reason: "Estudiante o matrícula no encontrada.",
        };
      }

      const isMyPupil = myPupilIds.includes(targetStudent.id);
      if (!isMyPupil) {
        return {
          allowed: false,
          statusCode: 403,
          reason: "Acceso denegado (BOLA / IDOR): Consulta de notas de estudiantes de otros apoderados denegada.",
          roleName,
        };
      }
    }

    return {
      allowed: true,
      statusCode: 200,
      roleName,
      allowedStudentProfileIds: myPupilIds,
    };
  }

  // Caso: Rol ESTUDIANTE (STUDENT)
  if (roleName === DEFAULT_SCHOOL_ROLES.STUDENT) {
    const studentProfile = await prisma.studentProfile.findFirst({
      where: { membershipId: membership.id },
    });

    if (!studentProfile) {
      return {
        allowed: false,
        statusCode: 404,
        reason: "Perfil de estudiante no encontrado.",
      };
    }

    if (targetStudentId) {
      const targetStudent = await prisma.studentProfile.findFirst({
        where: {
          OR: [
            { id: targetStudentId },
            { membershipId: targetStudentId },
            { enrollments: { some: { id: targetStudentId } } },
          ],
          membership: { schoolId },
        },
      });

      if (!targetStudent) {
        return {
          allowed: false,
          statusCode: 404,
          reason: "Estudiante o matrícula no encontrada.",
        };
      }

      if (targetStudent.id !== studentProfile.id) {
        return {
          allowed: false,
          statusCode: 403,
          reason: "Acceso denegado (BOLA / IDOR): No puedes consultar las notas de otro estudiante.",
          roleName,
        };
      }
    }

    return {
      allowed: true,
      statusCode: 200,
      roleName,
      studentProfileId: studentProfile.id,
      allowedStudentProfileIds: [studentProfile.id],
    };
  }

  return {
    allowed: false,
    statusCode: 403,
    reason: "Acceso denegado.",
  };
}

/**
 * Valida la autorización para consultar una calificación individual específica por ID (BOLA / IDOR).
 */
export async function validateSingleGradeAccess(
  session: UserSession,
  schoolId: string,
  gradeId: string
): Promise<ObjectAuthResult & { grade?: any }> {
  if (session.isSystemAdmin) {
    const grade = await prisma.grade.findFirst({
      where: { id: gradeId, schoolId },
    });
    if (!grade) {
      return { allowed: false, statusCode: 404, reason: "Calificación no encontrada." };
    }
    return { allowed: true, statusCode: 200, grade };
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_schoolId: {
        userId: session.userId,
        schoolId,
      },
    },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });

  if (!membership || !membership.isActive) {
    return { allowed: false, statusCode: 403, reason: "Acceso denegado a esta institución." };
  }

  const grade = await prisma.grade.findFirst({
    where: { id: gradeId, schoolId },
    include: {
      enrollment: {
        include: {
          student: {
            include: {
              guardians: {
                include: { guardian: { include: { membership: true } } },
              },
              membership: true,
            },
          },
        },
      },
    },
  });

  if (!grade) {
    return { allowed: false, statusCode: 404, reason: "Calificación no encontrada." };
  }

  const roleName = membership.role.name;

  // Si es profesor o administrador escolar
  const isStaffOrAdmin =
    roleName === DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN ||
    roleName === DEFAULT_SCHOOL_ROLES.TEACHER ||
    membership.role.permissions.some((rp) => rp.permission.code === PERMISSIONS.GRADES_ENTER);

  if (isStaffOrAdmin) {
    return { allowed: true, statusCode: 200, grade };
  }

  // Si es estudiante
  if (roleName === DEFAULT_SCHOOL_ROLES.STUDENT) {
    const isOwner = grade.enrollment.student.membership.userId === session.userId;
    if (!isOwner) {
      return {
        allowed: false,
        statusCode: 403,
        reason: "Acceso denegado (BOLA / IDOR): No puedes ver la calificación de otro estudiante.",
        roleName,
      };
    }
    return { allowed: true, statusCode: 200, grade };
  }

  // Si es apoderado
  if (roleName === DEFAULT_SCHOOL_ROLES.GUARDIAN) {
    const isMyPupil = grade.enrollment.student.guardians.some(
      (g) => g.guardian.membership.userId === session.userId
    );
    if (!isMyPupil) {
      return {
        allowed: false,
        statusCode: 403,
        reason: "Acceso denegado (BOLA / IDOR): Consulta de notas de otros apoderados denegada.",
        roleName,
      };
    }
    return { allowed: true, statusCode: 200, grade };
  }

  return { allowed: false, statusCode: 403, reason: "Acceso denegado.", roleName };
}
