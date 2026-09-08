/**
 * API Route para operaciones individuales de profesores
 * GET, PATCH, DELETE para profesor específico
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { UpdateTeacherSchema } from '@/lib/validations/teacher.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from '@/lib/services/teacher-crud.service';
import { TeacherServiceError } from '@/lib/services/teacher-crud.service';

/**
 * GET /api/teachers/[teacherId] - Obtener profesor específico
 * Solo administradores y directivos
 */
const getTeacherHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      async (req: NextRequest) => {
        try {
          const teacherId = req.url.split('/').pop() as string;
          const teacher = await getTeacherById(teacherId, 'schoolId-placeholder');

          return NextResponse.json({
            success: true,
            data: {
              teacher: {
                id: teacher.id,
                email: teacher.membership.user.email,
                firstName: teacher.membership.user.firstName,
                lastName: teacher.membership.user.lastName,
                rutOrNationalId: teacher.membership.user.rutOrNationalId,
                phone: teacher.membership.user.phone,
                specialty: teacher.specialty,
                role: teacher.membership.role.name,
                subjects: teacher.subjects.map(subject => ({
                  id: subject.id,
                  name: subject.name,
                  code: subject.code,
                  hoursPerWeek: subject.hoursPerWeek,
                  course: subject.course,
                })),
                createdAt: teacher.membership.createdAt,
              },
            },
          });
        } catch (error) {
          if (error instanceof TeacherServiceError) {
            const statusMap: Record<string, number> = {
              'NOT_FOUND': 404,
              'FORBIDDEN': 403,
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

/**
 * PATCH /api/teachers/[teacherId] - Actualizar profesor
 * Solo administradores y directivos
 */
const updateTeacherHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(UpdateTeacherSchema)(
        async (req: NextRequest, data) => {
          try {
            const teacherId = req.url.split('/').pop() as string;
            const teacher = await updateTeacher(
              teacherId,
              'schoolId-placeholder',
              data as any,
              'userId-placeholder'
            );

            return NextResponse.json({
              success: true,
              message: 'Profesor actualizado exitosamente',
              data: {
                teacher: {
                  id: teacher.id,
                  email: teacher.membership.user.email,
                  firstName: teacher.membership.user.firstName,
                  lastName: teacher.membership.user.lastName,
                  specialty: teacher.specialty,
                  role: teacher.membership.role.name,
                },
              },
            });
          } catch (error) {
            if (error instanceof TeacherServiceError) {
              const statusMap: Record<string, number> = {
                'NOT_FOUND': 404,
                'FORBIDDEN': 403,
                'DUPLICATE_EMAIL': 409,
                'DUPLICATE_RUT': 409,
                'INVALID_RUT': 400,
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
 * DELETE /api/teachers/[teacherId] - Eliminar profesor
 * Solo administradores y directivos
 */
const deleteTeacherHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      async (req: NextRequest) => {
        try {
          const teacherId = req.url.split('/').pop() as string;
          const result = await deleteTeacher(teacherId, 'schoolId-placeholder', 'userId-placeholder');

          return NextResponse.json({
            success: true,
            message: result.message,
          });
        } catch (error) {
          if (error instanceof TeacherServiceError) {
            const statusMap: Record<string, number> = {
              'NOT_FOUND': 404,
              'FORBIDDEN': 403,
              'HAS_ACTIVE_SUBJECTS': 409,
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
  getTeacherHandler as GET, 
  updateTeacherHandler as PATCH, 
  deleteTeacherHandler as DELETE 
};