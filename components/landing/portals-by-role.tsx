"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Printer,
  FileText,
  FileSpreadsheet,
  Wrench,
  ArrowRight,
  Calculator,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function PortalsByRole() {
  const [studentCount, setStudentCount] = useState<number>(650);

  // Estimaciones conservadoras y reales de consumo anual de papelería en colegios de Chile (CLP):
  // 1. Hojas de Oficio / Carta: resmas para guías, pruebas impresas y circulares (~$2.200 CLP por alumno/año)
  // 2. Tinta de Impresoras: tóner, recargas de tinta y cuotas de fotocopiado en sala de profes (~$2.800 CLP por alumno/año)
  // 3. Papel Continuo: talonarios, certificados y actas de notas históricas de secretaría (~$800 CLP por alumno/año)
  // 4. Mantenimiento de Hardware: visitas de servicio técnico por atascos de papel y cambio de rodillos (~$700 CLP por alumno/año)
  const costHojas = Math.round(studentCount * 2200);
  const costTinta = Math.round(studentCount * 2800);
  const costPapelContinuo = Math.round(studentCount * 800);
  const costMantenimiento = Math.round(studentCount * 700);

  const totalTraditionalCost = costHojas + costTinta + costPapelContinuo + costMantenimiento;
  
  // Ahorro operativo directo: al digitalizar el libro de clases, asistencia y notas,
  // el colegio reduce en un 85% el gasto en estos 4 rubros físicos
  const savingsPercent = 85;
  const estimatedSavings = Math.round(totalTraditionalCost * (savingsPercent / 100));

  function formatCLP(amount: number) {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const items = [
    {
      id: "hojas",
      name: "Hojas de Oficio y Carta",
      description: "Resmas para guías de estudio, pruebas bimestrales y circulares a apoderados.",
      traditionalCost: costHojas,
      aurenisSolution: "Digitalización directa: guías y notas visibles en la app y portal",
      icon: FileText,
      impact: "-85% de resmas",
    },
    {
      id: "tinta",
      name: "Tinta de Impresoras",
      description: "Cartuchos, botellas de tinta y cuotas de fotocopiadoras en sala de profesores.",
      traditionalCost: costTinta,
      aurenisSolution: "Cero impresiones masivas de informes de notas y certificados",
      icon: Printer,
      impact: "-90% de recargas",
    },
    {
      id: "papel_continuo",
      name: "Papel Continuo",
      description: "Hojas continuas para actas de notas matriciales y formularios de secretaría.",
      traditionalCost: costPapelContinuo,
      aurenisSolution: "Actas oficiales en PDF con validación QR y exportación a SIGE",
      icon: FileSpreadsheet,
      impact: "100% digitalizado",
    },
    {
      id: "mantenimiento",
      name: "Mantenimiento de Hardware",
      description: "Visitas técnicas por atascos frecuentes de papel, recambio de rodillos y fusores.",
      traditionalCost: costMantenimiento,
      aurenisSolution: "Menor desgaste de equipos al eliminar la sobrecarga de copiado",
      icon: Wrench,
      impact: "Disminución técnica",
    },
  ];

  return (
    <section
      id="portales"
      className="py-12 sm:py-16 bg-[#F4F4F0] border-y border-slate-200/90 relative"
    >
      {/* Anchors de navegación */}
      <span id="ahorro-papel" className="absolute -top-24" aria-hidden="true" />
      <span id="simulador" className="absolute -top-24" aria-hidden="true" />
      <span id="gastos-operacionales" className="absolute -top-24" aria-hidden="true" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Cabecera Compacta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-xs font-black text-rose-700">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Ahorro Operacional en Insumos Escolares</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              ¿Cuánto gasta tu colegio en hojas, tinta e impresoras?
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Desglose en pesos chilenos de los gastos que un colegio elimina al digitalizar su gestión académica con <strong>AURENIS</strong>.
            </p>
          </div>

          {/* Controlador de Matrícula Compacto */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 shrink-0 w-full md:w-auto md:min-w-[320px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Matrícula del Colegio:</span>
              <span className="text-sm font-black text-indigo-600 font-mono bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {studentCount} alumnos
              </span>
            </div>

            <input
              type="range"
              min={150}
              max={1500}
              step={25}
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold gap-2">
              <button
                type="button"
                onClick={() => setStudentCount(350)}
                className={cn(
                  "hover:text-indigo-600 cursor-pointer transition",
                  studentCount === 350 && "text-indigo-600 font-black underline"
                )}
              >
                350 (Básica)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setStudentCount(650)}
                className={cn(
                  "hover:text-indigo-600 cursor-pointer transition",
                  studentCount === 650 && "text-indigo-600 font-black underline"
                )}
              >
                650 (Promedio)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setStudentCount(1200)}
                className={cn(
                  "hover:text-indigo-600 cursor-pointer transition",
                  studentCount === 1200 && "text-indigo-600 font-black underline"
                )}
              >
                1.200 (Complejo)
              </button>
            </div>
          </div>
        </div>

        {/* Tabla Comparativa Compacta de los 4 Rubros */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 sm:px-6 w-1/3">Rubro Operacional Escolar</th>
                  <th className="py-3.5 px-4 text-center w-1/4 text-rose-700">
                    Gasto Tradicional (Sin Sistema)
                  </th>
                  <th className="py-3.5 px-4 text-center w-1/4 text-emerald-700">
                    Con AURENIS (100% Digital)
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-right w-1/6 text-slate-900">
                    Impacto en Caja
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      {/* Rubro */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-black text-slate-900 text-xs sm:text-sm block">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium leading-tight line-clamp-1 sm:line-clamp-none">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Gasto Tradicional */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-black text-rose-700 text-xs sm:text-sm block">
                          {formatCLP(item.traditionalCost)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">al año lectivo</span>
                      </td>

                      {/* Solución AURENIS */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.aurenisSolution}</span>
                        </div>
                      </td>

                      {/* Impacto */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="font-mono font-black text-emerald-600 text-xs sm:text-sm block">
                          +{formatCLP(Math.round(item.traditionalCost * 0.85))}
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                          {item.impact}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen Final en 3 Columnas Claras y Defendibles */}
          <div className="bg-slate-50/70 p-4 sm:p-6 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
              
              {/* Total Tradicional */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Gasto Tradicional en Papelería
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-700 font-mono block">
                  {formatCLP(totalTraditionalCost)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Hojas, tinta, actas y servicio técnico</span>
              </div>

              {/* Reducción Operacional Directa */}
              <div className="p-3.5 rounded-2xl bg-white border border-blue-200 text-center space-y-0.5">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                  Reducción con AURENIS
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 font-mono block">
                  ~85% de Menor Consumo
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Libro digital + notas y actas sin papel</span>
              </div>

              {/* Dinero Liberado */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-0.5 shadow-2xs">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                  Fondos Liberados para el Colegio
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono block">
                  +{formatCLP(estimatedSavings)}
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  Dinero que no se quema en impresiones
                </span>
              </div>
            </div>

            {/* Fila de Acciones y Salida Directa */}
            <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-center sm:text-left">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transición digital progresiva con respaldo de actas en PDF según normativa MINEDUC.</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href="#planes"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Ver Planes Comerciales</span>
                </a>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/select-school"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs transition flex items-center justify-center gap-1"
                >
                  <span>Explorar Instituciones</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
