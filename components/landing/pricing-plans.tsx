"use client";

import React, { useState } from "react";
import { Check, Minus, ArrowRight, ShieldCheck, HelpCircle, Layers, Award, Wrench } from "lucide-react";
import {
  AURENIS_PLANS,
  INITIAL_IMPLEMENTATION_SERVICE,
  COMPARISON_FEATURES,
  PricingPlan,
} from "@/lib/constants/pricing";

interface PricingPlansProps {
  onSelectPlan: (planName: string) => void;
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const [showComparison, setShowComparison] = useState(true);

  return (
    <section id="planes" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Header Institucional */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Propuesta de Valor Institucional</span>
            <span aria-hidden="true">·</span>
            <span>Pesos Chilenos (CLP)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Planes y Estructura Comercial
          </h2>
          
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Soluciones de gestión académica y libro de clases digital adaptadas al tamaño y a los requerimientos operacionales de cada establecimiento educacional.
          </p>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Facturación institucional elegible SEP y Subvención General
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Aislamiento seguro de datos por establecimiento</span>
          </div>
        </div>

        {/* 1. Las 3 Tarjetas de Planes Comerciales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {AURENIS_PLANS.map((plan: PricingPlan) => {
            const isRec = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                  isRec
                    ? "bg-white border-2 border-blue-600 shadow-xl lg:-translate-y-2 z-10"
                    : "bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Badge para el Plan Recomendado */}
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    {plan.badge || "Recomendado"}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Título y Tagline */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {plan.name}
                      </h3>
                      {!isRec && plan.badge && (
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium min-h-[34px]">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Bloque de Precio */}
                  <div className={`p-4 rounded-2xl border ${isRec ? "bg-blue-50/50 border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {plan.priceDisplay}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span>{plan.pricePeriod}</span>
                      <span className="font-semibold text-slate-700">{plan.studentLimit}</span>
                    </div>
                  </div>

                  {/* Descripción contextual */}
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Lista de Funcionalidades Reales */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      Funcionalidades incluidas:
                    </div>
                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isRec ? "text-blue-600" : "text-emerald-600"}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botón de Acción / CTA */}
                <div className="pt-8">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(`${plan.name} (${plan.priceDisplay} ${plan.pricePeriod})`)}
                    className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                      isRec
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-600/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Sección Separada: Implementación Inicial y Puesta en Marcha */}
        <div className="mt-14 sm:mt-18 max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-7 sm:p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Información del Servicio de Implementación */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Servicio de Puesta en Marcha</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {INITIAL_IMPLEMENTATION_SERVICE.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {INITIAL_IMPLEMENTATION_SERVICE.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
                  {INITIAL_IMPLEMENTATION_SERVICE.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarjeta de Precio de Implementación y CTA */}
              <div className="w-full lg:w-auto shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-center lg:text-right space-y-3">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {INITIAL_IMPLEMENTATION_SERVICE.priceDisplay}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    {INITIAL_IMPLEMENTATION_SERVICE.priceNote}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 max-w-xs mx-auto lg:ml-auto">
                  Ajustado a la matrícula, cantidad de sedes y volumen de registros históricos a migrar.
                </p>

                <button
                  type="button"
                  onClick={() => onSelectPlan("Servicio de Implementación Inicial (Desde $500.000 CLP)")}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 mx-auto lg:ml-auto shadow-xs"
                >
                  <span>{INITIAL_IMPLEMENTATION_SERVICE.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 3. Tabla de Comparativa Detallada de Funcionalidades */}
        <div className="mt-16 sm:mt-20 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Comparativa de Funcionalidades por Plan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Detalle transparente de las capacidades operativas incluidas en cada nivel de servicio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer self-start sm:self-auto"
            >
              {showComparison ? "Ocultar tabla comparativa" : "Ver tabla comparativa completa"}
            </button>
          </div>

          {showComparison && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                      <th className="py-4 px-5 sm:px-6 font-bold uppercase tracking-wider text-[11px] w-2/5">
                        Funcionalidad / Módulo Real
                      </th>
                      <th className="py-4 px-4 font-bold text-center w-1/5 text-slate-900">
                        Aurenis Start
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">$149.990 / mes</div>
                      </th>
                      <th className="py-4 px-4 font-bold text-center w-1/5 bg-blue-50/50 text-blue-900 border-x border-blue-100">
                        Aurenis Professional
                        <div className="text-[11px] font-normal text-blue-700 mt-0.5">$299.990 / mes</div>
                      </th>
                      <th className="py-4 px-4 font-bold text-center w-1/5 text-slate-900">
                        Aurenis Enterprise
                        <div className="text-[11px] font-normal text-slate-500 mt-0.5">Desde $499.990 / mes</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Render grouped by category */}
                    {(["Capacidad y Acceso", "Gestión Académica", "Dashboards y Portales", "Seguridad y Soporte"] as const).map((cat) => {
                      const catFeatures = COMPARISON_FEATURES.filter((f) => f.category === cat);
                      if (catFeatures.length === 0) return null;

                      return (
                        <React.Fragment key={cat}>
                          <tr className="bg-slate-50/40">
                            <td colSpan={4} className="py-2.5 px-5 sm:px-6 font-bold text-[11px] text-slate-600 uppercase tracking-wider">
                              {cat}
                            </td>
                          </tr>
                          {catFeatures.map((feat, fIdx) => (
                            <tr key={fIdx} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3.5 px-5 sm:px-6 font-medium text-slate-900">
                                {feat.name}
                              </td>

                              {/* Start */}
                              <td className="py-3.5 px-4 text-center">
                                {typeof feat.start === "boolean" ? (
                                  feat.start ? (
                                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                                  )
                                ) : (
                                  <span className="font-semibold text-slate-700">{feat.start}</span>
                                )}
                              </td>

                              {/* Professional */}
                              <td className="py-3.5 px-4 text-center bg-blue-50/20 border-x border-blue-100/60">
                                {typeof feat.professional === "boolean" ? (
                                  feat.professional ? (
                                    <Check className="w-4 h-4 text-blue-600 mx-auto" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                                  )
                                ) : (
                                  <span className="font-bold text-blue-900">{feat.professional}</span>
                                )}
                              </td>

                              {/* Enterprise */}
                              <td className="py-3.5 px-4 text-center">
                                {typeof feat.enterprise === "boolean" ? (
                                  feat.enterprise ? (
                                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                                  )
                                ) : (
                                  <span className="font-semibold text-slate-700">{feat.enterprise}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 4. Financiamiento SEP y Rendición Institucional */}
        <div className="mt-14 max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              ¿Desea financiar AURENIS con recursos SEP o Subvención General?
            </h4>
            <p className="text-xs text-slate-500">
              Proveemos la cotización técnica y formal requerida para rendición de cuentas ante la Superintendencia de Educación.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectPlan("Consulta Financiamiento SEP / Subvención")}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0 cursor-pointer transition"
          >
            Consultar Financiamiento SEP
          </button>
        </div>

      </div>
    </section>
  );
}
