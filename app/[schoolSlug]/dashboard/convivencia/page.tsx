import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { Page } from "@/components/layout/page";
import { ConvivenciaDashboard } from "@/components/dashboard/convivencia-dashboard";

export default async function ConvivenciaDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const session = await getSession();
  const officerName =
    session?.firstName && session?.lastName
      ? `${session.firstName} ${session.lastName}`
      : "Encargado de Convivencia";

  return (
    <Page title="Dashboard Convivencia Escolar">
      <ConvivenciaDashboard schoolSlug={schoolSlug} officerName={officerName} />
    </Page>
  );
}
