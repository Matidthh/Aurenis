import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { Page } from "@/components/layout/page";
import { ApoderadoDashboard } from "@/components/dashboard/apoderado-dashboard";

export default async function ApoderadoDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const session = await getSession();
  const guardianName =
    session?.firstName && session?.lastName
      ? `${session.firstName} ${session.lastName}`
      : "Apoderado Titular LPMM";

  return (
    <Page title="Dashboard Apoderados">
      <ApoderadoDashboard schoolSlug={schoolSlug} guardianName={guardianName} />
    </Page>
  );
}
