import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listCoursesByYear } from "@/lib/services/academic.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { CreateCourseModal } from "@/components/features/academic/create-course-modal";
import { BookOpen, Users, Layers } from "lucide-react";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const currentYear = new Date().getFullYear();
  const [courses, educationLevels] = await Promise.all([
    listCoursesByYear(tenantDb, tenantCtx.schoolId, currentYear),
    tenantDb.educationLevel.findMany({
      where: { schoolId: tenantCtx.schoolId },
      orderBy: { orderIndex: "asc" },
    }),
  ]);

  return (
    <Page>
      <PageHeader
        title="Catálogo de Cursos"
        description={`Estructura de niveles y divisiones de cursos para el año escolar ${currentYear}.`}
        badge={
          <Badge variant="brand">
            <BookOpen className="w-3.5 h-3.5" />
            {courses.length} Cursos Habilitados
          </Badge>
        }
        action={
          <CreateCourseModal
            schoolSlug={schoolSlug}
            educationLevels={educationLevels}
            currentYear={currentYear}
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.name}</h3>
              <Badge variant="neutral">{course.educationLevel.name}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Alumnos
                </div>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  {course._count.enrollments}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Asignaturas
                </div>
                <div className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  {course.subjects.length}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1.5">
                Malla de Asignaturas
              </div>
              <p className="text-xs text-slate-500 truncate">
                {course.subjects.map((s: { name: string }) => s.name).join(", ") || "Sin asignaturas inscritas"}
              </p>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se han configurado cursos para el año {currentYear}.
          </div>
        )}
      </div>
    </Page>
  );
}
