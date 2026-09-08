/**
 * API Route para Notas y Calificaciones
 * Sistema académico chileno con validaciones, permisos y auditoría
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { 
  CreateGradeSchema, 
  SearchGradesSchema, 
  CreateBulkGradesSchema 
} from '@/lib/validations/grade.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  createGradeWithValidation,
  AcademicGradesError,
} from '@/lib/services/academic-grades.service';
import { prisma } from '@/lib/db/prisma';

/**
 * POST /api/grades - Crear calificación individual
 * Solo profesor titular o directivos
 */
const createGradeHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_ENTER]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(CreateGradeSchema)(
        async (req: NextRequest, data) => {
          try {
            // Esto necesita obtener el contexto de autenticación de alguna forma
            const grade = await createGradeWithValidation(
              data as any,
              'userId-placeholder'
            );

            return NextResponse.json({
              success: true,
              message: 'Calificación creada exitosamente',
              data: {
                grade: {
                  id: grade.id,
                  value: grade.value,
                  feedback: grade.feedback,
                  enrollmentId: grade.enrollmentId,
                  assessmentId: grade.assessmentId,
                  createdAt: grade.createdAt,
                },
              },
            }, { status: 201 });
          } catch (error) {
            if (error instanceof AcademicGradesError) {
              const statusMap: Record<string, number> = {
                'INVALID_GRADE_SCALE': 400,
                'ASSESSMENT_NOT_FOUND': 404,
                'ENROLLMENT_NOT_FOUND': 404,
                'DUPLICATE_GRADE': 409,
                'FORBIDDEN': 403,
                'CREATE_ERROR': 500,
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
 * POST /api/grades/bulk - Crear múltiples calificaciones
 * Solo profesor titular o directivos
 */
const createBulkGradesHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_ENTER]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(CreateBulkGradesSchema)(
        async (req: NextRequest, data) => {
          try {
            // Validar que la evaluación exista
            const assessment = await prisma.assessment.findUnique({
              where: { id: (data as any).assessmentId },
              include: { subject: true },
            });

            if (!assessment || assessment.schoolId !== (data as any).schoolId) {
              return NextResponse.json({
                error: 'Evaluación no encontrada o no pertenece a este colegio',
                code: 'ASSESSMENT_NOT_FOUND',
              }, { status: 404 });
            }

            // Crear calificaciones en batch
            const results = {
              successful: 0,
              failed: 0,
              errors: [] as Array<{ enrollmentId: string; error: string }>,
              grades: [] as any[],
            };

            for (const gradeData of (data as any).grades) {
              try {
                const grade = await createGradeWithValidation(
                  {
                    schoolId: (data as any).schoolId,
                    assessmentId: (data as any).assessmentId,
                    enrollmentId: gradeData.enrollmentId,
                    value: gradeData.value,
                    feedback: gradeData.feedback,
                  },
                  'userId-placeholder'
                );

                results.successful++;
                results.grades.push(grade);
              } catch (error) {
                results.failed++;
                results.errors.push({
                  enrollmentId: gradeData.enrollmentId,
                  error: error instanceof AcademicGradesError ? error.message : 'Error desconocido',
                });
              }
            }

            return NextResponse.json({
              success: results.successful > 0,
              message: `Procesadas ${(data as any).grades.length} calificaciones: ${results.successful} exitosas, ${results.failed} fallidas`,
              data: {
                results,
              },
            }, { status: results.successful > 0 ? 201 : 400 });
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
  )
);

/**
 * GET /api/grades - Buscar calificaciones
 */
const searchGradesHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_VIEW]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      withValidation(SearchGradesSchema)(
        async (req: NextRequest, data) => {
          const where: any = {
            schoolId: (data as any).schoolId,
          };

          // Filtros opcionales
          if ((data as any).studentId) {
            where.enrollment = {
              studentProfileId: (data as any).studentId,
            };
          }

          if ((data as any).subjectId) {
            where.assessment = {
              subjectId: (data as any).subjectId,
            };
          }

          if ((data as any).assessmentId) {
            where.assessmentId = (data as any).assessmentId;
          }

          if ((data as any).academicPeriodId) {
            where.assessment = {
              ...where.assessment,
              academicPeriodId: (data as any).academicPeriodId,
            };
          }

          if ((data as any).courseId) {
            where.enrollment = {
              ...where.enrollment,
              courseId: (data as any).courseId,
            };
          }

          if ((data as any).year) {
            where.enrollment = {
              ...where.enrollment,
              year: (data as any).year,
            };
          }

          if ((data as any).minGrade !== undefined || (data as any).maxGrade !== undefined) {
            where.value = {};
            if ((data as any).minGrade !== undefined) {
              where.value.gte = (data as any).minGrade;
            }
            if ((data as any).maxGrade !== undefined) {
              where.value.lte = (data as any).maxGrade;
            }
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
            take: (data as any).limit,
            skip: (data as any).offset,
            orderBy: { createdAt: 'desc' },
          });

          const total = await prisma.grade.count({ where });

          return NextResponse.json({
            success: true,
            data: {
              grades: grades.map(grade => ({
                id: grade.id,
                value: grade.value,
                feedback: grade.feedback,
                enrollmentId: grade.enrollmentId,
                assessmentId: grade.assessmentId,
                createdAt: grade.createdAt,
                updatedAt: grade.updatedAt,
              })),
            },
            meta: {
              limit: (data as any).limit,
              offset: (data as any).offset,
              total,
            },
          });
        }
      )
    )
  )
);

export { 
  createGradeHandler as POST, 
  createBulkGradesHandler as PUT, 
  searchGradesHandler as GET
};