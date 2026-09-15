import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { CreateAcademicPeriodSchema } from "@/lib/validations/school.schema";
import { listAcademicPeriods, createAcademicPeriod } from "@/lib/services/school.service";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";
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
    const periods = await listAcademicPeriods(schoolId);

    return apiSuccess({ periods });
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al obtener periodos académicos",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
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
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return apiError("Institución no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // Verificar permisos
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

      const hasPermission = membership.role.permissions.some(
        (rp) =>
          rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
          rp.permission.code === "academic:periods:manage" ||
          rp.permission.code === "*"
      );

      if (!hasPermission) {
        return apiError("No tienes permisos para crear periodos académicos", "FORBIDDEN", {
          statusCode: 403,
        });
      }
    }

    const body = await req.json();
    const validated = CreateAcademicPeriodSchema.safeParse(body);

    if (!validated.success) {
      return apiError("Datos inválidos para el periodo académico", "VALIDATION_ERROR", {
        statusCode: 400,
        details: validated.error.flatten(),
      });
    }

    const period = await createAcademicPeriod(school.id, validated.data, session.userId);

    return apiSuccess(
      { period },
      { message: "Periodo académico creado exitosamente" }
    );
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al crear periodo académico",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}
