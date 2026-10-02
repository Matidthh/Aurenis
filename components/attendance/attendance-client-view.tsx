"use client";

import React, { useState } from "react";
import { TeacherAttendancePanel } from "./teacher-attendance-panel";
import { StudentQRScanner } from "./student-qr-scanner";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  QrCode,
  UserCheck,
  BarChart3,
} from "lucide-react";

interface AttendanceClientViewProps {
  schoolSlug: string;
  courses: Array<{ id: string; name: string }>;
  records: any[];
  metrics: {
    totalRecords: number;
    presentCount: number;
    justifiedCount: number;
    unjustifiedCount: number;
    lateCount: number;
    attendanceRate: number;
  };
}

export function AttendanceClientView({
  schoolSlug,
  courses,
  records,
  metrics,
}: AttendanceClientViewProps) {
  const [activeTab, setActiveTab] = useState<"TEACHER" | "STUDENT_QR" | "METRICS">("TEACHER");

  return (
    <div className="space-y-6">
      {/* Selector de Modos / Pestañas principales */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("TEACHER")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "TEACHER"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pase de Lista Docente (QR + Manual)</span>
          </button>

          <button
            onClick={() => setActiveTab("STUDENT_QR")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "STUDENT_QR"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR (Estudiante)</span>
          </button>

          <button
            onClick={() => setActiveTab("METRICS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "METRICS"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reportes & Métricas</span>
          </button>
        </div>

        <Badge variant="brand" className="hidden sm:inline-flex mr-2">
          <CalendarCheck className="w-3.5 h-3.5" />
          Tasa Global: {metrics.attendanceRate}%
        </Badge>
      </div>

      {/* Contenido según la pestaña seleccionada */}
      {activeTab === "TEACHER" && (
        <TeacherAttendancePanel
          schoolSlug={schoolSlug}
          courses={courses}
          defaultCourseId={courses[0]?.id}
        />
      )}

      {activeTab === "STUDENT_QR" && (
        <StudentQRScanner schoolSlug={schoolSlug} />
      )}

      {activeTab === "METRICS" && (
        <div className="space-y-6">
          {/* Métricas de Asistencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Presentes"
              value={metrics.presentCount}
              subtitle="Asistencia puntual registrada"
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

          {/* Registros Recientes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Historial de Registros Recientes
              </h3>
              <span className="text-xs text-slate-400">
                {records.length} eventos procesados
              </span>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Estudiante</th>
                  <th className="px-6 py-4">Curso</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Justificación / Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {records.map((rec: any) => {
                  const studentUser = rec.student?.membership?.user || {
                    firstName: "Estudiante",
                    lastName: "LPMM",
                  };

                  const statusBadgeMap: Record<
                    string,
                    { label: string; variant: "success" | "warning" | "danger" | "neutral" }
                  > = {
                    PRESENT: { label: "Presente", variant: "success" },
                    LATE: { label: "Atraso", variant: "warning" },
                    ABSENT_JUSTIFIED: { label: "Justificado", variant: "neutral" },
                    ABSENT_UNJUSTIFIED: { label: "Injustificado", variant: "danger" },
                  };

                  const badgeInfo = statusBadgeMap[rec.status] || {
                    label: rec.status,
                    variant: "neutral",
                  };

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                    >
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {new Date(rec.date).toLocaleDateString("es-CL")}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {studentUser.lastName}, {studentUser.firstName}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {rec.course?.name || "1° Básico A"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {rec.justification || rec.method || "Sincronizado"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
