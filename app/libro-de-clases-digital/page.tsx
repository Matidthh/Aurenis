import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  FileCheck2,
  ShieldCheck,
  Clock,
  Fingerprint,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Lock,
  Download,
  School,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Libro de Clases Digital Conforme a Circular 30 | Aurenis Chile",
  description:
    "Software de Libro de Clases Digital validado bajo la Circular N° 30 de la Superintendencia de Educación. Firma digital, control horario de asistencia, resguardo de subvenciones y exportación oficial.",
  keywords: [
    "Libro de Clases Digital",
    "Circular 30 Superintendencia de Educacion",
    "Subvencion escolar MINEDUC",
    "Firma digital libro de clases",
    "Asistencia escolar Chile",
    "Aurenis libro digital",
  ],
  alternates: {
    canonical: "https://aurenis.app/libro-de-clases-digital",
  },
  openGraph: {
    title: "Libro de Clases Digital Conforme a Circular 30 — Aurenis Chile",
    description:
      "Garantía de cumplimiento normativo para establecimientos educacionales de Chile. Cero observaciones en fiscalizaciones de la Superintendencia.",
    url: "https://aurenis.app/libro-de-clases-digital",
    type: "website",
  },
};

export default function LibroDeClasesDigitalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Aurenis Libro de Clases Digital",
    applicationCategory: "EducationalSoftware",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CLP",
    },
    description:
      "Solución de libro de clases digital para colegios chilenos conforme a la Circular 30 de la Superintendencia de Educación.",
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
              <ShieldCheck className="w-4 h-4" />
              <span>Conforme a Circular N° 30 — Superintendencia de Educación</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6 leading-tight">
              Libro de Clases Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                100% blindado para auditorías.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Elimina los libros de papel duplicados, las firmas fuera de plazo y los riesgos de multas o retención de subvenciones del MINEDUC. Aurenis cumple estrictamente cada directriz técnica de la Circular 30.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login?school=lpmm"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Solicitar Demostración en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:contact@aurenis.app?subject=Consulta%20Libro%20de%20Clases%20Digital"
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base transition-all"
              >
                Descargar Especificación Técnica
              </a>
            </div>
          </div>
        </section>

        {/* Pilares Clave de la Circular 30 */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white mb-4">
              ¿Por qué los Sostenedores y Directores eligen Aurenis?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              La Superintendencia exige estándares claros de autenticidad, inmutabilidad y disponibilidad de la información escolar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Firma Digital Docente y Registro de Hora
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cada leccionario, asistencia u observación queda sellado con marca temporal de servidor inviolable y huella de identidad del docente.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Control de Asistencia para Subvención
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cálculo instantáneo de porcentaje de asistencia media y mensual por curso, sincronizable con las declaraciones mensuales de subvención general y SEP.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Exportación Inmediata ante Fiscalización
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generación en un clic del informe consolidado del libro de clases en formato digital imprimible ante visitas sorpresivas de la Superintendencia.
              </p>
            </div>
          </div>
        </section>

        {/* Tabla Comparativa: Papel vs Aurenis */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white mb-6 text-center">
              Comparativa Técnica: Libro en Papel vs. Aurenis Digital
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="py-3 px-4 font-bold">Criterio de Fiscalización</th>
                    <th className="py-3 px-4 font-bold text-red-500">Libro en Papel Tradicional</th>
                    <th className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">Aurenis Circular 30</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Inmutabilidad de notas</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Vulnerable a corrector, borrones y errores de transcripción</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">Auditoría inmutable con bitácora de servidor (PostgreSQL)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cálculo de asistencia</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Manual, propenso a desfases y discrepancias con el SIGE</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">Automatizado en tiempo real por bloque pedagógico</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Respaldo ante siniestros</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Pérdida irrecuperable ante extravío, robo o daño físico</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">Respaldos redundantes cifrados con réplica continua</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Carga administrativa docente</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Hasta 8 horas semanales por profesor fuera de aula</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">Menos de 2 minutos por bloque de clases</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
            <h3 className="text-2xl sm:text-4xl font-black mb-4">
              Moderniza el Libro de Clases de tu Establecimiento
            </h3>
            <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base mb-8">
              Acompañamos a tu equipo directivo en todo el proceso de acreditación ante la Superintendencia de Educación.
            </p>
            <Link
              href="/login?school=lpmm"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all text-sm sm:text-base shadow-md"
            >
              <span>Acceder al Prototipo Operativo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
