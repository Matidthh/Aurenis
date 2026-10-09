export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import {
  evaluateStudentPromotion,
  evaluateCoursePromotion,
  calculateStudentAcademicSummary,
} from "@/lib/services/promotion.service";
import { apiSuccess, apiError } from "@/lib/api/response";

/**
 * ============================================================================
 * ENDPOINT DE EVALUACIÓN Y PROMOCIÓN ESCOLAR (DECRETO 67/2018)
 * ============================================================================
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (Seguridad Normativa)
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;

    // Verificar pertenencia y permisos en la institución
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: { userId: session.userId, schoolId },
        },
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const hasView = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_VIEW ||
          rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE ||
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_VIEW ||
          rp.permission.code === "*"
      );

      if (!hasView) {
        return apiError("Acceso denegado. Permisos insuficientes para consultar actas de promoción.", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");
    const courseId = searchParams.get("courseId");
    const year = Number(searchParams.get("year")) || new Date().getFullYear();

    const tenantDb = createTenantPrisma(schoolId);

    if (enrollmentId) {
      const studentResult = await evaluateStudentPromotion(
        tenantDb,
        schoolId,
        enrollmentId,
        session.userId
      );
      const summary = await calculateStudentAcademicSummary(tenantDb, schoolId, enrollmentId);
      return apiSuccess({ evaluation: studentResult, summary });
    }

    if (courseId) {
      const courseResult = await evaluateCoursePromotion(
        tenantDb,
        schoolId,
        courseId,
        year,
        session.userId
      );
      return apiSuccess(courseResult);
    }

    // Si no especifica parámetro, retornar resumen general
    return apiSuccess({
      message: "Motor Decreto 67/2018 activo. Especifique courseId o enrollmentId para dictamen.",
      normative: "Decreto Supremo N.º 67/2018 MINEDUC - Artículos 5, 8, 9, 10, 11 y 12",
    });
  } catch (error: any) {
    return apiError(error.message || "Error al procesar consulta de promoción", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;

    // Verificar permisos de administración académica o notas (GRADES_MODIFY / ACADEMIC_COURSES_MANAGE)
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: { userId: session.userId, schoolId },
        },
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const canEvaluate = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_MODIFY ||
          rp.permission.code === PERMISSIONS.GRADES_ENTER ||
          rp.permission.code === PERMISSIONS.ACADEMIC_COURSES_MANAGE ||
          rp.permission.code === "*"
      );

      if (!canEvaluate) {
        return apiError("Acceso denegado. Permisos insuficientes para ejecutar evaluación de promoción.", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const body = await req.json();
    const { enrollmentId, courseId, year } = body;

    const tenantDb = createTenantPrisma(schoolId);
    const evalYear = Number(year) || new Date().getFullYear();

    if (enrollmentId) {
      const evaluation = await evaluateStudentPromotion(
        tenantDb,
        schoolId,
        enrollmentId,
        session.userId
      );
      return apiSuccess(evaluation, {
        message: "Dictamen de promoción escolar generado y registrado exitosamente conforme a Decreto 67/2018.",
      });
    }

    if (courseId) {
      const courseEvaluation = await evaluateCoursePromotion(
        tenantDb,
        schoolId,
        courseId,
        evalYear,
        session.userId
      );
      return apiSuccess(courseEvaluation, {
        message: `Se evaluó el curso completo exitosamente (${courseEvaluation.summary.totalStudents} estudiantes).`,
      });
    }

    return apiError("Debe proporcionar enrollmentId o courseId para evaluar.", "VALIDATION_ERROR", {
      statusCode: 400,
    });
  } catch (error: any) {
    return apiError(error.message || "Error al ejecutar evaluación de promoción", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
