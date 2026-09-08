import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { School } from "lucide-react";
import { getVisibleSchoolNav } from "@/lib/navigation/school-nav";
import { getRoleDisplayName } from "@/lib/constants/roles";
import { AppShell } from "@/components/layout/app-shell";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const session = await getSession();

  const navGroups = getVisibleSchoolNav(schoolSlug, {
    roleName: tenantCtx.roleName,
    permissions: tenantCtx.permissions,
  });

  const roleDisplayName = getRoleDisplayName(tenantCtx.roleName);
  const fullName =
    [session?.firstName, session?.lastName].filter(Boolean).join(" ") ||
    session?.email ||
    "Usuario";

  return (
    <AppShell
      sidebar={{
        brand: {
          name: tenantCtx.schoolName,
          subtitle: roleDisplayName,
          icon: (
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <School className="w-5 h-5" />
            </div>
          ),
        },
        groups: navGroups,
        user: {
          name: fullName,
          email: session?.email || "",
          roleName: tenantCtx.roleName,
          roleDisplayName,
          schoolName: tenantCtx.schoolName,
          showSwitchSchool: true,
        },
      }}
    >
      {children}
    </AppShell>
  );
}
