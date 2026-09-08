/**
 * API Route para Profesores
 * CRUD completo con validaciones, autorización y respuestas estructuradas
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withSchoolPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { 
  CreateTeacherSchema, 
  SearchTeachersSchema 
} from '@/lib/validations/teacher.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import {
  createTeacher,
  listTeachers,
} from '@/lib/services/teacher-crud.service';
import { TeacherServiceError } from '@/lib/services/teacher-crud.service';

/**
 * POST /api/teachers - Crear nuevo profesor
 * Solo administradores y directivos
 */
const createTeacherHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(CreateTeacherSchema)(
        async (req: NextRequest, data) => {
          try {
            const teacher = await createTeacher({
              ...(data as any),
              rutOrNationalId: (data as any).rutOrNationalId || undefined,
              phone: (data as any).phone || undefined,
            }, 'userId-placeholder');

            return NextResponse.json({
              success: true,
              message: 'Profesor creado exitosamente',
              data: {
                teacher: {
                  id: teacher.id,
                  email: teacher.membership.user.email,
                  firstName: teacher.membership.user.firstName,
                  lastName: teacher.membership.user.lastName,
                  specialty: teacher.specialty,
                  role: teacher.membership.role.name,
                  schoolId: (data as any).schoolId,
                },
              },
            }, { status: 201 });
          } catch (error) {
            if (error instanceof TeacherServiceError) {
              const statusMap: Record<string, number> = {
                'DUPLICATE_EMAIL': 409,
                'DUPLICATE_RUT': 409,
                'INVALID_RUT': 400,
                'ROLE_NOT_FOUND': 404,
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
 * GET /api/teachers - Listar profesores
 * Solo administradores y directivos
 */
const listTeachersHandler = withAuth(
  withSchoolPermissions(
    '[schoolId]',
    [PERMISSIONS.PEOPLE_TEACHERS_MANAGE]
  )(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      withValidation(SearchTeachersSchema)(
        async (req: NextRequest, data) => {
          try {
            const result = await listTeachers((data as any).schoolId, data as any);

            return NextResponse.json({
              success: true,
              data: {
                teachers: result.teachers.map(teacher => ({
                  id: teacher.id,
                  email: teacher.membership.user.email,
                  firstName: teacher.membership.user.firstName,
                  lastName: teacher.membership.user.lastName,
                  specialty: teacher.specialty,
                  role: teacher.membership.role.name,
                  subjects: teacher.subjects.map(subject => ({
                    id: subject.id,
                    name: subject.name,
                    code: subject.code,
                    hoursPerWeek: subject.hoursPerWeek,
                  })),
                })),
              },
              meta: result.pagination,
            });
          } catch (error) {
            if (error instanceof TeacherServiceError) {
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

export { 
  createTeacherHandler as POST, 
  listTeachersHandler as GET
};