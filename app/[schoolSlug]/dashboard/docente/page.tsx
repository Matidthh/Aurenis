import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { DocenteDashboard } from "@/components/dashboard/docente-dashboard";

export default async function DocenteDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  return (
    <Page title="Dashboard Docentes & Profesores">
      <DocenteDashboard schoolSlug={schoolSlug} teacherName={`${tenantCtx.firstName} ${tenantCtx.lastName}`} />
    </Page>
  );
}
