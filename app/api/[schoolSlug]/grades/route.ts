export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { getSchoolBySlug } from "@/lib/services/school.service";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { executeGradeScaleMiddleware } from "@/lib/security/grade-scale-validator";
import { validateGradesAccess } from "@/lib/security/object-authorization";
import { listAssessmentsWithGrades, getSchoolGradingConfig } from "@/lib/services/grade.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

/**
 * ============================================================================
 * ENDPOINT DE CALIFICACIONES BASADO EN TENANT SLUG (`/[schoolSlug]/grades`)
 * ============================================================================
 * Autores:
 * - Maicol R. (Lead Arquitectura, Backend & Integridad Relacional PostgreSQL)
 * - Frank M. (Seguridad Normativa, QA & Prevención de Inyecciones)
 *
 * Misión:
 * 1. Resuelve el `schoolId` del contexto del tenant actual a partir de `schoolSlug`.
 * 2. Invoca OBLIGATORIAMENTE la validación con Zod ajustada dinámicamente a los
 *    parámetros `minGrade` y `maxGrade` configurados en la base de datos para el colegio.
 * 3. Ejecuta el middleware `executeGradeScaleMiddleware` antes de realizar
 *    cualquier operación `prisma.assessment.update` o `prisma.grade.create`/`update`.
 * 4. Si la calificación es inválida, devuelve un error 400 con un mensaje claro
 *    y rechaza categóricamente la inserción en la base de datos.
 * ============================================================================
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return apiError("No autenticado. Inicie sesión para consultar calificaciones.", "UNAUTHORIZED", {
        statusCode: 401,
      });
    }

    const { schoolSlug } = await params;

    // 1. Obtener la escuela desde el contexto del tenant
    const school =
      (await getSchoolBySlug(schoolSlug)) ||
      (await prisma.school.findFirst({
        where: { OR: [{ slug: schoolSlug }, { id: schoolSlug }] },
      }));

    if (!school) {
      return apiError(`Institución con identificador '${schoolSlug}' no encontrada.`, "NOT_FOUND", {
        statusCode: 404,
      });
    }

    const schoolId = school.id;

    // 2. Control de Acceso por Objeto (BOLA / IDOR)
    const studentIdParam =
      req.nextUrl.searchParams.get("studentId") ||
      req.nextUrl.searchParams.get("enrollmentId") ||
      null;

    const authResult = await validateGradesAccess(session, schoolId, studentIdParam);
    if (!authResult.allowed) {
      return apiError(authResult.reason || "Acceso denegado a las calificaciones.", "FORBIDDEN", {
        statusCode: authResult.statusCode || 403,
      });
    }

    const tenantDb = createTenantPrisma(schoolId);
    const subjectId = req.nextUrl.searchParams.get("subjectId") || undefined;
    const periodId = req.nextUrl.searchParams.get("periodId") || undefined;

    const assessments = await listAssessmentsWithGrades(tenantDb, schoolId, {
      subjectId,
      periodId,
      allowedStudentProfileIds: authResult.allowedStudentProfileIds,
    });

    return apiSuccess({ assessments });
  } catch (error: any) {
    return apiError(error.message || "Error al obtener calificaciones.", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return apiError("No autenticado. Inicie sesión para registrar calificaciones.", "UNAUTHORIZED", {
        statusCode: 401,
      });
    }

    const { schoolSlug } = await params;

    // 1. Contexto del Tenant: Resolver el schoolId exacto de la institución
    const school =
      (await getSchoolBySlug(schoolSlug)) ||
      (await prisma.school.findFirst({
        where: { OR: [{ slug: schoolSlug }, { id: schoolSlug }] },
      }));

    if (!school) {
      return apiError(`Institución con identificador '${schoolSlug}' no encontrada.`, "NOT_FOUND", {
        statusCode: 404,
      });
    }

    const schoolId = school.id; // schoolId del contexto del tenant

    // 2. Verificar autorización RBAC en el colegio
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
        return apiError("Acceso denegado a esta institución educativa.", "FORBIDDEN", {
          statusCode: 403,
        });
      }

      const canEnterGrades = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.GRADES_ENTER ||
          rp.permission.code === PERMISSIONS.GRADES_MODIFY ||
          rp.permission.code === "*"
      );

      if (!canEnterGrades) {
        return apiError(
          "Acceso denegado. Permisos insuficientes para ingresar o modificar calificaciones.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const assessmentId = body.assessmentId;
    const enrollmentId = body.enrollmentId;
    const rawGradeValue = body.grade ?? body.value;
    const comment = body.comment || body.feedback;

    if (!assessmentId || !enrollmentId || rawGradeValue === undefined || rawGradeValue === null) {
      return apiError(
        "Faltan campos obligatorios: 'assessmentId', 'enrollmentId' y 'grade' (o 'value').",
        "VALIDATION_ERROR",
        { statusCode: 400 }
      );
    }

    const numericGrade = Number(rawGradeValue);
    if (isNaN(numericGrade)) {
      return apiError("El valor de la calificación debe ser un número válido.", "VALIDATION_ERROR", {
        statusCode: 400,
      });
    }

    // 3. Obtener configuración de evaluación de la base de datos para el schoolId del tenant
    const tenantDb = createTenantPrisma(schoolId);
    const gradingConfig = await getSchoolGradingConfig(tenantDb, schoolId);

    // 4. BLOQUE DE VALIDACIÓN ZOD CONTRA ESCALA DE BD (minGrade / maxGrade del Tenant)
    const DynamicTenantGradeSchema = z.object({
      grade: z
        .number({
          required_error: "La calificación es obligatoria",
          invalid_type_error: "La calificación debe ser un número",
        })
        .min(
          gradingConfig.minGrade,
          `La calificación ${numericGrade} es menor a la nota mínima permitida (${gradingConfig.minGrade.toFixed(1)}) para esta institución.`
        )
        .max(
          gradingConfig.maxGrade,
          `La calificación ${numericGrade} excede la nota máxima permitida (${gradingConfig.maxGrade.toFixed(1)}) para esta institución.`
        ),
    });

    const scaleZodCheck = DynamicTenantGradeSchema.safeParse({ grade: numericGrade });
    if (!scaleZodCheck.success) {
      return apiError(
        `Error de validación Zod: La calificación ${numericGrade} no cumple con los parámetros [${gradingConfig.minGrade.toFixed(1)} - ${gradingConfig.maxGrade.toFixed(1)}] del colegio.`,
        "GRADE_OUT_OF_RANGE",
        {
          statusCode: 400,
          details: scaleZodCheck.error.flatten(),
        }
      );
    }

    // 5. Middleware adicional de escala e integridad
    const scaleValidation = await executeGradeScaleMiddleware({
      schoolId,
      payload: { type: "single", value: numericGrade },
      userId: session.userId,
      pathName: `POST /api/${schoolSlug}/grades`,
    });

    if (!scaleValidation.allowed && scaleValidation.errorResponse) {
      return apiError(
        `Rechazado por validación de escala: La calificación ${numericGrade} está fuera del rango permitido [${gradingConfig.minGrade.toFixed(1)} - ${gradingConfig.maxGrade.toFixed(1)}].`,
        "GRADE_INVALID_SCALE",
        { statusCode: 400 }
      );
    }

    // 6. OPERACIÓN prisma.assessment.update (Si se solicitaron cambios en la evaluación)
    //    Garantizado que solo se ejecuta tras superar la validación Zod y del middleware.
    let updatedAssessment: any = null;
    if (body.assessmentUpdates && body.assessmentId) {
      const targetAssessment = await prisma.assessment.findFirst({
        where: { id: assessmentId, schoolId },
      });

      if (!targetAssessment) {
        return apiError("La evaluación especificada no existe en esta institución.", "NOT_FOUND", {
          statusCode: 404,
        });
      }

      if (isDatabaseConfigured()) {
        updatedAssessment = await prisma.assessment.update({
          where: { id: assessmentId },
          data: {
            ...(body.assessmentUpdates.title ? { title: body.assessmentUpdates.title } : {}),
            ...(body.assessmentUpdates.description !== undefined ? { description: body.assessmentUpdates.description } : {}),
            ...(body.assessmentUpdates.weightPercentage !== undefined
              ? { weightPercentage: body.assessmentUpdates.weightPercentage }
              : {}),
            ...(body.assessmentUpdates.isPublished !== undefined
              ? { isPublished: body.assessmentUpdates.isPublished }
              : {}),
          },
        });
      }
    }

    // 7. OPERACIÓN prisma.grade.create (o upsert de seguridad)
    //    Garantizado que la calificación está estrictamente en [minGrade, maxGrade].
    const roundedValue = (scaleValidation as any).value ?? numericGrade;
    let savedGrade;

    if (isDatabaseConfigured()) {
      const enrollment = await prisma.enrollment.findFirst({
        where: { id: enrollmentId, schoolId },
      });

      if (!enrollment) {
        return apiError("La matrícula del estudiante no pertenece a esta institución.", "FORBIDDEN", {
          statusCode: 403,
        });
      }

      savedGrade = await prisma.grade.upsert({
        where: {
          assessmentId_enrollmentId: {
            assessmentId,
            enrollmentId,
          },
        },
        create: {
          schoolId,
          assessmentId,
          enrollmentId,
          value: roundedValue,
          feedback: comment || null,
        },
        update: {
          value: roundedValue,
          feedback: comment || null,
        },
      });

      await logAuditEvent({
        schoolId,
        userId: session.userId,
        action: "CREATE",
        entityType: "GRADE",
        entityId: savedGrade.id,
        details: {
          assessmentId,
          enrollmentId,
          newValue: roundedValue,
          feedback: comment || null,
          legalBasis: "Decreto Supremo N.º 67/2018 y Circular N.º 30 de la Superintendencia de Educación",
          validation: "ZOD_Y_MIDDLEWARE_PRE_POSTGRESQL",
        },
      });
    } else {
      savedGrade = {
        id: `gr_demo_${Date.now()}`,
        schoolId,
        assessmentId,
        enrollmentId,
        value: roundedValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return apiSuccess(
      {
        grade: savedGrade,
        assessment: updatedAssessment,
        scaleInfo: scaleValidation.config,
      },
      {
        status: 201,
        message: "Calificación validada e insertada exitosamente en el registro académico.",
      }
    );
  } catch (error: any) {
    return apiError(error.message || "Error al procesar calificación.", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return apiError("No autenticado. Inicie sesión para modificar calificaciones.", "UNAUTHORIZED", {
        statusCode: 401,
      });
    }

    const { schoolSlug } = await params;

    const school =
      (await getSchoolBySlug(schoolSlug)) ||
      (await prisma.school.findFirst({
        where: { OR: [{ slug: schoolSlug }, { id: schoolSlug }] },
      }));

    if (!school) {
      return apiError(`Institución con identificador '${schoolSlug}' no encontrada.`, "NOT_FOUND", {
        statusCode: 404,
      });
    }

    const schoolId = school.id; // schoolId del contexto del tenant
    const body = await req.json();
    const patchGradeInput = body.grade ?? body.value;

    // =========================================================================
    // BLOQUE DE VALIDACIÓN ZOD CONTRA ESCALA DE BASE DE DATOS (minGrade / maxGrade) EN PATCH
    //    Devuelve error 400 si el valor viola los parámetros del tenant.
    // =========================================================================
    if (patchGradeInput !== undefined && patchGradeInput !== null) {
      const numericPatchGrade = Number(patchGradeInput);
      if (isNaN(numericPatchGrade)) {
        return apiError("El valor de la calificación debe ser un número válido.", "VALIDATION_ERROR", {
          statusCode: 400,
        });
      }

      const tenantDb = createTenantPrisma(schoolId);
      const gradingConfig = await getSchoolGradingConfig(tenantDb, schoolId);

      const DynamicPatchTenantGradeSchema = z.object({
        grade: z
          .number({ invalid_type_error: "La calificación debe ser un número" })
          .min(
            gradingConfig.minGrade,
            `La calificación ${numericPatchGrade} no puede ser menor a ${gradingConfig.minGrade.toFixed(1)} según la escala del colegio.`
          )
          .max(
            gradingConfig.maxGrade,
            `La calificación ${numericPatchGrade} no puede exceder ${gradingConfig.maxGrade.toFixed(1)} según la escala del colegio.`
          ),
      });

      const patchScaleZodCheck = DynamicPatchTenantGradeSchema.safeParse({ grade: numericPatchGrade });
      if (!patchScaleZodCheck.success) {
        return apiError(
          `Error de validación Zod: La calificación ${numericPatchGrade} está fuera del rango permitido [${gradingConfig.minGrade.toFixed(1)} - ${gradingConfig.maxGrade.toFixed(1)}].`,
          "GRADE_OUT_OF_RANGE",
          {
            statusCode: 400,
            details: patchScaleZodCheck.error.flatten(),
          }
        );
      }

      const scaleValidation = await executeGradeScaleMiddleware({
        schoolId,
        payload: { type: "patch", value: numericPatchGrade },
        userId: session.userId,
        pathName: `PATCH /api/${schoolSlug}/grades`,
      });

      if (!scaleValidation.allowed && scaleValidation.errorResponse) {
        return apiError(
          `La calificación ${numericPatchGrade} no cumple con los requisitos de escala de la institución.`,
          "GRADE_INVALID_SCALE",
          { statusCode: 400 }
        );
      }
    }

    // Si incluye modificaciones a la evaluación (`prisma.assessment.update`)
    let updatedAssessment: any = null;
    if (body.assessmentId && body.assessmentUpdates && isDatabaseConfigured()) {
      updatedAssessment = await prisma.assessment.update({
        where: { id: body.assessmentId },
        data: {
          ...(body.assessmentUpdates.title ? { title: body.assessmentUpdates.title } : {}),
          ...(body.assessmentUpdates.weightPercentage !== undefined
            ? { weightPercentage: body.assessmentUpdates.weightPercentage }
            : {}),
          ...(body.assessmentUpdates.isPublished !== undefined
            ? { isPublished: body.assessmentUpdates.isPublished }
            : {}),
        },
      });
    }

    // Si incluye actualización a la calificación
    let updatedGrade: any = null;
    if (body.gradeId && isDatabaseConfigured()) {
      const currentGrade = await prisma.grade.findFirst({
        where: { id: body.gradeId, schoolId },
      });

      if (!currentGrade) {
        return apiError("La calificación no existe o no pertenece a esta institución.", "NOT_FOUND", {
          statusCode: 404,
        });
      }

      const patchVal = patchGradeInput !== undefined ? Number(patchGradeInput) : undefined;

      updatedGrade = await prisma.grade.update({
        where: { id: body.gradeId },
        data: {
          ...(patchVal !== undefined ? { value: patchVal } : {}),
          ...(body.feedback !== undefined || body.comment !== undefined
            ? { feedback: body.feedback || body.comment }
            : {}),
        },
      });
    }

    return apiSuccess({
      grade: updatedGrade,
      assessment: updatedAssessment,
    });
  } catch (error: any) {
    return apiError(error.message || "Error al actualizar registro.", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
