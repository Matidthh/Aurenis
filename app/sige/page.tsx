import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  FileCheck2,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sincronización e Interoperabilidad SIGE MINEDUC | Aurenis Chile",
  description:
    "Carga de actas escolares, asistencia mensual y matrícula hacia el SIGE (Sistema de Información General de Estudiantes) de Chile sin fricción ni doble digitación manual.",
  keywords: [
    "SIGE MINEDUC",
    "Carga de actas escolares Chile",
    "Asistencia mensual SIGE",
    "Matricula escolar MINEDUC",
    "Exportar notas SIGE",
    "Aurenis SIGE",
  ],
  alternates: {
    canonical: "https://aurenis.app/sige",
  },
  openGraph: {
    title: "Sincronización e Interoperabilidad SIGE MINEDUC — Aurenis Chile",
    description:
      "Ahorra semanas de digitación repetitiva a tu secretaría académica y UTP con la exportación directa a formatos oficiales SIGE.",
    url: "https://aurenis.app/sige",
    type: "website",
  },
};

export default function SigePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aurenis SIGE Bridge",
    description:
      "Módulo de interoperabilidad y exportación para el SIGE del Ministerio de Educación de Chile.",
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
              <UploadCloud className="w-4 h-4" />
              <span>Interoperabilidad con Plataformas Oficiales MINEDUC</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6 leading-tight">
              Carga de actas al SIGE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                sin doble digitación ni estrés.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              El cierre de año escolar y la declaración mensual de asistencia no deberían significar noches en vela transcribiendo notas una por una. Aurenis formatea y valida tus datos para que coincidan al 100% con los requerimientos del portal SIGE.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login?school=lpmm"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Ver Módulo de Exportación</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:contact@aurenis.app?subject=Consulta%20Interoperabilidad%20SIGE"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-all"
              >
                Consultar Compatibilidad
              </a>
            </div>
          </div>
        </section>

        {/* 3 Procesos Críticos Resueltos */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white mb-4">
              Los 3 procesos escolares que Aurenis automatiza para el SIGE
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Validación previa con los códigos oficiales de curso, subsectores y RUN de estudiantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Actas Finales de Calificación
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Genera las actas de promoción anual con los promedios calculados según Decreto 67, listas para su homologación y carga sin errores de formato.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Asistencia Mensual para Subvenciones
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Consolida la asistencia efectiva de cada día hábil del mes, permitiendo cotejar los porcentajes antes de subir el reporte de subvención.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Sincronización de Matrícula y Retiros
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Registro de altas, bajas y traslados de alumnos en tiempo real, manteniendo la nómina del establecimiento al día con el registro nacional.
              </p>
            </div>
          </div>
        </section>

        {/* Validaciones Previas Anti-Rechazo */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
            <div className="max-w-3xl">
              <h3 className="text-xl sm:text-3xl font-black text-slate-950 dark:text-white mb-4">
                Motor de Pre-Validación: Cero rechazos al cargar archivos
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                El sistema detecta de forma preventiva RUNs inválidos, estudiantes sin curso asignado, vacíos en el leccionario o notas fuera de rango antes de generar los archivos para el MINEDUC.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Validación de RUT chileno con dígito verificador</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cotejo de días hábiles del calendario regional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Alertas tempranas de notas incompletas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Exportación en formatos CSV y Excel normados</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
