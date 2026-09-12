import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listTeachersBySchool } from "@/lib/services/teacher.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Mail, BookOpen } from "lucide-react";

export default async function TeachersPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const teachers = await listTeachersBySchool(tenantDb, tenantCtx.schoolId);

  return (
    <Page>
      <PageHeader
        title="Plantel Docente"
        description="Profesores de la institución, especialidades y asignación de cursos."
        badge={
          <Badge variant="brand">
            <GraduationCap className="w-3.5 h-3.5" />
            {teachers.length} Docentes Registrados
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((teacher) => {
          const user = teacher.membership.user;

          return (
            <div
              key={teacher.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500 transition"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg border border-brand-100 dark:border-brand-900">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <Badge variant="neutral">Docente</Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-brand-600 font-medium mt-0.5">
                  {teacher.specialty || "Especialidad no especificada"}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Asignaturas a Cargo ({teacher.subjects.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map((s: { id: string; name: string; course: { name: string } }) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {s.name} ({s.course.name})
                    </span>
                  ))}

                  {teacher.subjects.length === 0 && (
                    <span className="text-xs text-slate-400 italic">Sin asignaturas asignadas</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {teachers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se han registrado docentes en la institución todavía.
          </div>
        )}
      </div>
    </Page>
  );
}
