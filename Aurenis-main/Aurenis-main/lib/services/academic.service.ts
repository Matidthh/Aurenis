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
