import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listStudentsBySchool } from "@/lib/services/student.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { StudentListView } from "@/components/academic/student-list-view";
import { Users } from "lucide-react";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const [enrollments, courses] = await Promise.all([
    listStudentsBySchool(tenantDb, tenantCtx.schoolId),
    tenantDb.course.findMany({
      where: { schoolId: tenantCtx.schoolId, deletedAt: null },
      orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
    }),
  ]);

  const courseOptions = courses.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <Page>
      <PageHeader
        title="Directorio y Fichas de Estudiantes"
        description="Consulta, filtrado multidimensional, fichas individuales y gestión de matrículas institucionales."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: `/${schoolSlug}/dashboard` },
              { label: "Estudiantes" },
            ]}
          />
        }
        badge={
          <Badge variant="brand">
            <Users className="w-3.5 h-3.5" />
            {enrollments.length} Estudiantes Registrados
          </Badge>
        }
      />

      <div className="max-w-7xl">
        <StudentListView
          schoolSlug={schoolSlug}
          enrollments={enrollments as any}
          courses={courseOptions}
        />
      </div>
    </Page>
  );
}

