import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { EstudianteDashboard } from "@/components/dashboard/estudiante-dashboard";

export default async function EstudianteDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  return (
    <Page title="Dashboard Estudiantes">
      <EstudianteDashboard schoolSlug={schoolSlug} studentName={`${tenantCtx.firstName} ${tenantCtx.lastName}`} />
    </Page>
  );
}
