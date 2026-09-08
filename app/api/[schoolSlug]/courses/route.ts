import { NextRequest, NextResponse } from "next/server";
import { withAuth, withPermissions } from "@/lib/middleware/authorization";
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

// GET /api/[schoolSlug]/courses - Listar cursos del colegio
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolSlug = context.params?.schoolSlug;
    if (!schoolSlug) {
      return NextResponse.json({ error: "Slug de colegio requerido" }, { status: 400 });
    }

    const schoolId = await getSchoolIdFromSlug(schoolSlug);
    
    // Verificar permisos para este colegio específico
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No tienes acceso a este colegio" }, { status: 403 });
    }

    // Verificar permiso específico
    if (!context.isSystemAdmin && !context.permissions.includes(PERMISSIONS.ACADEMIC_COURSES_MANAGE)) {
      return NextResponse.json({ error: "No tienes permiso para gestionar cursos" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!) : new Date().getFullYear();
    const educationLevelId = searchParams.get("educationLevelId");

    const courses = await prisma.course.findMany({
      where: {
        schoolId,
        year,
        ...(educationLevelId && { educationLevelId }),
      },
      include: {
        educationLevel: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: [
        { gradeNumber: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ success: true, courses });
  })
);

// POST /api/[schoolSlug]/courses - Crear nuevo curso
export const POST = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    const schoolSlug = context.params?.schoolSlug;
    if (!schoolSlug) {
      return NextResponse.json({ error: "Slug de colegio requerido" }, { status: 400 });
    }

    const schoolId = await getSchoolIdFromSlug(schoolSlug);
    
    // Verificar permisos para este colegio específico
    if (!context.isSystemAdmin && context.activeSchoolId !== schoolId) {
      return NextResponse.json({ error: "No tienes acceso a este colegio" }, { status: 403 });
    }

    // Verificar permiso específico
    if (!context.isSystemAdmin && !context.permissions.includes(PERMISSIONS.ACADEMIC_COURSES_MANAGE)) {
      return NextResponse.json({ error: "No tienes permiso para gestionar cursos" }, { status: 403 });
    }

    const body = await req.json();
    
    const course = await prisma.course.create({
      data: {
        schoolId,
        educationLevelId: body.educationLevelId,
        name: body.name,
        letter: body.letter,
        gradeNumber: body.gradeNumber,
        year: body.year || new Date().getFullYear(),
      },
      include: {
        educationLevel: true,
      },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  })
);