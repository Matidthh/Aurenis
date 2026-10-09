import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { Page } from "@/components/layout/page";
import { DocenteDashboard } from "@/components/dashboard/docente-dashboard";

export default async function DocenteDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const session = await getSession();
  const teacherName =
    session?.firstName && session?.lastName
      ? `${session.firstName} ${session.lastName}`
      : "Prof. Rodrigo Castro Díaz";

  return (
    <Page title="Dashboard Docentes & Profesores">
      <DocenteDashboard schoolSlug={schoolSlug} teacherName={teacherName} />
    </Page>
  );
}
