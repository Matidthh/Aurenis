import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listAttendanceRecords, getAttendanceOverview } from "@/lib/services/attendance.service";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const [records, metrics] = await Promise.all([
    listAttendanceRecords(tenantDb, tenantCtx.schoolId),
    getAttendanceOverview(tenantDb, tenantCtx.schoolId),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Control de Asistencia"
        description="Monitoreo diario de asistencia escolar, justificaciones y tasas de cumplimiento."
        badge={
          <Badge variant="brand">
            <CalendarCheck className="w-3.5 h-3.5" />
            Tasa Global: {metrics.attendanceRate}%
          </Badge>
        }
      />

      {/* Métricas de Asistencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Presentes"
          value={metrics.presentCount}
          subtitle="Asistencia puntual"
          icon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Atrasos"
          value={metrics.lateCount}
          subtitle="Ingresos con retraso"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
        />
        <StatCard
          title="Ausencias Justificadas"
          value={metrics.justifiedCount}
          subtitle="Licencias o certificados"
          icon={<AlertTriangle className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          title="Ausencias Injustificadas"
          value={metrics.unjustifiedCount}
          subtitle="Faltas sin justificar"
          icon={<XCircle className="w-4 h-4 text-red-600" />}
        />
      </div>

      {/* Registros de Asistencia */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Registros Recientes
          </h3>
          <span className="text-xs text-slate-400">
            {records.length} eventos procesados
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estudiante</th>
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Justificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((rec) => {
              const studentUser = rec.student.membership.user;

              const statusBadgeMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
                PRESENT: { label: "Presente", variant: "success" },
                LATE: { label: "Atraso", variant: "warning" },
                ABSENT_JUSTIFIED: { label: "Justificado", variant: "neutral" },
                ABSENT_UNJUSTIFIED: { label: "Injustificado", variant: "danger" },
              };

              const badgeInfo = statusBadgeMap[rec.status] || { label: rec.status, variant: "neutral" };

              return (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {new Date(rec.date).toLocaleDateString("es-CL")}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {studentUser.lastName}, {studentUser.firstName}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    {rec.course.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {rec.justification || "—"}
                  </td>
                </tr>
              );
            })}

            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No hay registros de asistencia para mostrar en la fecha seleccionada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
