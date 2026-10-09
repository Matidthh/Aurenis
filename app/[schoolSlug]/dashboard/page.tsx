import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
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
  const session = await getSession();

  // Determinar rol por defecto para la primera carga
  const activeRoleName = session?.roleName || tenantCtx.roleName;
  let defaultRole: RoleType = "DIRECTIVO";
  if (activeRoleName === "TEACHER") defaultRole = "DOCENTE";
  else if (activeRoleName === "STUDENT") defaultRole = "ESTUDIANTE";
  else if (activeRoleName === "GUARDIAN") defaultRole = "APODERADO";
  else if (activeRoleName === "CONVIVENCIA") defaultRole = "CONVIVENCIA";

  const resolvedUserName =
    session?.firstName && session?.lastName
      ? `${session.firstName} ${session.lastName}`
      : session?.email?.split("@")[0] || "Usuario Institucional";

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
          userName={resolvedUserName}
          userEmail={session?.email}
          userRole={activeRoleName}
          schoolName={tenantCtx.schoolName}
        />
      </div>
    </Page>
  );
}
