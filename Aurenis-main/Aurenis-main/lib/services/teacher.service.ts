import { TenantPrismaClient } from "@/lib/db/tenant-extension";

export async function listTeachersBySchool(tenantDb: TenantPrismaClient, schoolId: string) {
  return tenantDb.teacherProfile.findMany({
    where: {
      membership: { schoolId },
    },
    include: {
      membership: {
        include: { user: true },
      },
      subjects: {
        where: { schoolId },
        include: {
          course: {
            include: { educationLevel: true },
          },
        },
      },
    },
    orderBy: {
      membership: {
        user: { lastName: "asc" },
      },
    },
  });
}

export async function getTeacherDetails(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  teacherProfileId: string
) {
  return tenantDb.teacherProfile.findFirst({
    where: {
      id: teacherProfileId,
      membership: { schoolId },
    },
    include: {
      membership: {
        include: { user: true },
      },
      subjects: {
        where: { schoolId },
        include: {
          course: true,
          assessments: true,
        },
      },
    },
  });
}
