import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listAttendanceRecords, getAttendanceOverview } from "@/lib/services/attendance.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";
import { AttendanceClientView } from "@/components/attendance/attendance-client-view";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { getMockStore } from "@/lib/db/mock-db";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  let courses: Array<{ id: string; name: string }> = [];

  if (isDatabaseConfigured()) {
    try {
      const dbCourses = await tenantDb.course.findMany({
        where: { schoolId: tenantCtx.schoolId, deletedAt: null },
        orderBy: { name: "asc" },
      });
      courses = dbCourses.map((c) => ({ id: c.id, name: c.name }));
    } catch {
      // Fallback
    }
  }

  if (courses.length === 0) {
    const store = getMockStore();
    const mockCourses = Array.from(store.courses.values()).filter(
      (c) => c.schoolId === tenantCtx.schoolId
    );
    if (mockCourses.length > 0) {
      courses = mockCourses.map((c) => ({ id: c.id, name: c.name }));
    } else {
      courses = [
        { id: "course-lpmm-4e", name: "4° Medio E" },
        { id: "course-lpmm-1a", name: "1° Medio A" },
        { id: "course-lpmm-2a", name: "2° Medio A" },
      ];
    }
  }

  const [records, metrics] = await Promise.all([
    listAttendanceRecords(tenantDb, tenantCtx.schoolId),
    getAttendanceOverview(tenantDb, tenantCtx.schoolId),
  ]);

  return (
    <Page>
      <PageHeader
        title="Control de Asistencia Híbrida (QR + Manual)"
        description="Sistema oficial de pase de lista diario. Genera códigos QR dinámicos para estudiantes y gestiona modificaciones manuales en tiempo real."
        badge={
          <Badge variant="brand">
            <CalendarCheck className="w-3.5 h-3.5" />
            Tasa Global: {metrics.attendanceRate}%
          </Badge>
        }
      />

      <AttendanceClientView
        schoolSlug={schoolSlug}
        courses={courses}
        records={records}
        metrics={metrics}
      />
    </Page>
  );
}
