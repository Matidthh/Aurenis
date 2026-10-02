import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { RoleDashboardShell, RoleType } from "@/components/dashboard/role-dashboard-shell";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  // Determinar rol por defecto para la primera carga
  let defaultRole: RoleType = "DIRECTIVO";
  if (tenantCtx.roleName === "TEACHER") defaultRole = "DOCENTE";
  else if (tenantCtx.roleName === "STUDENT") defaultRole = "ESTUDIANTE";
  else if (tenantCtx.roleName === "GUARDIAN") defaultRole = "APODERADO";
  else if (tenantCtx.roleName === "CONVIVENCIA") defaultRole = "CONVIVENCIA";

  return (
    <Page title="Paneles de Gestión Académica & Roles">
      <div className="space-y-6">
        <PageHeader
          title={`Tablero de Control — ${tenantCtx.schoolName}`}
          description="Acceda a los paneles especializados para Directivos, Docentes, Convivencia Escolar, Apoderados y Alumnos."
        />

        <RoleDashboardShell
          schoolSlug={schoolSlug}
          defaultRole={defaultRole}
          userName={`${tenantCtx.firstName} ${tenantCtx.lastName}`}
          schoolName={tenantCtx.schoolName}
        />
      </div>
    </Page>
  );
}
