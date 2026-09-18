"use client";

import React, { useState } from "react";
import { Calculator, Clock, DollarSign, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, FileText } from "lucide-react";

interface RoiCalculatorProps {
  onOpenQuoteModal: (details?: string) => void;
}

export function RoiCalculator({ onOpenQuoteModal }: RoiCalculatorProps) {
  const [students, setStudents] = useState<number>(500);
  const [teachers, setTeachers] = useState<number>(32);

  // Calculations based on real school metrics
  // Average 3 hours saved per teacher per week on manual grading/attendance/reports
  // 3 hrs * 40 academic weeks = 120 hrs/teacher/year
  const teacherHoursSavedYear = teachers * 120;
  
  // Paper, toner, printing copies, physical circulars, physical grade books:
  // ~ $4.500 CLP per student per year in paper and physical copies
  const paperSavingsClp = students * 4500;

  // Formatting currency
  const formattedSavings = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(paperSavingsClp);

  return (
    <section id="calculadora-ahorro" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            Impacto Económico y Operacional
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Calcula cuánto ahorra tu colegio con <span className="text-blue-600">AURENIS</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Mueve los controles según el tamaño de tu establecimiento y observa el impacto inmediato en horas de trabajo docente y costos de papelería.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-sm space-y-7">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Dimensiona tu establecimiento</span>
            </h3>

            {/* Slider 1: Alumnos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Matrícula de Estudiantes
                </label>
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                  {students} alumnos
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>100 alumnos</span>
                <span>1.000 alumnos</span>
                <span>2.000 alumnos</span>
              </div>
            </div>

            {/* Slider 2: Docentes */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dotación Docente
                </label>
                <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                  {teachers} profesores
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="120"
                step="2"
                value={teachers}
                onChange={(e) => setTeachers(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>8 profesores</span>
                <span>60 profesores</span>
                <span>120 profesores</span>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Blindaje Normativo 100% Garantizado
              </div>
              <p className="text-slate-500 leading-relaxed">
                Aprobado bajo las directrices vigentes de la Superintendencia de Educación (Circular 30) y Mineduc (Decreto 67).
              </p>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-6 bg-slate-900 text-white p-7 sm:p-9 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Retorno Estimado Anual
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Impacto Directo
                </span>
              </div>

              {/* Metric 1: Hours saved */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Tiempo docente recuperado para el aula</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {teacherHoursSavedYear.toLocaleString("es-CL")}{" "}
                  <span className="text-lg font-bold text-blue-400">horas / año</span>
                </div>
                <p className="text-xs text-slate-400">
                  Equivalente a {(teacherHoursSavedYear / 40).toFixed(0)} horas pedagógicas semanales liberadas de digitación manual.
                </p>
              </div>

              {/* Metric 2: Paper & Printing Savings */}
              <div className="space-y-1 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Ahorro en fotocopias, libretas y carpetas</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                  {formattedSavings}{" "}
                  <span className="text-sm font-semibold text-slate-400">CLP / año</span>
                </div>
                <p className="text-xs text-slate-400">
                  Al digitalizar circulares a apoderados, pruebas impresas e informes de notas.
                </p>
              </div>

              {/* Metric 3: Peace of mind */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Cero riesgo de sanciones Mineduc:</strong> Actas de notas y firmas de asistencia verificadas en la nube.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() =>
                  onOpenQuoteModal(
                    `Estimación de ahorro para ${students} alumnos y ${teachers} docentes (${formattedSavings} CLP / año)`
                  )
                }
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Solicitar propuesta formal para mi colegio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
