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

  const role = tenantCtx.roleName;

  const canManageSettings =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.SCHOOL_SETTINGS_VIEW);

  const canManagePeople =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    hasPermission(tenantCtx, PERMISSIONS.PEOPLE_STUDENTS_MANAGE);

  const canViewCourses =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "TEACHER" ||
    hasPermission(tenantCtx, PERMISSIONS.ACADEMIC_COURSES_MANAGE);

  const canViewSubjects =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "TEACHER" ||
    role === "STUDENT" ||
    hasPermission(tenantCtx, PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE);

  const canViewGrades =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "TEACHER" ||
    role === "STUDENT" ||
    role === "GUARDIAN" ||
    hasPermission(tenantCtx, PERMISSIONS.GRADES_VIEW);

  const canViewAttendance =
    role === "SYSTEM_ADMIN" ||
    role === "SCHOOL_ADMIN" ||
    role === "TEACHER" ||
    role === "STUDENT" ||
    role === "GUARDIAN" ||
    hasPermission(tenantCtx, PERMISSIONS.ATTENDANCE_VIEW);

  // Armar lista de navegación modular para el colegio según rol
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: `/${tenantCtx.schoolSlug}/dashboard`,
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      section: "Principal",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
    },
  ];

  // Menú para Administración / Comunidad Escolar
  if (canManagePeople) {
    navItems.push(
      {
        title: "Estudiantes",
        href: `/${tenantCtx.schoolSlug}/students`,
        icon: <Users className="w-5 h-5 shrink-0" />,
        section: "Comunidad Escolar",
        roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
      },
      {
        title: "Profesores",
        href: `/${tenantCtx.schoolSlug}/teachers`,
        icon: <GraduationCap className="w-5 h-5 shrink-0" />,
        section: "Comunidad Escolar",
        roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
      }
    );
  }

  // Menú Académico: Cursos (Admin + Docente)
  if (canViewCourses) {
    navItems.push({
      title: role === "TEACHER" ? "Mis Cursos" : "Cursos",
      href: `/${tenantCtx.schoolSlug}/courses`,
      icon: <BookOpen className="w-5 h-5 shrink-0" />,
      section: "Académico",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER"],
    });
  }

  // Menú Académico: Asignaturas (Admin + Docente + Alumno)
  if (canViewSubjects) {
    navItems.push({
      title: role === "STUDENT" ? "Mis Asignaturas" : "Asignaturas",
      href: `/${tenantCtx.schoolSlug}/subjects`,
      icon: <Layers className="w-5 h-5 shrink-0" />,
      section: "Académico",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"],
    });
  }

  // Calificaciones (Admin + Docente + Alumno + Apoderado)
  if (canViewGrades) {
    navItems.push({
      title: role === "STUDENT" ? "Mis Calificaciones" : "Calificaciones",
      href: `/${tenantCtx.schoolSlug}/grades`,
      icon: <Award className="w-5 h-5 shrink-0" />,
      section: "Académico",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
    });
  }

  // Asistencia (Admin + Docente + Alumno + Apoderado)
  if (canViewAttendance) {
    navItems.push({
      title: role === "STUDENT" ? "Mi Asistencia" : "Asistencia",
      href: `/${tenantCtx.schoolSlug}/attendance`,
      icon: <CalendarCheck className="w-5 h-5 shrink-0" />,
      section: "Académico",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
    });
  }

  // Configuración institucional (Solo Administradores)
  if (canManageSettings) {
    navItems.push({
      title: "Configuración",
      href: `/${tenantCtx.schoolSlug}/settings`,
      icon: <Settings className="w-5 h-5 shrink-0" />,
      section: "Administración",
      roles: ["SYSTEM_ADMIN", "SCHOOL_ADMIN"],
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

