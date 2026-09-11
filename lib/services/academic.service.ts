import { TenantPrismaClient } from "@/lib/db/tenant-extension";

export async function getSchoolAcademicOverview(tenantDb: TenantPrismaClient, schoolId: string) {
  const currentYear = new Date().getFullYear();

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
}

export async function listCoursesByYear(tenantDb: TenantPrismaClient, schoolId: string, year: number) {
  return tenantDb.course.findMany({
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
}

export async function listAcademicPeriods(tenantDb: TenantPrismaClient, schoolId: string) {
  return tenantDb.academicPeriod.findMany({
    where: { schoolId },
    orderBy: { startDate: "desc" },
  });
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
