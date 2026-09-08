import { NextRequest, NextResponse } from "next/server";
import { ForbiddenError } from "@/lib/middleware/error-handler";
import { prisma } from "@/lib/db/prisma";

/**
 * Middleware para asegurar aislamiento multi-tenant estricto
 * Verifica que todas las operaciones estén limitadas al schoolId del usuario autenticado
 */

/**
 * Middleware para interceptar queries de Prisma y asegurar aislamiento por tenant
 * Este middleware debe usarse en todas las operaciones que involucren datos multi-tenant
 */
export function withTenantIsolation<T extends { schoolId?: string }>(
  context: { schoolId: string; isSystemAdmin: boolean },
  data: T
): T {
  // Si es system admin, no aplicamos restricciones de tenant
  if (context.isSystemAdmin) {
    return data;
  }

  // Si el dato tiene schoolId, verificar que coincida con el del usuario
  if (data.schoolId && data.schoolId !== context.schoolId) {
    throw new ForbiddenError("Acceso denegado: no puedes acceder a datos de otra institución");
  }

  return data;
}

/**
 * Middleware para verificar que un recurso pertenece al tenant del usuario
 */
export async function verifyTenantAccess(
  resourceType: string,
  resourceId: string,
  userSchoolId: string,
  isSystemAdmin: boolean
): Promise<void> {
  if (isSystemAdmin) {
    return; // System admin tiene acceso a todo
  }

  let resourceSchoolId: string | null = null;

  switch (resourceType) {
    case "course":
      const course = await prisma.course.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = course?.schoolId || null;
      break;

    case "student":
      const student = await prisma.studentProfile.findUnique({
        where: { id: resourceId },
        include: { membership: { select: { schoolId: true } } },
      });
      resourceSchoolId = student?.membership.schoolId || null;
      break;

    case "teacher":
      const teacher = await prisma.teacherProfile.findUnique({
        where: { id: resourceId },
        include: { membership: { select: { schoolId: true } } },
      });
      resourceSchoolId = teacher?.membership.schoolId || null;
      break;

    case "assessment":
      const assessment = await prisma.assessment.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = assessment?.schoolId || null;
      break;

    case "enrollment":
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = enrollment?.schoolId || null;
      break;

    default:
      throw new ForbiddenError(`Tipo de recurso no soportado: ${resourceType}`);
  }

  if (!resourceSchoolId) {
    throw new ForbiddenError("Recurso no encontrado");
  }

  if (resourceSchoolId !== userSchoolId) {
    throw new ForbiddenError("No tienes acceso a este recurso");
  }
}

/**
 * Wrapper para handlers que verifican aislamiento de tenant
 */
export function withTenantCheck<T extends { schoolId?: string }>(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    // Este es un placeholder - la verificación específica debe hacerse
    // en cada handler según el tipo de recurso
    return handler(req, context);
  };
}

/**
 * Helper para filtrar resultados por schoolId en queries de Prisma
 */
export function addTenantFilter(
  where: any,
  schoolId: string,
  isSystemAdmin: boolean
): any {
  if (isSystemAdmin) {
    return where; // System admin no tiene restricciones
  }

  return {
    ...where,
    schoolId,
  };
}