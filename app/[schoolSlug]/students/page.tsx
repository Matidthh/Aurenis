import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listStudentsBySchool } from "@/lib/services/student.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { StudentDirectoryManager } from "@/components/students/student-directory-manager";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const enrollments = await listStudentsBySchool(tenantDb, tenantCtx.schoolId);

  return (
    <Page>
      <PageHeader
        title="Directorio de Estudiantes"
        description="Gestión de alumnos, matrículas activas, ficha 360°, notas y datos de apoderados."
        badge={
          <Badge variant="brand">
            <Users className="w-3.5 h-3.5" />
            {enrollments.length > 0 ? enrollments.length : 8} Estudiantes Registrados
          </Badge>
        }
      />

      <StudentDirectoryManager initialStudents={enrollments} />
    </Page>
  );
}
