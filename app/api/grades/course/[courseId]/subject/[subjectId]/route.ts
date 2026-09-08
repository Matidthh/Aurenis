/**
 * API Route para notas por curso y asignatura
 * GET para obtener notas y promedios
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  getGradesByCourseAndSubject,
  AcademicGradesError,
} from '@/lib/services/academic-grades.service';

/**
 * GET /api/grades/course/[courseId]/subject/[subjectId] - Notas por curso y asignatura
 */
const getCourseSubjectGradesHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_VIEW]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      async (req: NextRequest) => {
        try {
          const url = new URL(req.url);
          const pathParts = url.pathname.split('/');
          const subjectId = pathParts[pathParts.length - 1];
          const courseId = pathParts[pathParts.length - 3];
          const academicPeriodId = url.searchParams.get('academicPeriodId') || undefined;

          const result = await getGradesByCourseAndSubject(
            courseId,
            subjectId,
            'schoolId-placeholder', // Esto se debe obtener del contexto
            academicPeriodId
          );

          return NextResponse.json({
            success: true,
            data: {
              grades: result.grades.map(grade => ({
                id: grade.id,
                value: grade.value,
                feedback: grade.feedback,
                enrollmentId: grade.enrollmentId,
                assessmentId: grade.assessmentId,
              })),
              studentAverages: result.studentAverages,
              assessmentCount: result.assessmentCount,
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

export { getCourseSubjectGradesHandler as GET };