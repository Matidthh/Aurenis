/**
 * API Route para Estudiantes
 * Ejemplo de integración de validaciones Zod
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withPermissions } from '@/lib/middleware/authorization';
import { withRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/middleware/rate-limit';
import { withValidation } from '@/lib/middleware/validation';
import { CreateStudentSchema, SearchStudentsSchema } from '@/lib/validations/student.schema';
import { PERMISSIONS } from '@/lib/constants/permissions';
import { prisma } from '@/lib/db/prisma';

/**
 * POST /api/students - Crear nuevo estudiante
 */
const createStudentHandler = withAuth(
  withPermissions([PERMISSIONS.PEOPLE_STUDENTS_MANAGE])(
    withRateLimit(RATE_LIMIT_CONFIGS.WRITE)(
      withValidation(CreateStudentSchema)(
        async (req: NextRequest, data) => {
          // Aquí iría la lógica para crear el estudiante
          // Por ahora, simulamos la creación
          
          const result = {
            success: true,
            message: 'Estudiante creado exitosamente',
            student: {
              id: 'student_123',
              email: (data as any).email,
              firstName: (data as any).firstName,
              lastName: (data as any).lastName,
              schoolId: (data as any).schoolId,
              courseId: (data as any).courseId,
              year: (data as any).year,
            },
          };

          return NextResponse.json(result, { status: 201 });
        }
      )
    )
  )
);

/**
 * GET /api/students - Buscar estudiantes
 */
const searchStudentsHandler = withAuth(
  withPermissions([PERMISSIONS.PEOPLE_STUDENTS_MANAGE])(
    withRateLimit(RATE_LIMIT_CONFIGS.API)(
      withValidation(SearchStudentsSchema)(
        async (req: NextRequest, data) => {
          // Buscar estudiantes con filtros
          const students = await prisma.studentProfile.findMany({
            where: {
              membership: {
                schoolId: (data as any).schoolId,
                isActive: true,
              },
              ...((data as any).courseId && {
                enrollments: {
                  some: {
                    courseId: (data as any).courseId,
                    year: (data as any).year,
                  },
                },
              }),
            },
            include: {
              membership: {
                include: {
                  user: true,
                },
              },
              enrollments: {
                where: {
                  year: (data as any).year,
                },
                include: {
                  course: true,
                },
              },
            },
            take: (data as any).limit,
            skip: (data as any).offset,
          });

          return NextResponse.json({
            success: true,
            students,
            pagination: {
              limit: data.limit,
              offset: data.offset,
              total: students.length,
            },
          });
        }
      )
    )
  )
);

export { createStudentHandler as POST, searchStudentsHandler as GET };