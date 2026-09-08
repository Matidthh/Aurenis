/**
 * Servicio de Lógica Académica para Notas
 * Implementa reglas académicas chilenas, cálculos de promedios y auditoría
 */

import { prisma } from '@/lib/db/prisma';
import { AuditAction } from '@prisma/client';
import { logAuditEvent } from './audit.service';

export class AcademicGradesError extends Error {
  constructor(message: string, public code: string = 'ACADEMIC_GRADES_ERROR') {
    super(message);
    this.name = 'AcademicGradesError';
  }
}

/**
 * Constantes del sistema académico chileno
 */
export const CHILEAN_GRADE_SCALE = {
  MIN: 1.0,
  MAX: 7.0,
  PASSING: 4.0,
  MAX_DECIMALS: 1,
} as const;

/**
 * Valida que una nota cumpla con la escala chilena
 */
export function validateChileanGrade(grade: number): boolean {
  if (grade < CHILEAN_GRADE_SCALE.MIN || grade > CHILEAN_GRADE_SCALE.MAX) {
    return false;
  }

  // Validar máximo 1 decimal
  const decimalPart = grade % 1;
  return decimalPart === 0 || (decimalPart >= 0.1 && decimalPart <= 0.9);
}

/**
 * Formatea una nota para asegurar máximo 1 decimal
 */
export function formatChileanGrade(grade: number): number {
  const rounded = Math.round(grade * 10) / 10;
  return rounded;
}

/**
 * Verifica si el usuario es el profesor titular de la asignatura
 */
async function isSubjectTeacher(
  userId: string,
  subjectId: string,
  schoolId: string
): Promise<boolean> {
  const teacherProfile = await prisma.teacherProfile.findFirst({
    where: {
      membership: {
        userId,
        schoolId,
        isActive: true,
      },
      subjects: {
        some: {
          id: subjectId,
        },
      },
    },
  });

  return !!teacherProfile;
}

/**
 * Verifica si el usuario tiene permisos de dirección
 */
async function isSchoolDirector(
  userId: string,
  schoolId: string
): Promise<boolean> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      schoolId,
      isActive: true,
      role: {
        name: {
          in: ['SCHOOL_ADMIN', 'DIRECTOR'],
        },
      },
    },
  });

  return !!membership;
}

/**
 * Verifica si el usuario puede modificar notas de una asignatura
 */
export async function canModifyGrades(
  userId: string,
  subjectId: string,
  schoolId: string
): Promise<{ canModify: boolean; reason?: string }> {
  const isTeacher = await isSubjectTeacher(userId, subjectId, schoolId);
  if (isTeacher) {
    return { canModify: true };
  }

  const isDirector = await isSchoolDirector(userId, schoolId);
  if (isDirector) {
    return { canModify: true };
  }

  return {
    canModify: false,
    reason: 'Solo el profesor titular o directivos pueden modificar notas',
  };
}

/**
 * Calcula el promedio ponderado de un conjunto de notas
 */
export function calculateWeightedAverage(grades: Array<{ value: number; weight: number }>): number {
  if (grades.length === 0) {
    return 0;
  }

  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
  if (totalWeight === 0) {
    return 0;
  }

  const weightedSum = grades.reduce(
    (sum, grade) => sum + grade.value * grade.weight,
    0
  );

  return formatChileanGrade(weightedSum / totalWeight);
}

/**
 * Calcula el promedio de notas de un estudiante en un periodo académico
 */
export async function calculateStudentPeriodAverage(
  studentProfileId: string,
  academicPeriodId: string,
  schoolId: string
): Promise<{ average: number; details: any }> {
  const grades = await prisma.grade.findMany({
    where: {
      enrollment: {
        studentProfileId,
        schoolId,
      },
      assessment: {
        academicPeriodId,
      },
    },
    include: {
      assessment: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (grades.length === 0) {
    return { average: 0, details: { grades: [], bySubject: {} } };
  }

  // Agrupar por asignatura
  const bySubject: Record<string, Array<{ value: number; weight: number }>> = {};
  grades.forEach(grade => {
    const subjectId = grade.assessment.subjectId;
    const subjectName = grade.assessment.subject.name;
    const weight = Number(grade.assessment.weightPercentage) || 1;

    if (!bySubject[subjectId]) {
      bySubject[subjectId] = [];
    }
    bySubject[subjectId].push({ value: Number(grade.value), weight });
  });

  // Calcular promedio por asignatura
  const subjectAverages: Record<string, { average: number; gradeCount: number }> = {};
  Object.entries(bySubject).forEach(([subjectId, subjectGrades]) => {
    subjectAverages[subjectId] = {
      average: calculateWeightedAverage(subjectGrades),
      gradeCount: subjectGrades.length,
    };
  });

  // Calcular promedio general
  const allGrades = grades.map(grade => ({
    value: Number(grade.value),
    weight: Number(grade.assessment.weightPercentage) || 1,
  }));
  const generalAverage = calculateWeightedAverage(allGrades);

  return {
    average: generalAverage,
    details: {
      grades: grades.map(grade => ({
        id: grade.id,
        value: Number(grade.value),
        assessment: {
          name: grade.assessment.title,
          weight: grade.assessment.weightPercentage,
          subject: grade.assessment.subject.name,
        },
      })),
      bySubject: subjectAverages,
    },
  };
}

/**
 * Crea una nueva calificación con validaciones académicas
 */
export async function createGradeWithValidation(
  data: {
    schoolId: string;
    assessmentId: string;
    enrollmentId: string;
    value: number;
    feedback?: string;
  },
  userId: string
) {
  try {
    // Validar escala chilena
    if (!validateChileanGrade(data.value)) {
      throw new AcademicGradesError(
        `La nota debe estar entre ${CHILEAN_GRADE_SCALE.MIN} y ${CHILEAN_GRADE_SCALE.MAX} con máximo ${CHILEAN_GRADE_SCALE.MAX_DECIMALS} decimal`,
        'INVALID_GRADE_SCALE'
      );
    }

    // Formatear nota
    const formattedValue = formatChileanGrade(data.value);

    // Obtener evaluación
    const assessment = await prisma.assessment.findUnique({
      where: { id: data.assessmentId },
      include: { subject: true, academicPeriod: true },
    });

    if (!assessment || assessment.schoolId !== data.schoolId) {
      throw new AcademicGradesError('Evaluación no encontrada o no pertenece a este colegio', 'ASSESSMENT_NOT_FOUND');
    }

    // Verificar permisos
    const permissionCheck = await canModifyGrades(userId, assessment.subjectId, data.schoolId);
    if (!permissionCheck.canModify) {
      throw new AcademicGradesError(permissionCheck.reason || 'No tienes permisos para modificar notas', 'FORBIDDEN');
    }

    // Verificar matrícula
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: data.enrollmentId },
    });

    if (!enrollment || enrollment.schoolId !== data.schoolId) {
      throw new AcademicGradesError('Matrícula no encontrada o no pertenece a este colegio', 'ENROLLMENT_NOT_FOUND');
    }

    // Verificar duplicado
    const existingGrade = await prisma.grade.findUnique({
      where: {
        assessmentId_enrollmentId: {
          assessmentId: data.assessmentId,
          enrollmentId: data.enrollmentId,
        },
      },
    });

    if (existingGrade) {
      throw new AcademicGradesError('Ya existe una calificación para esta evaluación y estudiante', 'DUPLICATE_GRADE');
    }

    // Crear calificación
    const grade = await prisma.grade.create({
      data: {
        schoolId: data.schoolId,
        assessmentId: data.assessmentId,
        enrollmentId: data.enrollmentId,
        value: formattedValue,
        feedback: data.feedback,
      },
      include: {
        enrollment: {
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
            course: true,
          },
        },
        assessment: {
          include: {
            subject: true,
            academicPeriod: true,
          },
        },
      },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId: data.schoolId,
      userId,
      action: AuditAction.CREATE,
      entityType: 'GRADE',
      entityId: grade.id,
      details: {
        gradeValue: grade.value,
        assessmentName: assessment.title,
        studentEmail: grade.enrollment.student.membership.user.email,
        subjectName: assessment.subject.name,
        academicPeriod: assessment.academicPeriod.name,
      },
    });

    return grade;
  } catch (error) {
    if (error instanceof AcademicGradesError) {
      throw error;
    }
    throw new AcademicGradesError(
      `Error al crear calificación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'CREATE_ERROR'
    );
  }
}

/**
 * Actualiza una calificación con validaciones académicas
 */
export async function updateGradeWithValidation(
  gradeId: string,
  schoolId: string,
  data: {
    value?: number;
    feedback?: string;
  },
  userId: string
) {
  try {
    // Obtener calificación existente
    const existingGrade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        assessment: {
          include: {
            subject: true,
            academicPeriod: true,
          },
        },
        enrollment: {
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
        },
      },
    });

    if (!existingGrade || existingGrade.schoolId !== schoolId) {
      throw new AcademicGradesError('Calificación no encontrada o no pertenece a este colegio', 'GRADE_NOT_FOUND');
    }

    // Validar escala chilena si se actualiza el valor
    if (data.value !== undefined) {
      if (!validateChileanGrade(data.value)) {
        throw new AcademicGradesError(
          `La nota debe estar entre ${CHILEAN_GRADE_SCALE.MIN} y ${CHILEAN_GRADE_SCALE.MAX} con máximo ${CHILEAN_GRADE_SCALE.MAX_DECIMALS} decimal`,
          'INVALID_GRADE_SCALE'
        );
      }
      data.value = formatChileanGrade(data.value);
    }

    // Verificar permisos
    const permissionCheck = await canModifyGrades(
      userId,
      existingGrade.assessment.subjectId,
      schoolId
    );
    if (!permissionCheck.canModify) {
      throw new AcademicGradesError(permissionCheck.reason || 'No tienes permisos para modificar notas', 'FORBIDDEN');
    }

    // Guardar valor anterior para auditoría
    const previousValue = existingGrade.value;

    // Actualizar calificación
    const updatedGrade = await prisma.grade.update({
      where: { id: gradeId },
      data: {
        ...(data.value !== undefined && { value: data.value }),
        ...(data.feedback !== undefined && { feedback: data.feedback }),
      },
      include: {
        enrollment: {
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
            course: true,
          },
        },
        assessment: {
          include: {
            subject: true,
            academicPeriod: true,
          },
        },
      },
    });

    // Registrar auditoría de cambio
    await logAuditEvent({
      schoolId,
      userId,
      action: AuditAction.UPDATE,
      entityType: 'GRADE',
      entityId: gradeId,
      details: {
        previousValue,
        newValue: updatedGrade.value,
        assessmentName: existingGrade.assessment.title,
        studentEmail: existingGrade.enrollment.student.membership.user.email,
        subjectName: existingGrade.assessment.subject.name,
        academicPeriod: existingGrade.assessment.academicPeriod.name,
        changedFields: Object.keys(data),
      },
    });

    return updatedGrade;
  } catch (error) {
    if (error instanceof AcademicGradesError) {
      throw error;
    }
    throw new AcademicGradesError(
      `Error al actualizar calificación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'UPDATE_ERROR'
    );
  }
}

/**
 * Obtiene notas por curso y asignatura con promedios
 */
export async function getGradesByCourseAndSubject(
  courseId: string,
  subjectId: string,
  schoolId: string,
  academicPeriodId?: string
) {
  const where: any = {
    enrollment: {
      courseId,
      schoolId,
    },
    assessment: {
      subjectId,
      schoolId,
    },
  };

  if (academicPeriodId) {
    where.assessment.academicPeriodId = academicPeriodId;
  }

  const grades = await prisma.grade.findMany({
    where,
    include: {
      enrollment: {
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
          course: true,
        },
      },
      assessment: {
        include: {
          subject: true,
          academicPeriod: true,
        },
      },
    },
    orderBy: {
      assessment: {
        title: 'asc',
      },
    },
  });

  // Calcular promedios por estudiante
  const studentAverages: Record<string, number> = {};
  const studentGradeCounts: Record<string, number> = {};

  grades.forEach(grade => {
    const studentId = grade.enrollment.studentProfileId;
    if (!studentAverages[studentId]) {
      studentAverages[studentId] = 0;
      studentGradeCounts[studentId] = 0;
    }
    studentAverages[studentId] += Number(grade.value);
    studentGradeCounts[studentId]++;
  });

  Object.keys(studentAverages).forEach(studentId => {
    if (studentGradeCounts[studentId] > 0) {
      studentAverages[studentId] = formatChileanGrade(
        studentAverages[studentId] / studentGradeCounts[studentId]
      );
    }
  });

  return {
    grades: grades.map(grade => ({
      ...grade,
      enrollment: {
        ...grade.enrollment,
        student: {
          ...grade.enrollment.student,
          membership: {
            ...grade.enrollment.student.membership,
            user: {
              ...grade.enrollment.student.membership.user,
            },
          },
        },
      },
    })),
    studentAverages,
    assessmentCount: grades.length > 0 ? 
      new Set(grades.map(g => g.assessmentId)).size : 0,
  };
}

/**
 * Elimina una calificación con validaciones
 */
export async function deleteGradeWithValidation(
  gradeId: string,
  schoolId: string,
  userId: string
) {
  try {
    // Obtener calificación
    const grade = await prisma.grade.findUnique({
      where: { id: gradeId },
      include: {
        assessment: {
          include: {
            subject: true,
            academicPeriod: true,
          },
        },
        enrollment: {
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
        },
      },
    });

    if (!grade || grade.schoolId !== schoolId) {
      throw new AcademicGradesError('Calificación no encontrada o no pertenece a este colegio', 'GRADE_NOT_FOUND');
    }

    // Verificar permisos
    const permissionCheck = await canModifyGrades(
      userId,
      grade.assessment.subjectId,
      schoolId
    );
    if (!permissionCheck.canModify) {
      throw new AcademicGradesError(permissionCheck.reason || 'No tienes permisos para eliminar notas', 'FORBIDDEN');
    }

    // Guardar datos para auditoría
    const gradeData = {
      value: grade.value,
      assessmentName: grade.assessment.title,
      studentEmail: grade.enrollment.student.membership.user.email,
      subjectName: grade.assessment.subject.name,
      academicPeriod: grade.assessment.academicPeriod.name,
    };

    // Eliminar calificación
    await prisma.grade.delete({
      where: { id: gradeId },
    });

    // Registrar auditoría
    await logAuditEvent({
      schoolId,
      userId,
      action: AuditAction.DELETE,
      entityType: 'GRADE',
      entityId: gradeId,
      details: gradeData,
    });

    return { success: true, message: 'Calificación eliminada exitosamente' };
  } catch (error) {
    if (error instanceof AcademicGradesError) {
      throw error;
    }
    throw new AcademicGradesError(
      `Error al eliminar calificación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      'DELETE_ERROR'
    );
  }
}