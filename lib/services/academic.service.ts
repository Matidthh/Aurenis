import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export async function getSchoolAcademicOverview(tenantDb: TenantPrismaClient, schoolId: string) {
  const currentYear = new Date().getFullYear();

  if (isDatabaseConfigured()) {
    try {
      const [totalCourses, totalSubjects, activePeriod, totalStudents] = await Promise.all([
        tenantDb.course.count({
          where: { schoolId, year: currentYear },
        }),
        tenantDb.subject.count({
          where: { schoolId },
        }),
        tenantDb.academicPeriod.findFirst({
          where: { schoolId, isCurrent: true },
        }),
        tenantDb.enrollment.count({
          where: { schoolId, year: currentYear, status: "ACTIVE" },
        }),
      ]);

      return {
        currentYear,
        totalCourses,
        totalSubjects,
        activePeriod,
        totalStudents,
      };
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return {
    currentYear,
    totalCourses: 8,
    totalSubjects: 24,
    activePeriod: { id: "per_sem1_demo", name: "Primer Semestre 2026", startDate: new Date("2026-03-01"), endDate: new Date("2026-07-15") },
    totalStudents: 145,
  };
}

export interface CourseItem {
  id: string;
  name: string;
  gradeNumber: number;
  letter: string;
  year: number;
  educationLevel: { id: string; name: string };
  subjects: { id: string; name: string; teacher?: any }[];
  _count: { enrollments: number };
}

export async function listCoursesByYear(tenantDb: TenantPrismaClient, schoolId: string, year: number): Promise<CourseItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const courses = await tenantDb.course.findMany({
        where: { schoolId, year },
        include: {
          educationLevel: true,
          subjects: {
            include: {
              teacher: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
      });

      if (courses.length > 0) return courses as unknown as CourseItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  // Fallback demo courses
  return [
    {
      id: "course_1a_demo",
      name: "1° Básico A",
      gradeNumber: 1,
      letter: "A",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_1", name: "Matemáticas", teacher: null },
        { id: "sub_len_1", name: "Lenguaje y Comunicación", teacher: null },
        { id: "sub_cie_1", name: "Ciencias Naturales", teacher: null },
      ],
      _count: { enrollments: 28 },
    },
    {
      id: "course_1b_demo",
      name: "1° Básico B",
      gradeNumber: 1,
      letter: "B",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_2", name: "Matemáticas", teacher: null },
        { id: "sub_len_2", name: "Lenguaje y Comunicación", teacher: null },
      ],
      _count: { enrollments: 26 },
    },
    {
      id: "course_2a_demo",
      name: "2° Básico A",
      gradeNumber: 2,
      letter: "A",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_3", name: "Matemáticas", teacher: null },
        { id: "sub_his_1", name: "Historia y Geografía", teacher: null },
      ],
      _count: { enrollments: 30 },
    },
  ];
}

export interface AcademicPeriodItem {
  id: string;
  name: string;
  isCurrent?: boolean;
  startDate: Date;
  endDate: Date;
}

export async function listAcademicPeriods(tenantDb: TenantPrismaClient, schoolId: string): Promise<AcademicPeriodItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const periods = await tenantDb.academicPeriod.findMany({
        where: { schoolId },
        orderBy: { startDate: "desc" },
      });
      if (periods.length > 0) return periods as unknown as AcademicPeriodItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return [
    { id: "per_sem1_demo", name: "Primer Semestre 2026", isCurrent: true, startDate: new Date("2026-03-01"), endDate: new Date("2026-07-15") },
    { id: "per_sem2_demo", name: "Segundo Semestre 2026", isCurrent: false, startDate: new Date("2026-08-01"), endDate: new Date("2026-12-15") },
  ];
}

export async function createCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  input: {
    name: string;
    educationLevelId: string;
    gradeNumber: number;
    letter?: string;
    year: number;
  },
  userId?: string
) {
  const course = await tenantDb.course.create({
    data: {
      schoolId,
      name: input.name,
      educationLevelId: input.educationLevelId,
      gradeNumber: input.gradeNumber,
      letter: input.letter || null,
      year: input.year,
    },
  });

  return course;
}

export async function updateCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId: string,
  input: {
    name?: string;
    educationLevelId?: string;
    gradeNumber?: number;
    letter?: string;
    year?: number;
  },
  userId?: string
) {
  const existing = await tenantDb.course.findFirst({
    where: { id: courseId, schoolId },
  });

  if (!existing) {
    throw new Error(`Curso '${courseId}' no encontrado en la institución.`);
  }

  const updated = await tenantDb.course.update({
    where: { id: courseId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.educationLevelId !== undefined ? { educationLevelId: input.educationLevelId } : {}),
      ...(input.gradeNumber !== undefined ? { gradeNumber: input.gradeNumber } : {}),
      ...(input.letter !== undefined ? { letter: input.letter } : {}),
      ...(input.year !== undefined ? { year: input.year } : {}),
    },
  });

  return updated;
}

export async function deleteCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId: string,
  userId?: string
) {
  const existing = await tenantDb.course.findFirst({
    where: { id: courseId, schoolId },
  });

  if (!existing) {
    throw new Error(`Curso '${courseId}' no encontrado en la institución.`);
  }

  await tenantDb.course.delete({
    where: { id: courseId },
  });

  return { success: true };
}
