import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { getSchoolAcademicOverview, listCoursesByYear } from "@/lib/services/academic.service";
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

  const overview = await getSchoolAcademicOverview(tenantDb, tenantCtx.schoolId);
  const courses = await listCoursesByYear(tenantDb, tenantCtx.schoolId, overview.currentYear);
  const roleDisplayName = getRoleDisplayName(tenantCtx.roleName);

  return (
    <Page>
      <PageHeader
        title={tenantCtx.schoolName}
        description={`Sesión activa como ${roleDisplayName} • Aislamiento verificado`}
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
      >
        {overview.activePeriod ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Periodo Activo: {overview.activePeriod.name}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            Sin periodo académico activo
          </div>
        )}
      </PageHeader>

      {/* Métricas del Colegio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Cursos Activos</span>
            <BookOpen className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold">{overview.totalCourses}</p>
          <p className="text-xs text-slate-400">Año {overview.currentYear}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Asignaturas</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold">{overview.totalSubjects}</p>
          <p className="text-xs text-slate-400">Malla curricular institucional</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Estudiantes</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold">{overview.totalStudents}</p>
          <p className="text-xs text-slate-400">Matrículas activas</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Periodo</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-lg font-bold truncate">
            {overview.activePeriod?.name || "No configurado"}
          </p>
          <p className="text-xs text-slate-400">Régimen institucional</p>
        </div>
      </div>

      {/* Cursos del Año */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Cursos Registrados ({overview.currentYear})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-brand-500 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{course.name}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  {course.educationLevel.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {course.subjects.length} Asignaturas • {course._count.enrollments} Alumnos matriculados
              </p>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-slate-400">
              No se han registrado cursos para el año {overview.currentYear} todavía.
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
