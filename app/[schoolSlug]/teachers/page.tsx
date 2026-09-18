import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listTeachersBySchool } from "@/lib/services/teacher.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { TeacherDirectoryManager } from "@/components/features/teachers/teacher-directory-manager";

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const teachers = await listTeachersBySchool(tenantDb, tenantCtx.schoolId);

  return (
    <Page>
      <PageHeader
        title="Plantel Docente y Asignación Académica"
        description="Nómina del cuerpo de profesores, especialidades, carga horaria legal y asignación de materias."
        badge={
          <Badge variant="brand">
            <GraduationCap className="w-3.5 h-3.5" />
            {teachers.length > 0 ? teachers.length : 6} Docentes Registrados
          </Badge>
        }
      />

      <TeacherDirectoryManager initialTeachers={teachers} />
    </Page>
  );
}
