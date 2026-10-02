import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { ConvivenciaDashboard } from "@/components/dashboard/convivencia-dashboard";

export default async function ConvivenciaDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  return (
    <Page title="Dashboard Convivencia Escolar">
      <ConvivenciaDashboard schoolSlug={schoolSlug} officerName={`${tenantCtx.firstName} ${tenantCtx.lastName}`} />
    </Page>
  );
}
