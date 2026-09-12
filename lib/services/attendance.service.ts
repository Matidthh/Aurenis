import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { AttendanceStatus } from "@prisma/client";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export interface AttendanceRecordItem {
  id: string;
  date: Date;
  status: string;
  justification?: string | null;
  course: { name: string };
  student: {
    membership: {
      user: { firstName: string; lastName: string };
    };
  };
}

export async function listAttendanceRecords(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { courseId?: string; date?: Date }
): Promise<AttendanceRecordItem[]> {
  const targetDate = options?.date || new Date();

  if (isDatabaseConfigured()) {
    try {
      const records = await tenantDb.attendanceRecord.findMany({
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

      if (records.length > 0) return records as unknown as AttendanceRecordItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return [
    {
      id: "att_1_demo",
      date: new Date(),
      status: "PRESENT",
      justification: null,
      course: { name: "1° Básico A" },
      student: {
        membership: {
          user: { firstName: "Martina", lastName: "González" },
        },
      },
    },
    {
      id: "att_2_demo",
      date: new Date(),
      status: "LATE",
      justification: "Atención dental",
      course: { name: "1° Básico A" },
      student: {
        membership: {
          user: { firstName: "Benjamín", lastName: "Silva" },
        },
      },
    },
    {
      id: "att_3_demo",
      date: new Date(),
      status: "ABSENT_JUSTIFIED",
      justification: "Licencia médica",
      course: { name: "2° Básico A" },
      student: {
        membership: {
          user: { firstName: "Sofía", lastName: "Rojas" },
        },
      },
    },
  ];
}

export async function getAttendanceOverview(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId?: string
) {
  if (isDatabaseConfigured()) {
    try {
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
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return {
    totalRecords: 145,
    presentCount: 138,
    justifiedCount: 4,
    unjustifiedCount: 1,
    lateCount: 2,
    attendanceRate: 96.5,
  };
}
