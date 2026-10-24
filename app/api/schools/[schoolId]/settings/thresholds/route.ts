export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * API Route: Umbrales del Semáforo Institucional (Decreto 67 y Escala Propia)
 * Permite a los administradores de cada colegio consultar y ajustar los umbrales
 * de los colores del semáforo para promedios (rojo, ámbar, verde, azul) con persistencia en DB.
 * 
 * Responsables:
 * - 👑 Maicol R. (Arquitectura de Backend, Multi-tenant Isolation y RBAC Server-Side)
 * - 🛡️ Frank M. (Seguridad, Validación Decreto 67 y Pista de Auditoría)
 */

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { GradeColorThresholdsSchema } from "@/lib/validations/school.schema";
import {
  getSchoolGradeThresholds,
  updateSchoolGradeThresholds,
} from "@/lib/services/school.service";
import { apiSuccess, apiError } from "@/lib/api/response";

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
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
      include: { settings: true },
    });

    if (!school) {
      return apiError("Institución educativa no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // Validación de acceso multi-tenant
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId: school.id,
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }
    }

    const thresholds = await getSchoolGradeThresholds(school.id);
    const minGrade = Number(school.settings?.minGrade ?? 1.0);
    const maxGrade = Number(school.settings?.maxGrade ?? 7.0);
    const minPassingGrade = Number(school.settings?.minPassingGrade ?? 4.0);

    return apiSuccess({
      schoolId: school.id,
      schoolSlug: school.slug,
      schoolName: school.name,
      minGrade,
      maxGrade,
      minPassingGrade,
      thresholds,
    });
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al obtener los umbrales del semáforo",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const { schoolId } = await params;
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
      include: { settings: true },
    });

    if (!school) {
      return apiError("Institución educativa no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // Control de Acceso Estricto (RBAC Server-Side)
    // Solo Administradores Globales o Administradores de Colegio con permiso de settings:update
    if (!session.isSystemAdmin) {
      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: session.userId,
            schoolId: school.id,
          },
        },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      if (!membership || !membership.isActive) {
        return apiError("Acceso denegado a esta institución", "FORBIDDEN", { statusCode: 403 });
      }

      const isSchoolAdminRole =
        membership.role.name === "SCHOOL_ADMIN" ||
        membership.role.name === "ADMIN" ||
        membership.role.name === "SUPER_ADMIN" ||
        membership.role.name === "DIRECTOR";

      const hasUpdatePermission = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
          rp.permission.code === "*"
      );

      if (!isSchoolAdminRole && !hasUpdatePermission) {
        return apiError(
          "Permisos insuficientes: Solo administradores de la institución pueden configurar los umbrales del semáforo.",
          "FORBIDDEN",
          { statusCode: 403 }
        );
      }
    }

    const body = await req.json();
    const validation = GradeColorThresholdsSchema.safeParse(body);

    if (!validation.success) {
      return apiError("Datos de umbrales inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validation.error.flatten(),
      });
    }

    const thresholds = validation.data;
    const minGrade = Number(school.settings?.minGrade ?? 1.0);
    const maxGrade = Number(school.settings?.maxGrade ?? 7.0);

    // Validación de coherencia contra la escala configurada del colegio
    if (thresholds.redMax < minGrade) {
      return apiError(
        `El umbral rojo (${thresholds.redMax}) no puede ser inferior a la nota mínima de la institución (${minGrade}).`,
        "VALIDATION_ERROR",
        { statusCode: 400 }
      );
    }

    if (thresholds.blueMax > maxGrade) {
      return apiError(
        `El umbral azul (${thresholds.blueMax}) no puede superar la nota máxima de la institución (${maxGrade}).`,
        "VALIDATION_ERROR",
        { statusCode: 400 }
      );
    }

    const updated = await updateSchoolGradeThresholds(school.id, thresholds, session.userId);

    return apiSuccess(
      {
        schoolId: school.id,
        thresholds: updated,
      },
      { message: "Umbrales del semáforo actualizados exitosamente en la base de datos." }
    );
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al actualizar los umbrales del semáforo",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}
