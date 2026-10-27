import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Calculator,
  Sliders,
  Scale,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Evaluación y Calificaciones Decreto 67 de 2018 | Aurenis Chile",
  description:
    "Software escolar adaptado al Decreto N° 67 de 2018 del MINEDUC. Evaluación formativa y sumativa, ponderaciones personalizables por RIE, evaluación dual técnico-profesional y alertas tempranas de repitencia.",
  keywords: [
    "Decreto 67 evaluacion escolar",
    "Evaluacion formativa y sumativa Chile",
    "Promedio ponderado MINEDUC",
    "Reglamento de evaluacion RIE",
    "Evaluacion dual educacion tecnica",
    "Aurenis Decreto 67",
  ],
  alternates: {
    canonical: "https://aurenis.app/decreto-67",
  },
  openGraph: {
    title: "Evaluación y Calificaciones Decreto 67 de 2018 — Aurenis Chile",
    description:
      "Alinea el reglamento de evaluación de tu colegio con el Decreto 67 sin distorsiones aritméticas ni sobrecarga para los profesores.",
    url: "https://aurenis.app/decreto-67",
    type: "website",
  },
};

export default function Decreto67Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: "Aurenis Decreto 67 Grading Engine",
    description:
      "Motor de cálculo y gestión pedagógica alineado con el Decreto 67 de 2018 del Ministerio de Educación de Chile.",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-[#F5F8FC] via-white to-white dark:from-[#09152C] dark:via-[#070E1A] dark:to-[#070E1A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6">
              <Scale className="w-4 h-4" />
              <span>Ministerio de Educación — Decreto N° 67 de 2018</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6 leading-tight">
              Evaluación pedagógica real, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                más allá de una simple nota.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              El Decreto 67 transformó la evaluación en Chile: prioriza la retroalimentación formativa y prohíbe las calificaciones punitivas. Aurenis proporciona a tu Unidad Técnica Pedagógica (UTP) la herramienta exacta para configurar ponderaciones, rúbricas y acompañamiento escolar.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login?school=lpmm"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Probar Planilla Decreto 67</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/articulos/decreto-67-evaluacion-dual"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-all"
              >
                Leer Guía de Evaluación Dual
              </Link>
            </div>
          </div>
        </section>

        {/* Pilares del Módulo Decreto 67 */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white mb-4">
              ¿Cómo resuelve Aurenis las exigencias del Decreto 67?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Diseñado en conjunto con profesores y jefes de UTP de la educación media humanista-científica y técnico-profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Ponderaciones Flexibles por RIE
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cada colegio tiene su propio Reglamento Interno de Evaluación. Aurenis permite ponderaciones porcentuales, escalas diversificadas y notas acumulativas por asignatura.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Evaluación Dual &amp; Técnico-Profesional
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Especialmente calibrado para liceos técnicos: evaluación en talleres de especialidad, módulos prácticos y co-evaluación con maestros guía de empresas colaboradoras.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Alertas Preventivas de Repitencia
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                El sistema detecta automáticamente a los estudiantes que no alcanzan el promedio 4.5 o tienen dos asignaturas deficientes, activando el protocolo de acompañamiento pedagógico.
              </p>
            </div>
          </div>
        </section>

        {/* Respaldo Institucional y Simulación */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-semibold">
                <Calculator className="w-3.5 h-3.5" />
                <span>Cálculo Cero Errores en Servidor</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                Elimina las discrepancias de redondeo y actas manuales.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                En Aurenis, el cómputo de promedios se ejecuta de forma atómica y centralizada en el backend. Los apoderados y estudiantes consultan notas transparentes con el desglose exacto de cada evaluación sumativa.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Ver Planilla de Calificaciones</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
