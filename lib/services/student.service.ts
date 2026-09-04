import { TenantPrismaClient } from "@/lib/db/tenant-extension";

export async function listStudentsBySchool(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { courseId?: string; year?: number }
) {
  const currentYear = options?.year || new Date().getFullYear();

  return tenantDb.enrollment.findMany({
    where: {
      schoolId,
      year: currentYear,
      ...(options?.courseId ? { courseId: options.courseId } : {}),
    },
    include: {
      course: {
        include: { educationLevel: true },
      },
      student: {
        include: {
          membership: {
            include: { user: true },
          },
          guardians: {
            include: {
              guardian: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: [
      { course: { gradeNumber: "asc" } },
      { course: { letter: "asc" } },
      { student: { membership: { user: { lastName: "asc" } } } },
    ],
  });
}

export async function getStudentDetails(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  studentProfileId: string
) {
  return tenantDb.studentProfile.findFirst({
    where: {
      id: studentProfileId,
      membership: { schoolId },
    },
    include: {
      membership: {
        include: { user: true },
      },
      enrollments: {
        where: { schoolId },
        include: {
          course: true,
          grades: {
            include: { assessment: true },
          },
        },
      },
      guardians: {
        include: {
          guardian: {
            include: {
              membership: {
                include: { user: true },
              },
            },
          },
        },
      },
      attendances: {
        where: { schoolId },
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });
}
