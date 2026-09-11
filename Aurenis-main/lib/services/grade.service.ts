import { TenantPrismaClient } from "@/lib/db/tenant-extension";

export async function listAssessmentsWithGrades(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { subjectId?: string; periodId?: string }
) {
  return tenantDb.assessment.findMany({
    where: {
      schoolId,
      ...(options?.subjectId ? { subjectId: options.subjectId } : {}),
      ...(options?.periodId ? { academicPeriodId: options.periodId } : {}),
    },
    include: {
      subject: {
        include: {
          course: true,
          teacher: {
            include: {
              membership: {
                include: { user: true },
              },
            },
          },
        },
      },
      academicPeriod: true,
      grades: {
        include: {
          enrollment: {
            include: {
              student: {
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
    orderBy: { date: "desc" },
  });
}

export async function getSchoolGradingConfig(tenantDb: TenantPrismaClient, schoolId: string) {
  const settings = await tenantDb.schoolSettings.findUnique({
    where: { schoolId },
  });

  return {
    minPassingGrade: Number(settings?.minPassingGrade || 4.0),
    minGrade: Number(settings?.minGrade || 1.0),
    maxGrade: Number(settings?.maxGrade || 7.0),
    precision: settings?.gradeScalePrecision || 1,
    termType: settings?.termType || "SEMESTER",
  };
}
