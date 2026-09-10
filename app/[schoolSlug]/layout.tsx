import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { AppShell } from "@/components/layout/app-shell";
import { NavItem, UserSessionInfo, SchoolContextInfo } from "@/components/layout/types";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  Settings,
  Layers,
} from "lucide-react";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const [tenantCtx, session] = await Promise.all([
    requireTenantContext(schoolSlug),
    getSession(),
  ]);

  const canManageSettings =
    tenantCtx.roleName === "SYSTEM_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.SCHOOL_SETTINGS_VIEW);

  const canManageAcademic =
    tenantCtx.roleName === "SYSTEM_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.ACADEMIC_COURSES_MANAGE);

  const canManagePeople =
    tenantCtx.roleName === "SYSTEM_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.PEOPLE_STUDENTS_MANAGE);

  const canViewGrades =
    tenantCtx.roleName === "SYSTEM_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.GRADES_VIEW);

  const canViewAttendance =
    tenantCtx.roleName === "SYSTEM_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.ATTENDANCE_VIEW);

  // Armar lista de navegación modular para el colegio
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `/${tenantCtx.schoolSlug}/dashboard`,
      icon: <LayoutDashboard className="w-5 h-5" />,
      section: "Principal",
    },
  ];

  if (canManagePeople) {
    navItems.push(
      {
        title: "Estudiantes",
        href: `/${tenantCtx.schoolSlug}/students`,
        icon: <Users className="w-5 h-5" />,
        section: "Comunidad Escolar",
      },
      {
        title: "Profesores",
        href: `/${tenantCtx.schoolSlug}/teachers`,
        icon: <GraduationCap className="w-5 h-5" />,
        section: "Comunidad Escolar",
      }
    );
  }

  if (canManageAcademic) {
    navItems.push(
      {
        title: "Cursos",
        href: `/${tenantCtx.schoolSlug}/courses`,
        icon: <BookOpen className="w-5 h-5" />,
        section: "Académico",
      },
      {
        title: "Asignaturas",
        href: `/${tenantCtx.schoolSlug}/subjects`,
        icon: <Layers className="w-5 h-5" />,
        section: "Académico",
      }
    );
  }

  if (canViewGrades) {
    navItems.push({
      title: "Calificaciones",
      href: `/${tenantCtx.schoolSlug}/grades`,
      icon: <Award className="w-5 h-5" />,
      section: "Académico",
    });
  }

  if (canViewAttendance) {
    navItems.push({
      title: "Asistencia",
      href: `/${tenantCtx.schoolSlug}/attendance`,
      icon: <CalendarCheck className="w-5 h-5" />,
      section: "Académico",
    });
  }

  if (canManageSettings) {
    navItems.push({
      title: "Configuración",
      href: `/${tenantCtx.schoolSlug}/settings`,
      icon: <Settings className="w-5 h-5" />,
      section: "Administración",
    });
  }

  const userInfo: UserSessionInfo = {
    userId: session?.userId || tenantCtx.userId,
    email: session?.email || "usuario@colegio.cl",
    firstName: session?.firstName || "Usuario",
    lastName: session?.lastName || "",
    roleName: tenantCtx.roleName,
    isSystemAdmin: !!session?.isSystemAdmin,
  };

  const schoolContext: SchoolContextInfo = {
    schoolId: tenantCtx.schoolId,
    schoolSlug: tenantCtx.schoolSlug,
    schoolName: tenantCtx.schoolName,
    roleName: tenantCtx.roleName,
  };

  return (
    <AppShell
      navItems={navItems}
      user={userInfo}
      schoolContext={schoolContext}
      isSystemAdmin={session?.isSystemAdmin}
    >
      {children}
    </AppShell>
  );
}

