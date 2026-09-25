export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { UpdateGradeSchema } from "@/lib/validations/grade.schema";
import { updateGrade, deleteGrade } from "@/lib/services/grade.service";
import { validateSingleGradeAccess } from "@/lib/security/object-authorization";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; gradeId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, gradeId } = await params;
    const authResult = await validateSingleGradeAccess(session, schoolId, gradeId);

    if (!authResult.allowed) {
      return NextResponse.json(
        { error: authResult.reason || "Acceso denegado" },
        { status: authResult.statusCode || 403 }
      );
    }

    return NextResponse.json({ success: true, grade: authResult.grade });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error al consultar calificación" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; gradeId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, gradeId } = await params;

    // Verificar permisos para modificar notas (GRADES_MODIFY)
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
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const canModify = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.GRADES_MODIFY
      );

      if (!canModify) {
        return NextResponse.json(
          { error: "Acceso denegado. Permisos insuficientes para modificar calificaciones." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = UpdateGradeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de modificación inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(schoolId);
    const updated = await updateGrade(tenantDb, schoolId, gradeId, validated.data, session.userId);

    return NextResponse.json({ success: true, grade: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar nota" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string; gradeId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId, gradeId } = await params;

    // Verificar permisos para borrar notas (GRADES_MODIFY)
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
        return NextResponse.json({ error: "Acceso denegado a esta institución" }, { status: 403 });
      }

      const canModify = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.GRADES_MODIFY
      );

      if (!canModify) {
        return NextResponse.json(
          { error: "Acceso denegado. Permisos insuficientes para eliminar calificaciones." },
          { status: 403 }
        );
      }
    }

    const tenantDb = createTenantPrisma(schoolId);
    await deleteGrade(tenantDb, schoolId, gradeId, session.userId);

    return NextResponse.json({ success: true, message: "Calificación eliminada" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar nota" }, { status: 500 });
  }
}
