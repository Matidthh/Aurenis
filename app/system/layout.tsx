import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AppShell } from "@/components/layout/app-shell";
import { NavItem, UserSessionInfo } from "@/components/layout/types";
import { Shield, Building2, PlusCircle, Palette } from "lucide-react";

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.isSystemAdmin) {
    redirect("/login");
  }

  const navItems: NavItem[] = [
    {
      title: "Panel General",
      href: "/system/dashboard",
      icon: <Shield className="w-5 h-5" />,
      section: "Supervisión Global",
    },
    {
      title: "Colegios e Instituciones",
      href: "/system/schools",
      icon: <Building2 className="w-5 h-5" />,
      section: "Ecosistema Escolar",
    },
    {
      title: "Nuevo Colegio",
      href: "/system/schools/new",
      icon: <PlusCircle className="w-5 h-5" />,
      badge: "Onboarding",
      badgeVariant: "brand",
      section: "Ecosistema Escolar",
    },
    {
      title: "Design System (Lucas)",
      href: "/system/design-system",
      icon: <Palette className="w-5 h-5" />,
      badge: "Tokens & UI",
      badgeVariant: "success",
      section: "Ecosistema Escolar",
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

