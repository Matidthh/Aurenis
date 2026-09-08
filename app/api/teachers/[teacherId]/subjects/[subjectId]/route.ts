/**
 * API Route para desasignar asignatura de profesor
 * DELETE para desasignar
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  unassignTeacherFromSubject,
} from '@/lib/services/teacher-crud.service';
import { TeacherServiceError } from '@/lib/services/teacher-crud.service';

/**
 * DELETE /api/teachers/[teacherId]/subjects/[subjectId] - Desasignar asignatura
 * Solo administradores y directivos
 */
const unassignSubjectHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      async (req: NextRequest) => {
        try {
          const urlParts = req.url.split('/');
          const subjectId = urlParts[urlParts.length - 1];
          const subject = await unassignTeacherFromSubject(
            subjectId,
            'schoolId-placeholder',
            'userId-placeholder'
          );

          return NextResponse.json({
            success: true,
            message: 'Profesor desasignado de asignatura exitosamente',
            data: {
              subject: {
                id: subject.id,
                name: subject.name,
                code: subject.code,
              },
            },
          });
        } catch (error) {
          if (error instanceof TeacherServiceError) {
            const statusMap: Record<string, number> = {
              'NOT_FOUND': 404,
              'FORBIDDEN': 403,
              'NO_TEACHER_ASSIGNED': 400,
              'UNASSIGN_ERROR': 500,
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

export { unassignSubjectHandler as DELETE };