import { requireTenantContext } from "@/lib/tenant/context";
import Link from "next/link";
import {
  School,
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  Award,
  Settings,
  ArrowLeftRight,
  LogOut,
  Layers,
} from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/lib/constants/permissions";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

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

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Institucional Scoped */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        {/* Cabecera con Nombre del Colegio */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20">
              <School className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm tracking-tight truncate" title={tenantCtx.schoolName}>
                {tenantCtx.schoolName}
              </h2>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {tenantCtx.roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Navegación Modular por Rutas Institucionales */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <Link
            href={`/${tenantCtx.schoolSlug}/dashboard`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            Dashboard
          </Link>

          {canManagePeople && (
            <Link
              href={`/${tenantCtx.schoolSlug}/students`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Users className="w-4 h-4 text-slate-500" />
              Estudiantes
            </Link>
          )}

          {canManagePeople && (
            <Link
              href={`/${tenantCtx.schoolSlug}/teachers`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              Profesores
            </Link>
          )}

          {canManageAcademic && (
            <Link
              href={`/${tenantCtx.schoolSlug}/courses`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              Cursos
            </Link>
          )}

          {canManageAcademic && (
            <Link
              href={`/${tenantCtx.schoolSlug}/subjects`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              Asignaturas
            </Link>
          )}

          {canViewGrades && (
            <Link
              href={`/${tenantCtx.schoolSlug}/grades`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Award className="w-4 h-4 text-slate-500" />
              Calificaciones
            </Link>
          )}

          {canViewAttendance && (
            <Link
              href={`/${tenantCtx.schoolSlug}/attendance`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <CalendarCheck className="w-4 h-4 text-slate-500" />
              Asistencia
            </Link>
          )}

          {canManageSettings && (
            <Link
              href={`/${tenantCtx.schoolSlug}/settings`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Configuración
            </Link>
          )}
        </nav>

        {/* Footer del Sidebar con Switcher y Salida */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link
            href="/select-school"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Cambiar de Colegio
          </Link>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </a>
        </div>
      </aside>

      {/* Contenido Principal Institucional */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
