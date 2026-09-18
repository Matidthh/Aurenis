"use client";

import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, PlayCircle, Clock, Users, Building } from "lucide-react";
import Link from "next/link";

interface FinalCtaSectionProps {
  onOpenQuoteModal?: () => void;
}

export function FinalCtaSection({ onOpenQuoteModal }: FinalCtaSectionProps) {

  return (
    <section id="contacto" className="py-20 sm:py-28 bg-[#F8F8F5] relative overflow-hidden">
      {/* Decorative ambient subtle background glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/40">
          
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            {/* Badge de Sección */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Modernización Escolar Sin Interrupciones</span>
            </div>

            {/* Titular Principal */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Transforma la gestión de tu colegio con tecnología pensada para Chile
            </h2>

            {/* Bajada Explicativa */}
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Pase de asistencia en 1 clic, cálculo ponderado de calificaciones (1.0 a 7.0), control de accesos por rol institucional y exportación completa de tus datos.
            </p>

            {/* Acciones Directas: Agendamiento y Demo */}
            <div className="space-y-4 max-w-xl mx-auto pt-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal?.()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
                >
                  <span>Agendar Demostración Directa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/select-school"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition shrink-0"
                >
                  <PlayCircle className="w-4 h-4 text-blue-600" />
                  <span>Entrar al Entorno Demo</span>
                </Link>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
                <span>¿Dudas inmediatas?</span>
                <a
                  href="mailto:contacto@aurenis.cl"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  contacto@aurenis.cl
                </a>
              </div>
            </div>

            {/* Puntos de Confianza Institucional */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>$0 Costo de Migración</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Exportación Completa .ZIP</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Puesta en marcha en 48 hrs</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

