import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listStudentsBySchool } from "@/lib/services/student.service";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus } from "lucide-react";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const enrollments = await listStudentsBySchool({
    page: 1,
    limit: 50,
    schoolId: tenantCtx.schoolId,
  }, tenantCtx.schoolId);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Directorio de Estudiantes"
        description="Gestión de alumnos, matrículas activas y datos de apoderados."
        badge={
          <Badge variant="brand">
            <Users className="w-3.5 h-3.5" />
            {enrollments.students.length} Estudiantes Matriculados
          </Badge>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Estudiante</th>
              <th className="px-6 py-4">Identificación (RUN)</th>
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Apoderado / Tutor</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {enrollments.students.map((enrollment) => {
              const studentUser = enrollment.student.membership.user;
              const guardianContact = enrollment.student.guardians?.[0]?.guardian?.membership?.user;

              return (
                <tr key={enrollment.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {studentUser.lastName}, {studentUser.firstName}
                    </div>
                    <div className="text-xs text-slate-400">{studentUser.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                    {studentUser.rutOrNationalId || enrollment.student.enrollmentNumber || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {enrollment.course.name}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      {enrollment.course.educationLevel.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                    {guardianContact ? (
                      <div>
                        <div className="font-medium">{guardianContact.firstName} {guardianContact.lastName}</div>
                        <div className="text-[11px] text-slate-400">{guardianContact.phone || guardianContact.email}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400">No asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={enrollment.status === "ACTIVE" ? "success" : "neutral"}>
                      {enrollment.status === "ACTIVE" ? "Activo" : enrollment.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}

            {enrollments.students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Aún no hay estudiantes matriculados en este periodo escolar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
