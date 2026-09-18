"use client";

import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle, PhoneCall, Building2 } from "lucide-react";

interface PricingPlansProps {
  onSelectPlan: (planName: string) => void;
}

export function PricingPlans({ onSelectPlan }: PricingPlansProps) {
  const [billingCycle, setBillingCycle] = useState<"anual" | "mensual">("anual");

  const plans = [
    {
      id: "esencial",
      name: "Plan Esencial Digital",
      badge: "Iniciación Digital",
      badgeColor: "bg-slate-100 text-slate-700",
      description: "Ideal para colegios que buscan reemplazar planillas manuales y ordenar el registro de notas y asistencia.",
      priceAnnual: "$990",
      priceUnit: "CLP / alumno / mes (Anual)",
      highlight: false,
      features: [
        "Libro de Clases Digital (Asistencia y Notas)",
        "Pase de Asistencia en 1 Clic por Bloque",
        "Registro de Calificaciones (1.0 a 7.0)",
        "Generación de Certificados de Alumno Regular",
        "Respaldo seguro en base de datos PostgreSQL",
        "Mesa de ayuda y soporte por correo",
      ],
      notIncluded: [
        "Portal móvil para apoderados",
        "Sistema de Alerta Temprana (SAT)",
        "Soporte prioritario por WhatsApp",
      ],
      ctaText: "Cotizar Plan Esencial ($990 CLP)",
    },
    {
      id: "integral",
      name: "Plan Integral Mineduc",
      badge: "MÁS UTILIZADO",
      badgeColor: "bg-blue-600 text-white font-extrabold shadow-xs",
      description: "La solución completa orientada a colegios que requieren digitalización integral de libro de clases, asistencia y notas.",
      priceAnnual: "Cotización a medida",
      priceUnit: "Según matrícula y requerimientos de soporte",
      highlight: true,
      features: [
        "Todo lo incluido en el Plan Esencial",
        "Matriz de Notas con Promedio Simple o Ponderado (Decreto 67)",
        "Portal Web para Estudiantes y Apoderados",
        "Detección de Estudiantes con Inasistencia Crítica",
        "Exportación estructurada de Actas y Matrícula",
        "Auditoría y trazabilidad de registros de clase",
        "Acompañamiento en la carga inicial de nóminas",
        "Soporte técnico directo vía correo y canal prioritario",
      ],
      notIncluded: [],
      ctaText: "Solicitar Cotización Plan Integral",
    },
    {
      id: "red",
      name: "Plan Red & Multi-Sede",
      badge: "Sostenedores & SLEP",
      badgeColor: "bg-purple-100 text-purple-800",
      description: "Diseñado para fundaciones, corporaciones educacionales y redes de 2 o más recintos escolares.",
      priceAnnual: "Propuesta Institucional",
      priceUnit: "Especial por volumen de sedes y estudiantes",
      highlight: false,
      features: [
        "Todo lo incluido en el Plan Integral",
        "Panel de Control Consolidado Multi-Colegio",
        "Visualización comparativa de asistencia entre sedes",
        "Bases de datos aisladas e independientes por colegio",
        "Capacitación inicial para administradores y coordinadores UTP",
        "Atención técnica especializada para la red",
      ],
      notIncluded: [],
      ctaText: "Solicitar Cotización Corporativa",
    },
  ];

  return (
    <section id="planes" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Inversión Transparente y Rentable
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Planes adaptados a la realidad de tu colegio
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Facturación 100% elegible para Subvención Escolar Preferencial (SEP) y fondos de mantenimiento institucional.
          </p>

          {/* Guarantee Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Migración gratuita de tus datos en 48 hrs · Sin costo de instalación inicial</span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? "bg-white border-2 border-blue-600 shadow-2xl scale-[1.02] z-10"
                  : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                  Opción Más Recomendada
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="space-y-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[38px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {plan.priceAnnual}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">
                    {plan.priceUnit}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Incluye en este plan:
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-400">
                        No incluye:
                      </div>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {plan.notIncluded.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Support & SEP Financing Note */}
        <div className="mt-14 max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">
              ¿Quieres financiar AURENIS con recursos SEP o Subvención General?
            </h4>
            <p className="text-xs text-slate-500">
              Te entregamos la documentación técnica y cotización estandarizada requerida para rendición ante la Superintendencia.
            </p>
          </div>
          <button
            onClick={() => onSelectPlan("Consulta Financiamiento SEP")}
            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0 cursor-pointer transition"
          >
            Consultar con Asesor SEP
          </button>
        </div>

      </div>
    </section>
  );
}
