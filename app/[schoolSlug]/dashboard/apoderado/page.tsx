import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { ApoderadoDashboard } from "@/components/dashboard/apoderado-dashboard";

export default async function ApoderadoDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  return (
    <Page title="Dashboard Apoderados">
      <ApoderadoDashboard schoolSlug={schoolSlug} guardianName={`${tenantCtx.firstName} ${tenantCtx.lastName}`} />
    </Page>
  );
}
