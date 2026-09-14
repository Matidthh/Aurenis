import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listTeachersBySchool } from "@/lib/services/teacher.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { TeacherListView } from "@/components/academic/teacher-list-view";
import { GraduationCap } from "lucide-react";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const currentYear = new Date().getFullYear();

  // 1. Obtener lista de profesores
  const teachers = await listTeachersBySchool(tenantDb, tenantCtx.schoolId);

  // 2. Obtener lista de cursos para asignación
  let courses: Array<{ id: string; name: string; educationLevel?: { name: string } | null }> = [];
  let availableSubjects: Array<{
    id: string;
    name: string;
    code?: string | null;
    hoursPerWeek: number;
    courseId: string;
    teacherProfileId?: string | null;
    course: { id: string; name: string; educationLevel?: { name: string } | null };
  }> = [];

  if (isDatabaseConfigured()) {
    try {
      const [coursesDb, subjectsDb] = await Promise.all([
        tenantDb.course.findMany({
          where: { schoolId: tenantCtx.schoolId, year: currentYear, deletedAt: null },
          include: { educationLevel: true },
          orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
        }),
        tenantDb.subject.findMany({
          where: { schoolId: tenantCtx.schoolId },
          include: {
            course: {
              include: { educationLevel: true },
            },
          },
          orderBy: { name: "asc" },
        }),
      ]);

      courses = coursesDb.map((c) => ({
        id: c.id,
        name: c.name,
        educationLevel: c.educationLevel ? { name: c.educationLevel.name } : null,
      }));

      availableSubjects = subjectsDb.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        hoursPerWeek: s.hoursPerWeek,
        courseId: s.courseId,
        teacherProfileId: s.teacherProfileId,
        course: {
          id: s.course.id,
          name: s.course.name,
          educationLevel: s.course.educationLevel ? { name: s.course.educationLevel.name } : null,
        },
      }));
    } catch {
      // Fallback
    }
  }

  // Si está en modo demo sin DB o lista vacía, agregar cursos base
  if (courses.length === 0) {
    courses = [
      { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Educación Básica" } },
      { id: "course_1b_demo", name: "1° Básico B", educationLevel: { name: "Educación Básica" } },
      { id: "course_2a_demo", name: "2° Básico A", educationLevel: { name: "Educación Básica" } },
      { id: "course_3a_demo", name: "3° Básico A", educationLevel: { name: "Educación Básica" } },
      { id: "course_1m_demo", name: "1° Medio A", educationLevel: { name: "Educación Media" } },
      { id: "course_2m_demo", name: "2° Medio A", educationLevel: { name: "Educación Media" } },
    ];
  }

  if (availableSubjects.length === 0) {
    availableSubjects = [
      {
        id: "sub_1",
        name: "Matemáticas",
        code: "MAT-101",
        hoursPerWeek: 6,
        courseId: "course_1a_demo",
        teacherProfileId: "tp_1_demo",
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_2",
        name: "Matemáticas",
        code: "MAT-201",
        hoursPerWeek: 6,
        courseId: "course_2a_demo",
        teacherProfileId: "tp_1_demo",
        course: { id: "course_2a_demo", name: "2° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_3",
        name: "Lenguaje y Comunicación",
        code: "LEN-101",
        hoursPerWeek: 8,
        courseId: "course_1a_demo",
        teacherProfileId: "tp_2_demo",
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_4",
        name: "Ciencias Naturales",
        code: "CIE-101",
        hoursPerWeek: 4,
        courseId: "course_1a_demo",
        teacherProfileId: "tp_3_demo",
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_5",
        name: "Historia, Geografía y Ciencias Sociales",
        code: "HIS-101",
        hoursPerWeek: 4,
        courseId: "course_1a_demo",
        teacherProfileId: null,
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_6",
        name: "Inglés",
        code: "ING-101",
        hoursPerWeek: 3,
        courseId: "course_1a_demo",
        teacherProfileId: null,
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_7",
        name: "Educación Física y Salud",
        code: "EFI-101",
        hoursPerWeek: 3,
        courseId: "course_1a_demo",
        teacherProfileId: null,
        course: { id: "course_1a_demo", name: "1° Básico A", educationLevel: { name: "Básica" } },
      },
      {
        id: "sub_8",
        name: "Artes Visuales",
        code: "ART-101",
        hoursPerWeek: 2,
        courseId: "course_2a_demo",
        teacherProfileId: null,
        course: { id: "course_2a_demo", name: "2° Básico A", educationLevel: { name: "Básica" } },
      },
    ];
  }

  return (
    <Page>
      <PageHeader
        title="Gestión del Cuerpo Docente"
        description="Directorio de profesores, especialidades académicas, carga horaria y asignación de cursos."
        badge={
          <Badge variant="brand">
            <GraduationCap className="w-3.5 h-3.5" />
            {teachers.length} Docentes Registrados
          </Badge>
        }
      />

      <TeacherListView
        schoolSlug={schoolSlug}
        initialTeachers={teachers}
        courses={courses}
        availableSubjects={availableSubjects}
      />
    </Page>
  );
}
