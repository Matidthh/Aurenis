import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/authorization";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";

// Helper para obtener schoolId desde el slug
async function getSchoolIdFromSlug(schoolSlug: string): Promise<string> {
  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    select: { id: true },
  });
  
  if (!school) {
    throw new Error("Colegio no encontrado");
  }
  
  return school.id;
}

// GET /api/[schoolSlug]/grades - Listar calificaciones
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolSlug = context.params?.schoolSlug;
    if (!schoolSlug) {
      return NextResponse.json({ error: "Slug de colegio requerido" }, { status: 400 });
    }

    const schoolId = await getSchoolIdFromSlug(schoolSlug);
    
    // Verificar acceso al colegio
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No tienes acceso a este colegio" }, { status: 403 });
    }

    // Verificar permiso de ver calificaciones
    if (!context.permissions.includes(PERMISSIONS.GRADES_VIEW)) {
      return NextResponse.json({ error: "No tienes permiso para ver calificaciones" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const studentProfileId = searchParams.get("studentProfileId");

    const grades = await prisma.grade.findMany({
      where: {
        schoolId,
        ...(courseId && { enrollment: { courseId } }),
        ...(studentProfileId && { enrollment: { studentProfileId } }),
      },
      include: {
        assessment: {
          include: {
            subject: true,
            academicPeriod: true,
          },
        },
        enrollment: {
          include: {
            student: {
              include: {
                membership: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            course: true,
          },
        },
      },
      orderBy: {
        assessment: {
          date: "desc",
        },
      },
    });

    return NextResponse.json({ success: true, grades });
  })
);

// POST /api/[schoolSlug]/grades - Ingresar calificación
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolSlug = context.params?.schoolSlug;
    if (!schoolSlug) {
      return NextResponse.json({ error: "Slug de colegio requerido" }, { status: 400 });
    }

    const schoolId = await getSchoolIdFromSlug(schoolSlug);
    
    // Verificar acceso al colegio
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No tienes acceso a este colegio" }, { status: 403 });
    }

    // Verificar permiso de ingresar calificaciones
    if (!context.permissions.includes(PERMISSIONS.GRADES_ENTER)) {
      return NextResponse.json({ error: "No tienes permiso para ingresar calificaciones" }, { status: 403 });
    }

    const body = await req.json();
    
    const grade = await prisma.grade.create({
      data: {
        schoolId,
        assessmentId: body.assessmentId,
        enrollmentId: body.enrollmentId,
        value: body.value,
        feedback: body.feedback,
      },
      include: {
        assessment: {
          include: {
            subject: true,
          },
        },
        enrollment: {
          include: {
            student: {
              include: {
                membership: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, grade }, { status: 201 });
  })
);