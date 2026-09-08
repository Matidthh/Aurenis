import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Layers, Clock, GraduationCap } from "lucide-react";

export default async function SubjectsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const subjects = await tenantDb.subject.findMany({
    where: { schoolId: tenantCtx.schoolId },
    include: {
      course: { include: { educationLevel: true } },
      teacher: {
        include: {
          membership: {
            include: { user: true },
          },
        },
      },
      _count: {
        select: { assessments: true },
      },
    },
    orderBy: [
      { course: { gradeNumber: "asc" } },
      { course: { letter: "asc" } },
      { name: "asc" },
    ],
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Malla de Asignaturas"
        description="Plan de estudios, cargas horarias y docentes asignados por curso."
        badge={
          <Badge variant="brand">
            <Layers className="w-3.5 h-3.5" />
            {subjects.length} Asignaturas Registradas
          </Badge>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Asignatura</th>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Profesor Asignado</th>
              <th className="px-6 py-4">Carga Horaria</th>
              <th className="px-6 py-4 text-right">Evaluaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {subjects.map((subject) => {
              const teacherUser = subject.teacher?.membership.user;

              return (
                <tr key={subject.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {subject.code || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {subject.course.name}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      {subject.course.educationLevel.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {teacherUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-[10px]">
                          {teacherUser.firstName[0]}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {teacherUser.firstName} {teacherUser.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin profesor asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {subject.hoursPerWeek} hrs/sem
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-semibold text-brand-600">
                    {subject._count.assessments} pruebas
                  </td>
                </tr>
              );
            })}

            {subjects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No hay asignaturas registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
