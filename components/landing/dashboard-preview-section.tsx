"use client";

import React, { useState } from "react";
import { LayoutDashboard, Users, BookOpen, FileText, BarChart2, ShieldCheck, Check, Sparkles, TrendingUp, Bell } from "lucide-react";
import Link from "next/link";

export function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<"director" | "docente" | "estudiante">("director");

  return (
    <section className="py-24 bg-[#F8F8F5] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            Vista Previa Interactiva
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explora el Dashboard de AURENIS
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Una interfaz diseñada con precisión quirúrgica, rápida y adaptada a cada rol dentro de la comunidad escolar.
          </p>

          {/* Role switcher tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setActiveTab("director")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                activeTab === "director"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Portal Directivo
            </button>
            <button
              onClick={() => setActiveTab("docente")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                activeTab === "docente"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Portal Docente
            </button>
            <button
              onClick={() => setActiveTab("estudiante")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs ${
                activeTab === "estudiante"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Portal Estudiante
            </button>
          </div>
        </div>

        {/* Dashboard Frame Container */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-2 sm:p-4 max-w-6xl mx-auto">
          
          <div className="rounded-2xl bg-[#0c1527] border border-slate-800 overflow-hidden">
            
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 font-mono ml-4">
                  aurenis.cl/{activeTab === "director" ? "colegio-san-jose/dashboard" : activeTab === "docente" ? "profesor/libro-clases" : "estudiante/calificaciones"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sesión Segura Activa ({activeTab.toUpperCase()})
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 sm:p-8 space-y-6 text-white">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeTab === "director" && "Panel de Dirección & Sostenedor"}
                    {activeTab === "docente" && "Libro de Clases & Planilla de Notas"}
                    {activeTab === "estudiante" && "Portal Académico Personal"}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {activeTab === "director" && "Consolidado de matrículas, asistencia y rendimiento general de la institución."}
                    {activeTab === "docente" && "Registro oficial de leccionario, asistencia horaria y calificaciones semestrales."}
                    {activeTab === "estudiante" && "Consulta de calificaciones, asistencia acumulada y comunicaciones de asignatura."}
                  </p>
                </div>

                <Link
                  href="/colegio-san-jose/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-500/20 w-fit"
                >
                  <span>Abrir App Completa</span>
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Estudiantes Matriculados</span>
                  <div className="text-2xl font-black text-white">1,248</div>
                  <span className="text-[11px] text-emerald-400 font-bold">↑ 4.2% este mes</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Asistencia Promedio</span>
                  <div className="text-2xl font-black text-blue-400">96.4%</div>
                  <span className="text-[11px] text-emerald-400 font-bold">↑ 1.1% vs ayer</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Docentes Activos</span>
                  <div className="text-2xl font-black text-white">74</div>
                  <span className="text-[11px] text-slate-400">100% al día en actas</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Promedio Institucional</span>
                  <div className="text-2xl font-black text-emerald-400">6.3</div>
                  <span className="text-[11px] text-emerald-400 font-bold">Escala chilena (1.0 - 7.0)</span>
                </div>
              </div>

              {/* Bottom Interactive Simulated Data Table */}
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Cursos y Estado de Calificaciones</span>
                  <span className="text-xs text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">Actualizado en tiempo real</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-3 font-semibold">Curso / Nivel</th>
                        <th className="pb-3 font-semibold">Profesor Jefe</th>
                        <th className="pb-3 font-semibold">Alumnos</th>
                        <th className="pb-3 font-semibold">Asistencia</th>
                        <th className="pb-3 font-semibold text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="py-3 font-bold text-white">1° Medio A</td>
                        <td className="py-3">Carlos Mendoza</td>
                        <td className="py-3">38</td>
                        <td className="py-3 text-emerald-400">97.2%</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">Al día</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-white">2° Medio B</td>
                        <td className="py-3">Ana María Silva</td>
                        <td className="py-3">35</td>
                        <td className="py-3 text-emerald-400">95.8%</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">Al día</span></td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-white">4° Medio A</td>
                        <td className="py-3">Roberto Soto</td>
                        <td className="py-3">42</td>
                        <td className="py-3 text-amber-400">91.4%</td>
                        <td className="py-3 text-right"><span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">Pendiente acta</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
