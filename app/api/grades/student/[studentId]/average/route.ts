/**
 * API Route para promedios de estudiantes
 * GET para calcular promedios por periodo académico
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  calculateStudentPeriodAverage,
  AcademicGradesError,
} from '@/lib/services/academic-grades.service';

/**
 * GET /api/grades/student/[studentId]/average - Promedio de estudiante por periodo
 */
const getStudentAverageHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.GRADES_VIEW]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      async (req: NextRequest) => {
        try {
          const url = new URL(req.url);
          const pathParts = url.pathname.split('/');
          const studentId = pathParts[pathParts.length - 2];
          const academicPeriodId = url.searchParams.get('academicPeriodId') || '';

          const result = await calculateStudentPeriodAverage(
            studentId,
            academicPeriodId,
            'schoolId-placeholder' // Esto se debe obtener del contexto
          );

          return NextResponse.json({
            success: true,
            data: {
              average: result.average,
              details: result.details,
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

export { getStudentAverageHandler as GET };