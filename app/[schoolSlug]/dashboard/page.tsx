import Link from "next/link";
import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import {
  getSchoolAcademicOverview,
  listCoursesByYear,
  getRecentActivities,
  getSchoolAnnouncements,
} from "@/lib/services/academic.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getRoleDisplayName } from "@/lib/constants/roles";
import {
  BookOpen,
  Users,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Award,
  CalendarCheck,
  Settings,
  ArrowRight,
  Bell,
  Activity,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  // Instancia Prisma Scoped con aislamiento de datos automático
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const [overview, courses, activities, announcements] = await Promise.all([
    getSchoolAcademicOverview(tenantDb, tenantCtx.schoolId),
    listCoursesByYear(tenantDb, tenantCtx.schoolId, new Date().getFullYear()),
    getRecentActivities(tenantDb, tenantCtx.schoolId),
    Promise.resolve(getSchoolAnnouncements()),
  ]);

  const roleDisplayName = getRoleDisplayName(tenantCtx.roleName);
  const isStudent = tenantCtx.roleName === "STUDENT";
  const isTeacher = tenantCtx.roleName === "TEACHER";
  const isGuardian = tenantCtx.roleName === "GUARDIAN";

  const allShortcuts = [
    {
      id: "shortcut-grades",
      title: isStudent ? "Mis Calificaciones" : isGuardian ? "Calificaciones del Pupilo" : "Registro de Calificaciones",
      description: isStudent
        ? "Boletín de calificaciones, promedios y actas de evaluación"
        : isGuardian
        ? "Seguimiento de rendimiento académico y ponderaciones"
        : "Ingreso de evaluaciones, ponderaciones y actas oficiales",
      href: `/${schoolSlug}/grades`,
      icon: Award,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
    },
    {
      id: "shortcut-attendance",
      title: isStudent ? "Mi Asistencia" : isGuardian ? "Asistencia del Alumno" : "Control de Asistencia",
      description: isStudent || isGuardian
        ? "Porcentaje de asistencia acumulada, atrasos y justificaciones"
        : "Libro de clases diario, atrasos y justificaciones",
      href: `/${schoolSlug}/attendance`,
      icon: CalendarCheck,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN", "TEACHER", "STUDENT", "GUARDIAN"],
    },
    {
      id: "shortcut-subjects",
      title: isStudent ? "Mis Asignaturas" : "Malla & Asignaturas",
      description: isStudent
        ? "Docentes a cargo, planificaciones y horario de clases"
        : "Planes de estudio, docentes a cargo y horas semanales",
      href: `/${schoolSlug}/subjects`,
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN", "TEACHER", "STUDENT"],
    },
    {
      id: "shortcut-courses",
      title: isTeacher ? "Mis Cursos & Jefaturas" : "Gestión de Cursos",
      description: isTeacher
        ? "Niveles asignados, lista de estudiantes y sala de clases"
        : "Niveles educativos, cursos lectivos y asignación de salas",
      href: `/${schoolSlug}/courses`,
      icon: BookOpen,
      color: "text-brand-600 bg-brand-50 dark:bg-brand-950/40 dark:text-brand-400 border-brand-200 dark:border-brand-800",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN", "TEACHER"],
    },
    {
      id: "shortcut-students",
      title: "Matrículas & Estudiantes",
      description: "Fichas de alumnos, apoderados y documentación escolar",
      href: `/${schoolSlug}/students`,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN"],
    },
    {
      id: "shortcut-settings",
      title: "Configuración Escolar",
      description: "Escala de notas, periodos académicos y régimen institucional",
      href: `/${schoolSlug}/settings`,
      icon: Settings,
      color: "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
      roles: ["SCHOOL_ADMIN", "SYSTEM_ADMIN"],
    },
  ];

  const quickShortcuts = allShortcuts.filter((s) => s.roles.includes(tenantCtx.roleName));

  return (
    <Page>
      <PageHeader
        title={tenantCtx.schoolName}
        description={`Sesión activa como ${roleDisplayName} • Aislamiento de datos verificado`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Dashboard" },
            ]}
          />
        }
        badge={
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
            <Sparkles className="w-3.5 h-3.5" />
            Año Lectivo {overview.currentYear}
          </div>
        }
        action={
          overview.activePeriod ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Periodo Activo: {overview.activePeriod.name}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4" />
              Sin periodo académico activo
            </div>
          )
        }
      />

      <div className="space-y-8 max-w-7xl">
        {/* 1. Tarjetas de Resumen con Indicadores Cuantitativos */}
        <div id="academic-metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Cursos Activos</span>
              <BookOpen className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{overview.totalCourses}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Año lectivo {overview.currentYear}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Asignaturas</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{overview.totalSubjects}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Malla curricular activa</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Estudiantes</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{overview.totalStudents}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Matrículas regulares</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-500/50 transition">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Evaluaciones</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{overview.totalAssessments}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instancias registradas</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 hover:border-brand-500/50 transition sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Periodo</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white truncate">
              {overview.activePeriod?.name || "No configurado"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Estado regular</p>
          </div>
        </div>

        {/* 2. Accesos Directos (Quick Shortcuts Grid) */}
        <div id="quick-shortcuts-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Accesos Directos</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Módulos de acceso rápido</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link
                  key={shortcut.id}
                  id={shortcut.id}
                  href={shortcut.href}
                  className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm flex items-start gap-3.5 hover:shadow-md"
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${shortcut.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                        {shortcut.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {shortcut.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. Layout adaptable de Dos Columnas: Novedades / Avisos + Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Panel de Novedades y Avisos Institucionales (7 columnas) */}
          <div id="announcements-panel" className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Panel de Novedades & Circulares
                </h2>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                {announcements.length} Avisos
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  id={ann.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        ann.category === "Urgente"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                          : ann.category === "Académico"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ann.date}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
                  <p className="text-xs text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    Publicado por: <span className="font-medium text-slate-600 dark:text-slate-300">{ann.author}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Feed de Actividad Reciente del Sistema (5 columnas) */}
          <div id="recent-activity-panel" className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Actividad Reciente
                </h2>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Auditoría en vivo
              </span>
            </div>

            <div className="space-y-3.5">
              {activities.map((act) => (
                <div key={act.id} id={act.id} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    {act.type === "academic" && <Award className="w-3.5 h-3.5 text-amber-500" />}
                    {act.type === "attendance" && <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    {act.type === "security" && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                    {act.type === "system" && <FileText className="w-3.5 h-3.5 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                      <span>{act.user}</span>
                      <span>•</span>
                      <span>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Resumen de Cursos Registrados del Año Lectivo */}
        <div id="courses-summary-section" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cursos Registrados ({overview.currentYear})
              </h2>
              <p className="text-xs text-slate-500">Distribución de matrículas y asignaturas por nivel</p>
            </div>
            <Link
              href={`/${schoolSlug}/courses`}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Ver todos los cursos
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-brand-500 transition space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{course.name}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                    {course.educationLevel.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <span>{course.subjects.length} Asignaturas</span>
                  <span>{course._count.enrollments} Alumnos</span>
                </div>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-slate-400">
                No se han registrado cursos para el año {overview.currentYear} todavía.
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

