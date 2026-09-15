"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Calendar,
  Award,
  BookOpen,
  MessageSquare,
  Clock,
  ShieldAlert,
  Send,
} from "lucide-react";

interface StudentRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    course: string;
    avgGrade: number;
    attendance: number;
    riskFactor: string;
    priority: "high" | "medium" | "low";
  } | null;
}

export function StudentRiskModal({ isOpen, onClose, student }: StudentRiskModalProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "grades" | "attendance" | "actions">("summary");
  const [citationSent, setCitationSent] = useState(false);
  const [citationNote, setCitationNote] = useState("");

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm">
              {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{student.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    student.priority === "high"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200"
                  }`}
                >
                  {student.priority === "high" ? "Riesgo Crítico" : "Seguimiento Preventivo"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{student.course} • RUT: 23.491.028-4</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mini Pestañas */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-white dark:bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("summary")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "summary"
                ? "border-brand-600 text-brand-600 dark:text-brand-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Diagnóstico
          </button>
          <button
            onClick={() => setActiveTab("grades")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "grades"
                ? "border-brand-600 text-brand-600 dark:text-brand-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Detalle Calificaciones
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === "actions"
                ? "border-brand-600 text-brand-600 dark:text-brand-400 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Gestión & Citación Apoderado
          </button>
        </div>

        {/* Contenido Modal */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {activeTab === "summary" && (
            <div className="space-y-4">
              {/* Resumen KPIs del Alumno */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Promedio Actual</span>
                  <span className={`text-xl font-black ${student.avgGrade < 4.0 ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
                    {student.avgGrade}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Asistencia</span>
                  <span className={`text-xl font-black ${student.attendance < 85 ? "text-rose-600" : "text-amber-600"}`}>
                    {student.attendance}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Ramos Rojos</span>
                  <span className="text-xl font-black text-rose-600">2 Asignaturas</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Anotaciones</span>
                  <span className="text-xl font-black text-amber-600">1 Negativa</span>
                </div>
              </div>

              {/* Factor de Alerta */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-1.5 text-rose-900 dark:text-rose-200">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Motivo Principal de Alerta Temprana</span>
                </div>
                <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                  {student.riskFactor}. El alumno ha faltado reiteradamente en los días de evaluaciones parciales y no ha regularizado justificativos médicos.
                </p>
              </div>

              {/* Información de Apoderado */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Datos de Contacto Apoderado
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>María Silva (Madre)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+56 9 8765 4321</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 sm:col-span-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>maria.silva@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "grades" && (
            <div className="space-y-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                    <th className="py-2 px-2">Asignatura</th>
                    <th className="py-2 px-2 text-center">N1</th>
                    <th className="py-2 px-2 text-center">N2</th>
                    <th className="py-2 px-2 text-center">N3</th>
                    <th className="py-2 px-2 text-center">Promedio</th>
                    <th className="py-2 px-2 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-2.5 px-2 font-semibold">Matemática</td>
                    <td className="py-2.5 px-2 text-center text-rose-600 font-bold">2.8</td>
                    <td className="py-2.5 px-2 text-center text-rose-600 font-bold">3.5</td>
                    <td className="py-2.5 px-2 text-center text-slate-400">-</td>
                    <td className="py-2.5 px-2 text-center font-black text-rose-600">3.2</td>
                    <td className="py-2.5 px-2 text-right text-rose-600 font-bold">Riesgo</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-semibold">Lenguaje y Comunicación</td>
                    <td className="py-2.5 px-2 text-center">4.5</td>
                    <td className="py-2.5 px-2 text-center">5.0</td>
                    <td className="py-2.5 px-2 text-center">4.8</td>
                    <td className="py-2.5 px-2 text-center font-bold">4.8</td>
                    <td className="py-2.5 px-2 text-right text-emerald-600 font-semibold">Aprobado</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-semibold">Ciencias Naturales</td>
                    <td className="py-2.5 px-2 text-center text-rose-600 font-bold">3.8</td>
                    <td className="py-2.5 px-2 text-center">4.2</td>
                    <td className="py-2.5 px-2 text-center text-slate-400">-</td>
                    <td className="py-2.5 px-2 text-center font-black text-rose-600">4.0</td>
                    <td className="py-2.5 px-2 text-right text-amber-600 font-semibold">Límite</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 font-semibold">Historia y Geografía</td>
                    <td className="py-2.5 px-2 text-center">5.2</td>
                    <td className="py-2.5 px-2 text-center">5.6</td>
                    <td className="py-2.5 px-2 text-center">5.0</td>
                    <td className="py-2.5 px-2 text-center font-bold">5.3</td>
                    <td className="py-2.5 px-2 text-right text-emerald-600 font-semibold">Aprobado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-4">
              {citationSent ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Citación Notificada con Éxito
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Se envió la notificación por correo electrónico y SMS a la apoderada María Silva para el Jueves 17 de Septiembre a las 11:30 hrs.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">Generar Citación Formal</h4>
                  <textarea
                    rows={3}
                    value={citationNote}
                    onChange={(e) => setCitationNote(e.target.value)}
                    placeholder="Estimada apoderada: Le solicitamos asistir a entrevista presencial para coordinar plan de reforzamiento pedagógico..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setCitationSent(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Citación Oficial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
