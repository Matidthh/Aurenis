import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Shield } from "lucide-react";
import { getVisibleSystemNav } from "@/lib/navigation/system-nav";
import { getRoleDisplayName } from "@/lib/constants/roles";
import { AppShell } from "@/components/layout/app-shell";

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.isSystemAdmin) {
    redirect("/login");
  }

  const navGroups = getVisibleSystemNav();
  const fullName =
    [session.firstName, session.lastName].filter(Boolean).join(" ") ||
    session.email ||
    "Administrador";

  return (
    <AppShell
      sidebar={{
        brand: {
          name: "Aurenis Core",
          subtitle: "Control Plane",
          icon: (
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
          ),
        },
        groups: navGroups,
        user: {
          name: fullName,
          email: session.email,
          roleName: "SYSTEM_ADMIN",
          roleDisplayName: getRoleDisplayName("SYSTEM_ADMIN"),
          showSwitchSchool: false,
        },
      }}
    >
      {children}
    </AppShell>
  );
}
