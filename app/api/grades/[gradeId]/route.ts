/**
 * API Route para operaciones individuales de notas
 * GET, PATCH, DELETE para calificación específica
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { UpdateGradeSchema } from '@/lib/validations/grade.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  updateGradeWithValidation,
  deleteGradeWithValidation,
  AcademicGradesError,
} from '@/lib/services/academic-grades.service';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/grades/[gradeId] - Obtener calificación específica
 */
const getGradeHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_VIEW]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      async (req: NextRequest) => {
        try {
          const gradeId = req.url.split('/').pop() as string;
          const grade = await prisma.grade.findUnique({
            where: { id: gradeId },
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

          if (!grade) {
            return NextResponse.json({
              error: 'Calificación no encontrada',
              code: 'GRADE_NOT_FOUND',
            }, { status: 404 });
          }

          return NextResponse.json({
            success: true,
            data: {
              grade: {
                id: grade.id,
                value: grade.value,
                feedback: grade.feedback,
                student: {
                  id: grade.enrollment.student.id,
                  email: grade.enrollment.student.membership.user.email,
                  name: `${grade.enrollment.student.membership.user.firstName} ${grade.enrollment.student.membership.user.lastName}`,
                },
                assessment: {
                  id: grade.assessment.id,
                  title: grade.assessment.title,
                  weight: grade.assessment.weightPercentage,
                  subject: grade.assessment.subject.name,
                  academicPeriod: grade.assessment.academicPeriod.name,
                },
                createdAt: grade.createdAt,
                updatedAt: grade.updatedAt,
              },
            },
          });
        } catch (error) {
          if (error instanceof AcademicGradesError) {
            return NextResponse.json({
              error: error.message,
              code: error.code,
            }, { status: 400 });
          }

          throw error;
        }
      }
    )
  )
);

/**
 * PATCH /api/grades/[gradeId] - Actualizar calificación
 * Solo profesor titular o directivos
 */
const updateGradeHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_ENTER]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(UpdateGradeSchema)(
        async (req: NextRequest, data) => {
          try {
            const gradeId = req.url.split('/').pop() as string;
            // Esto necesita obtener el contexto de autenticación de alguna forma
            // Por ahora vamos a usar un valor placeholder
            const grade = await updateGradeWithValidation(
              gradeId,
              'schoolId-placeholder',
              data as { value?: number; feedback?: string },
              'userId-placeholder'
            );

            return NextResponse.json({
              success: true,
              message: 'Calificación actualizada exitosamente',
              data: {
                grade: {
                  id: grade.id,
                  value: grade.value,
                  feedback: grade.feedback,
                  student: {
                    id: grade.enrollment.student.id,
                    email: grade.enrollment.student.membership.user.email,
                    name: `${grade.enrollment.student.membership.user.firstName} ${grade.enrollment.student.membership.user.lastName}`,
                  },
                  assessment: {
                    id: grade.assessment.id,
                    title: grade.assessment.title,
                    weight: grade.assessment.weightPercentage,
                    subject: grade.assessment.subject.name,
                    academicPeriod: grade.assessment.academicPeriod.name,
                  },
                  updatedAt: grade.updatedAt,
                },
              },
            });
          } catch (error) {
            if (error instanceof AcademicGradesError) {
              const statusMap: Record<string, number> = {
                'INVALID_GRADE_SCALE': 400,
                'GRADE_NOT_FOUND': 404,
                'FORBIDDEN': 403,
                'UPDATE_ERROR': 500,
              };

              return NextResponse.json({
                error: error.message,
                code: error.code,
              }, { status: statusMap[error.code] || 400 });
            }

            throw error;
          }
        }
      )
    )
  )
);

/**
 * DELETE /api/grades/[gradeId] - Eliminar calificación
 * Solo profesor titular o directivos
 */
const deleteGradeHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_ENTER]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      async (req: NextRequest) => {
        try {
          const gradeId = req.url.split('/').pop() as string;
          const result = await deleteGradeWithValidation(
            gradeId,
            'schoolId-placeholder',
            'userId-placeholder'
          );

          return NextResponse.json({
            success: true,
            message: result.message,
          });
        } catch (error) {
          if (error instanceof AcademicGradesError) {
            const statusMap: Record<string, number> = {
              'GRADE_NOT_FOUND': 404,
              'FORBIDDEN': 403,
              'DELETE_ERROR': 500,
            };

            return NextResponse.json({
              error: error.message,
              code: error.code,
            }, { status: statusMap[error.code] || 400 });
          }

          throw error;
        }
      }
    )
  )
);

export { 
  getGradeHandler as GET, 
  updateGradeHandler as PATCH, 
  deleteGradeHandler as DELETE 
};