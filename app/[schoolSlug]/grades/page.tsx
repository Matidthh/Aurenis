import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listAssessmentsWithGrades, getSchoolGradingConfig } from "@/lib/services/grade.service";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, BookOpen, Percent } from "lucide-react";

export default async function GradesPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const [assessments, gradeConfig] = await Promise.all([
    listAssessmentsWithGrades(tenantDb, tenantCtx.schoolId),
    getSchoolGradingConfig(tenantDb, tenantCtx.schoolId),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Libro de Calificaciones & Evaluaciones"
        description={`Registro oficial de evaluaciones. Escala configurada: ${gradeConfig.minGrade.toFixed(1)} a ${gradeConfig.maxGrade.toFixed(1)} (Aprobación: ${gradeConfig.minPassingGrade.toFixed(1)}).`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: `/${schoolSlug}/dashboard` },
              { label: "Calificaciones" },
            ]}
          />
        }
        badge={
          <Badge variant="brand">
            <Award className="w-3.5 h-3.5" />
            Escala {gradeConfig.minGrade.toFixed(1)} - {gradeConfig.maxGrade.toFixed(1)}
          </Badge>
        }
      />

      {/* Lista de Evaluaciones Registradas */}
      <div className="space-y-4">
        {assessments.map((assessment) => {
          const totalGrades = assessment.grades.length;
          const avgGrade =
            totalGrades > 0
              ? assessment.grades.reduce((sum, g) => sum + Number(g.value), 0) / totalGrades
              : 0;

          return (
            <div
              key={assessment.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {assessment.subject.course.name} • {assessment.subject.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {assessment.academicPeriod.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {assessment.title}
                  </h3>
                  {assessment.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{assessment.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Promedio del Curso
                    </div>
                    <div
                      className={`text-xl font-extrabold ${
                        avgGrade >= gradeConfig.minPassingGrade ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {totalGrades > 0 ? avgGrade.toFixed(gradeConfig.precision) : "S/N"}
                    </div>
                  </div>
                  <Badge variant={assessment.isPublished ? "success" : "neutral"}>
                    {assessment.isPublished ? "Publicada" : "Borrador"}
                  </Badge>
                </div>
              </div>

              {/* Muestra de Notas de Alumnos */}
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Calificaciones Ingresadas ({totalGrades})
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {assessment.grades.map((grade) => {
                  const studentUser = grade.enrollment.student.membership.user;
                  const val = Number(grade.value);
                  const isPassing = val >= gradeConfig.minPassingGrade;

                  return (
                    <div
                      key={grade.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate mr-2" title={`${studentUser.lastName}, ${studentUser.firstName}`}>
                        {studentUser.lastName}
                      </span>
                      <span
                        className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                          isPassing
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                        }`}
                      >
                        {val.toFixed(gradeConfig.precision)}
                      </span>
                    </div>
                  );
                })}

                {totalGrades === 0 && (
                  <div className="col-span-full text-xs text-slate-400 italic py-2">
                    Aún no se han registrado calificaciones para esta evaluación.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {assessments.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No se han registrado evaluaciones ni actas de notas para el colegio todavía.
          </div>
        )}
      </div>
    </div>
  );
}
