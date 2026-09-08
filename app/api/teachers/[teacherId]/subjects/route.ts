/**
 * API Route para asignación de asignaturas a profesores
 * POST para asignar
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { AssignTeacherToSubjectSchema } from '@/lib/validations/teacher.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  assignTeacherToSubject,
} from '@/lib/services/teacher-crud.service';
import { TeacherServiceError } from '@/lib/services/teacher-crud.service';

/**
 * POST /api/teachers/[teacherId]/subjects - Asignar asignatura a profesor
 * Solo administradores y directivos
 */
const assignSubjectHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(AssignTeacherToSubjectSchema)(
        async (req: NextRequest, data) => {
          try {
            const teacherId = req.url.split('/')[4] as string;
            const subject = await assignTeacherToSubject(
              teacherId,
              (data as any).subjectId,
              'schoolId-placeholder',
              'userId-placeholder'
            );

            return NextResponse.json({
              success: true,
              message: 'Profesor asignado a asignatura exitosamente',
              data: {
                subject: {
                  id: subject.id,
                  name: subject.name,
                  code: subject.code,
                  teacher: subject.teacher ? {
                    id: subject.teacher.id,
                    name: `${subject.teacher.membership.user.firstName} ${subject.teacher.membership.user.lastName}`,
                  } : null,
                  course: subject.course,
                },
              },
            });
          } catch (error) {
            if (error instanceof TeacherServiceError) {
              const statusMap: Record<string, number> = {
                'NOT_FOUND': 404,
                'FORBIDDEN': 403,
                'SUBJECT_NOT_FOUND': 404,
                'SUBJECT_HAS_TEACHER': 409,
                'ASSIGN_ERROR': 500,
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

export { assignSubjectHandler as POST };