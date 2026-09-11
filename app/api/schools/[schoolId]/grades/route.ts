import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { CreateGradeSchema } from "@/lib/validations/grade.schema";
import { listAssessmentsWithGrades, createGrade } from "@/lib/services/grade.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId } = await params;

    // Verificar pertenencia y permisos
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

      const hasView = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.GRADES_VIEW
      );
      if (!hasView) {
        return NextResponse.json({ error: "Acceso denegado. Sin permisos de lectura de notas." }, { status: 403 });
      }
    }

    const tenantDb = createTenantPrisma(schoolId);
    const assessments = await listAssessmentsWithGrades(tenantDb, schoolId);

    return NextResponse.json({ success: true, assessments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener calificaciones" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { schoolId } = await params;

    // Verificar permisos para ingresar notas (GRADES_ENTER)
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

      const canEnter = membership.role.permissions.some(
        (rp) => rp.permission.code === PERMISSIONS.GRADES_ENTER
      );

      if (!canEnter) {
        return NextResponse.json(
          { error: "Acceso denegado. Permisos insuficientes para ingresar o crear calificaciones." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const validated = CreateGradeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de calificación inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const tenantDb = createTenantPrisma(schoolId);
    const grade = await createGrade(tenantDb, schoolId, validated.data, session.userId);

    return NextResponse.json({ success: true, grade }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al registrar nota" }, { status: 500 });
  }
}
