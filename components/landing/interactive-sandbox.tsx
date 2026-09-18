"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Smartphone,
  ArrowRight,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Calculator,
  HelpCircle,
} from "lucide-react";

interface InteractiveSandboxProps {
  onOpenQuoteModal: () => void;
}

export function InteractiveSandbox({ onOpenQuoteModal }: InteractiveSandboxProps) {
  const [activeTab, setActiveTab] = useState<"asistencia" | "notas" | "sat">("notas");

  // Estado para Asistencia
  const [studentsAttendance, setStudentsAttendance] = useState([
    { id: 1, name: "Alarcón, Matías", status: "P", time: "07:58" },
    { id: 2, name: "Barrientos, Sofia", status: "P", time: "08:02" },
    { id: 3, name: "Castillo, Lucas", status: "A", time: "08:19 (Atraso)" },
    { id: 4, name: "Díaz, Valentina", status: "P", time: "07:55" },
    { id: 5, name: "Espinoza, Joaquín", status: "U", time: "Inasistencia" },
  ]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Estado para Calificaciones (Notas libres con decimales continuos ej: 6.6, 6.5, 4.3)
  const [gradeMode, setGradeMode] = useState<"simple" | "ponderado">("simple");
  const [grades, setGrades] = useState([
    { id: 1, name: "Alarcón, Matías", n1: 6.6, n2: 6.5, n3: 7.0 },
    { id: 2, name: "Barrientos, Sofia", n1: 5.8, n2: 6.2, n3: 6.5 },
    { id: 3, name: "Castillo, Lucas", n1: 3.8, n2: 4.3, n3: 5.0 },
    { id: 4, name: "Díaz, Valentina", n1: 6.9, n2: 6.6, n3: 6.8 },
    { id: 5, name: "Espinoza, Joaquín", n1: 4.3, n2: 3.5, n3: 4.0 },
  ]);

  // Estado para SAT
  const [satActionExecuted, setSatActionExecuted] = useState(false);

  function toggleAttendance(id: number, newStatus: string) {
    const student = studentsAttendance.find((s) => s.id === id);
    setStudentsAttendance((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    if (newStatus === "A") {
      setLastNotification(`📱 Notificación enviada al apoderado de ${student?.name}: "Atraso registrado en primer bloque (08:15 hrs)".`);
    } else if (newStatus === "U") {
      setLastNotification(`🚨 Alerta automática enviada a la familia de ${student?.name}: "Inasistencia registrada".`);
    } else {
      setLastNotification(`✅ Asistencia confirmada para ${student?.name} en Libro Digital.`);
    }
  }

  // Modificación continua de notas (paso 0.1 o entrada directa de cualquier valor 1.0 a 7.0)
  function adjustGrade(id: number, key: "n1" | "n2" | "n3", delta: number) {
    setGrades((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const current = item[key];
        const next = Math.min(7.0, Math.max(1.0, Math.round((current + delta) * 10) / 10));
        return { ...item, [key]: next };
      })
    );
  }

  function handleDirectGradeChange(id: number, key: "n1" | "n2" | "n3", rawValue: string) {
    const normalized = rawValue.replace(",", ".");
    const num = parseFloat(normalized);
    if (!isNaN(num) && num >= 1.0 && num <= 7.0) {
      setGrades((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [key]: Math.round(num * 10) / 10 } : item))
      );
    }
  }

  const presentCount = studentsAttendance.filter((s) => s.status === "P" || s.status === "A").length;
  const attendanceRate = Math.round((presentCount / studentsAttendance.length) * 100);

  return (
    <section id="simulador" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header de la sección */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Experiencia Interactiva AURENIS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Prueba cómo funciona en tu día a día
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Interactúa en tiempo real con las funciones clave diseñadas según la normativa del Mineduc.
          </p>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveTab("notas")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "notas"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>1. Matriz de Notas (1.0 a 7.0)</span>
          </button>

          <button
            onClick={() => setActiveTab("asistencia")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "asistencia"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>2. Asistencia en 1 Clic (Circular 30)</span>
          </button>

          <button
            onClick={() => setActiveTab("sat")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
              activeTab === "sat"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>3. Alerta Temprana de Deserción (SAT)</span>
          </button>
        </div>

        {/* Tarjeta Contenedora Principal */}
        <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-200/90 relative">
          
          {/* Barra Superior con Contexto */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <div className="text-xs font-black text-slate-900">
                  {activeTab === "notas" && "Planilla de Calificaciones — Matemática 2° Medio"}
                  {activeTab === "asistencia" && "Libro de Clases Digital — 1° Medio A"}
                  {activeTab === "sat" && "Centro de Prevención y Convivencia Escolar"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {activeTab === "notas" && "Escala chilena de 1.0 a 7.0 con cálculo inmediato de promedios"}
                  {activeTab === "asistencia" && "Registro por bloque con notificación automática a apoderados"}
                  {activeTab === "sat" && "Detección temprana de inasistencia crítica y reprobación"}
                </div>
              </div>
            </div>

            {activeTab === "notas" && (
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setGradeMode("simple")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    gradeMode === "simple"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Promedio Simple (Todas igual)
                </button>
                <button
                  onClick={() => setGradeMode("ponderado")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    gradeMode === "ponderado"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Ponderado (30% / 30% / 40%)
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: CALIFICACIONES (NOTAS LIBRES 1.0 A 7.0 CON DECIMALES CONTINUOS) */}
          {activeTab === "notas" && (
            <div className="py-5 space-y-4 animate-in fade-in duration-200">
              <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <strong>Ingreso continuo:</strong> Puedes subir/bajar de 0.1 en 0.1 con (+) y (-) o ingresar notas como <strong>6.6</strong>, <strong>6.5</strong> o <strong>4.3</strong>.
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {gradeMode === "simple" ? "Modo: Todas las notas valen 33.3%" : "Modo: N1 (30%), N2 (30%), N3 (40%)"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/50">
                      <th className="py-2.5 px-3 font-bold">Estudiante</th>
                      <th className="py-2.5 px-3 text-center font-bold">
                        Nota 1 {gradeMode === "ponderado" && <span className="text-slate-600 font-normal">(30%)</span>}
                      </th>
                      <th className="py-2.5 px-3 text-center font-bold">
                        Nota 2 {gradeMode === "ponderado" && <span className="text-slate-600 font-normal">(30%)</span>}
                      </th>
                      <th className="py-2.5 px-3 text-center font-bold">
                        Nota 3 {gradeMode === "ponderado" && <span className="text-slate-600 font-normal">(40%)</span>}
                      </th>
                      <th className="py-2.5 px-3 text-center font-bold">Promedio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grades.map((item) => {
                      const avg =
                        gradeMode === "simple"
                          ? Math.round(((item.n1 + item.n2 + item.n3) / 3) * 10) / 10
                          : Math.round((item.n1 * 0.3 + item.n2 * 0.3 + item.n3 * 0.4) * 10) / 10;
                      const isRed = avg < 4.0;
                      const isHigh = avg >= 6.0;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {item.name}
                          </td>

                          {/* Nota 1 */}
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                              <button
                                onClick={() => adjustGrade(item.id, "n1", -0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Bajar 0.1"
                              >
                                -
                              </button>
                              <span className={`font-mono font-bold text-xs ${item.n1 < 4.0 ? "text-rose-600" : item.n1 >= 6.0 ? "text-blue-700" : "text-slate-800"}`}>
                                {item.n1.toFixed(1)}
                              </span>
                              <button
                                onClick={() => adjustGrade(item.id, "n1", 0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Subir 0.1"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Nota 2 */}
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                              <button
                                onClick={() => adjustGrade(item.id, "n2", -0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Bajar 0.1"
                              >
                                -
                              </button>
                              <span className={`font-mono font-bold text-xs ${item.n2 < 4.0 ? "text-rose-600" : item.n2 >= 6.0 ? "text-blue-700" : "text-slate-800"}`}>
                                {item.n2.toFixed(1)}
                              </span>
                              <button
                                onClick={() => adjustGrade(item.id, "n2", 0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Subir 0.1"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Nota 3 */}
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                              <button
                                onClick={() => adjustGrade(item.id, "n3", -0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Bajar 0.1"
                              >
                                -
                              </button>
                              <span className={`font-mono font-bold text-xs ${item.n3 < 4.0 ? "text-rose-600" : item.n3 >= 6.0 ? "text-blue-700" : "text-slate-800"}`}>
                                {item.n3.toFixed(1)}
                              </span>
                              <button
                                onClick={() => adjustGrade(item.id, "n3", 0.1)}
                                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 font-bold transition"
                                title="Subir 0.1"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Promedio */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-xl font-mono font-black text-xs ${
                                isRed
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : isHigh
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {avg.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                <span>✓ Conforme al <strong>Decreto 67/2018</strong> de Evaluación del Mineduc</span>
                <span className="text-blue-600 font-bold">Cálculo en vivo sin fórmulas de Excel</span>
              </div>
            </div>
          )}

          {/* TAB 2: ASISTENCIA EN 1 CLIC */}
          {activeTab === "asistencia" && (
            <div className="py-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm border border-blue-200">
                    {attendanceRate}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Asistencia del Bloque Actual</div>
                    <div className="text-[11px] text-slate-500">
                      {presentCount} de {studentsAttendance.length} alumnos en sala
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  💡 Haz clic en los botones para cambiar el estado al instante:
                </div>
              </div>

              {/* Lista de estudiantes */}
              <div className="space-y-2">
                {studentsAttendance.map((st) => (
                  <div
                    key={st.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                        {st.id}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{st.name}</div>
                        <div className="text-[11px] text-slate-500">{st.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleAttendance(st.id, "P")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          st.status === "P"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        Presente
                      </button>
                      <button
                        onClick={() => toggleAttendance(st.id, "A")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          st.status === "A"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        Atraso
                      </button>
                      <button
                        onClick={() => toggleAttendance(st.id, "U")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          st.status === "U"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        Ausente
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {lastNotification && (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
                  <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{lastNotification}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAT */}
          {activeTab === "sat" && (
            <div className="py-5 space-y-4 animate-in fade-in duration-200">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1 text-rose-900">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Detección Preventiva Automática: 2 Alumnos en Riesgo</span>
                </div>
                <p className="text-xs text-rose-700">
                  El motor SAT de AURENIS cruzó asistencias inferiores al 85% con bajas en las últimas evaluaciones.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Castillo, Lucas (2° Medio A)</div>
                    <div className="text-[11px] text-slate-500">Asistencia: 81.4% · 2 notas rojas consecutivas</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    Riesgo Alto
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Espinoza, Joaquín (2° Medio A)</div>
                    <div className="text-[11px] text-slate-500">Asistencia: 78.0% · 3 atrasos no justificados</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Riesgo Moderado
                  </span>
                </div>
              </div>

              <div className="pt-2">
                {satActionExecuted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1 animate-in zoom-in-95">
                    <div className="font-bold flex items-center gap-2 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Protocolo Preventivo Activado
                    </div>
                    <p className="text-emerald-700">
                      Citación formal generada para apoderados y notificación en bandeja de Convivencia Escolar / Dupla Psicosocial.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setSatActionExecuted(true)}
                    className="w-full py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Activar Protocolo Preventivo para Ambos Alumnos (1 Clic)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pie de la tarjeta */}
          <div className="mt-4 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 text-center sm:text-left">
              ¿Quieres probar AURENIS con los cursos y profesores reales de tu colegio?
            </div>
            <button
              onClick={onOpenQuoteModal}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Solicitar Demo Guiada</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
