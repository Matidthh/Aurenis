import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { NavItem, UserSessionInfo } from "@/components/layout/types";
import { Shield, ShieldCheck, Building2, PlusCircle, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.isSystemAdmin) {
    redirect("/login");
  }

  const navItems: NavItem[] = [
    {
      title: "Panel General",
      href: "/system/dashboard",
      icon: <Shield className="w-5 h-5 shrink-0" strokeWidth={2} />,
      section: "Supervisión Global",
      roles: ["SYSTEM_ADMIN"],
    },
    {
      title: "Seguridad y Auditoría",
      href: "/system/security",
      icon: <ShieldCheck className="w-5 h-5 shrink-0" strokeWidth={2} />,
      badge: "Audit Trail",
      badgeVariant: "brand",
      section: "Supervisión Global",
      roles: ["SYSTEM_ADMIN"],
    },
    {
      title: "Colegios e Instituciones",
      href: "/system/schools",
      icon: <Building2 className="w-5 h-5 shrink-0" strokeWidth={2} />,
      section: "Ecosistema Escolar",
      roles: ["SYSTEM_ADMIN"],
    },
    {
      title: "Nuevo Colegio",
      href: "/system/schools/new",
      icon: <PlusCircle className="w-5 h-5 shrink-0" strokeWidth={2} />,
      badge: "Onboarding",
      badgeVariant: "brand",
      section: "Ecosistema Escolar",
      roles: ["SYSTEM_ADMIN"],
    },
    {
      title: "Design System (Lucas)",
      href: "/system/design-system",
      icon: <Palette className="w-5 h-5 shrink-0" strokeWidth={2} />,
      badge: "Tokens & UI",
      badgeVariant: "success",
      section: "Ecosistema Escolar",
      roles: ["SYSTEM_ADMIN"],
    },
  ];

  const userInfo: UserSessionInfo = {
    userId: session.userId,
    email: session.email,
    firstName: session.firstName || "Super",
    lastName: session.lastName || "Admin",
    roleName: "SYSTEM_ADMIN",
    isSystemAdmin: true,
  };

  return (
    <AppShell
      navItems={navItems}
      user={userInfo}
      isSystemAdmin={true}
    >
      {children}
    </AppShell>
  );
}

