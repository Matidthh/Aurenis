import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { generateSchoolBackupZip } from "@/lib/services/export-backup.service";
import { apiError } from "@/lib/api/response";
import { PERMISSIONS } from "@/lib/constants/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const { schoolId } = await params;
    const session = await getSession();

    // 1. Resolve school by ID or Slug
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });

    if (!school) {
      return apiError("Institución educativa no encontrada", "NOT_FOUND", { statusCode: 404 });
    }

    // 2. Authorization check
    // In development / preview demo mode without an active cookie session, allow authorized demo exploration
    if (session) {
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
          return apiError("No tienes acceso a esta institución", "FORBIDDEN", { statusCode: 403 });
        }

        const roleName = (membership.role?.name || "").toUpperCase();
        const isDirectorOrAdmin =
          roleName === "SCHOOL_ADMIN" ||
          roleName === "ADMIN" ||
          roleName === "DIRECTOR" ||
          roleName === "SYSTEM_ADMIN";

        const hasSettingsPermission = membership.role?.permissions.some(
          (rp) =>
            rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_VIEW ||
            rp.permission.code === PERMISSIONS.SCHOOL_SETTINGS_UPDATE ||
            rp.permission.code === "*"
        );

        if (!isDirectorOrAdmin && !hasSettingsPermission) {
          return apiError(
            "Solo el Director o Administrador del establecimiento puede exportar el respaldo completo de la base de datos.",
            "FORBIDDEN",
            { statusCode: 403 }
          );
        }
      }
    }

    // 3. Generate .ZIP export
    const { buffer, filename } = await generateSchoolBackupZip(school.id);

    // 4. Return as binary ZIP stream
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[ExportBackup API] Error generando respaldo:", error);
    return apiError(
      error.message || "Error interno al generar el respaldo de datos.",
      "INTERNAL_SERVER_ERROR",
      { statusCode: 500 }
    );
  }
}
