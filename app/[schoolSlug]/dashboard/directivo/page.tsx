import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { DirectivoDashboard } from "@/components/dashboard/directivo-dashboard";

export default async function DirectivoDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  return (
    <Page title="Dashboard Directivo & UTP">
      <DirectivoDashboard schoolSlug={schoolSlug} schoolName={tenantCtx.schoolName} />
    </Page>
  );
}
