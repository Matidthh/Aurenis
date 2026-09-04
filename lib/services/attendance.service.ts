import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { AttendanceStatus } from "@prisma/client";

export async function listAttendanceRecords(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { courseId?: string; date?: Date }
) {
  const targetDate = options?.date || new Date();

  return tenantDb.attendanceRecord.findMany({
    where: {
      schoolId,
      date: targetDate,
      ...(options?.courseId ? { courseId: options.courseId } : {}),
    },
    include: {
      course: true,
      student: {
        include: {
          membership: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: {
      student: {
        membership: {
          user: { lastName: "asc" },
        },
      },
    },
  });
}

export async function getAttendanceOverview(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId?: string
) {
  const [totalRecords, presentCount, justifiedCount, unjustifiedCount, lateCount] = await Promise.all([
    tenantDb.attendanceRecord.count({
      where: { schoolId, ...(courseId ? { courseId } : {}) },
    }),
    tenantDb.attendanceRecord.count({
      where: { schoolId, status: AttendanceStatus.PRESENT, ...(courseId ? { courseId } : {}) },
    }),
    tenantDb.attendanceRecord.count({
      where: { schoolId, status: AttendanceStatus.ABSENT_JUSTIFIED, ...(courseId ? { courseId } : {}) },
    }),
    tenantDb.attendanceRecord.count({
      where: { schoolId, status: AttendanceStatus.ABSENT_UNJUSTIFIED, ...(courseId ? { courseId } : {}) },
    }),
    tenantDb.attendanceRecord.count({
      where: { schoolId, status: AttendanceStatus.LATE, ...(courseId ? { courseId } : {}) },
    }),
  ]);

  const attendanceRate = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords) * 100 : 100;

  return {
    totalRecords,
    presentCount,
    justifiedCount,
    unjustifiedCount,
    lateCount,
    attendanceRate: Math.round(attendanceRate * 10) / 10,
  };
}
