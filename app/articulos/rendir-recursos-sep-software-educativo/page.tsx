import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo rendir recursos SEP en licencias de software educativo | Aurenis Chile",
  description:
    "Guía paso a paso para Sostenedores: cómo imputar la contratación de software escolar en el PME, evitar observaciones de la Superintendencia y resguardar la subvención preferencial.",
  keywords: [
    "Rendicion recursos SEP software",
    "Subvencion Escolar Preferencial PME",
    "Comprar software con fondos SEP",
    "Superintendencia de Educacion rendicion cuentas",
    "Aurenis SEP",
  ],
  alternates: {
    canonical: "https://aurenis.app/articulos/rendir-recursos-sep-software-educativo",
  },
  openGraph: {
    title: "Cómo rendir recursos SEP en licencias de software educativo — Aurenis Chile",
    description:
      "Guía para sostenedores y directores sobre la correcta justificación e imputación contable de licencias de gestión escolar en el PME.",
    url: "https://aurenis.app/articulos/rendir-recursos-sep-software-educativo",
    type: "article",
  },
};

export default function RendirRecursosSepArticuloPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guía paso a paso para rendir recursos SEP en licencias de software educativo",
    description:
      "Instrucciones detalladas para la contratación e imputación de software escolar con fondos de la Subvención Escolar Preferencial (SEP) en Chile.",
    author: {
      "@type": "Organization",
      name: "Aurenis Cloud Education",
      url: "https://aurenis.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Aurenis",
      url: "https://aurenis.app",
    },
    datePublished: "2026-10-16",
    dateModified: "2026-10-16",
    mainEntityOfPage: "https://aurenis.app/articulos/rendir-recursos-sep-software-educativo",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-28 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/articulos" className="hover:text-blue-600">Artículos</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">Rendición SEP de Software</span>
          </nav>

          <div className="space-y-4 mb-8">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              Gestión Sostenedores &amp; SEP
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Guía paso a paso para rendir recursos SEP en licencias de software educativo
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
              <span>Por <strong>Equipo Técnico &amp; Jurídico Aurenis</strong></span>
              <span>·</span>
              <span>16 de Octubre, 2026</span>
              <span>·</span>
              <span>6 min de lectura</span>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium">
              Muchos sostenedores y administradores educacionales en Chile desconocen que la contratación de software de gestión escolar y libro de clases digital puede financiarse legítimamente con fondos de la <strong>Ley N° 20.248 de Subvención Escolar Preferencial (SEP)</strong>, siempre que esté adecuadamente vinculado al <strong>Plan de Mejoramiento Educativo (PME)</strong>.
            </p>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              1. En qué dimensión del PME debe incorporarse
            </h2>
            <p>
              Para que la Superintendencia de Educación apruebe el gasto sin observaciones contables, la contratación del software debe asociarse a una de las siguientes dimensiones del PME:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dimensión Gestión Curricular:</strong> Acción orientada al seguimiento, monitoreo y evaluación del aprendizaje de estudiantes prioritarios y preferentes.</li>
              <li><strong>Dimensión Liderazgo Escolar:</strong> Sistema de información y alerta temprana para la toma de decisiones basada en datos de asistencia y rendimiento.</li>
              <li><strong>Dimensión Convivencia Escolar:</strong> Módulo de registro y seguimiento de protocolos de convivencia y entrevistas de apoderados.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              2. Documentación que debe resguardar el Sostenedor
            </h2>
            <p>
              Al momento de rendir cuentas en la plataforma de la Superintendencia, se deben adjuntar:
            </p>

            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Factura Electrónica exenta o afecta:</strong> Con glosa que especifique el período de servicio contratado para el establecimiento educacional (RBD).</li>
              <li><strong>Contrato de prestación de servicios:</strong> Que detalle las características técnicas, soporte y cumplimiento de la Circular 30.</li>
              <li><strong>Comprobante de egreso bancario:</strong> Cartola de la cuenta corriente exclusiva SEP que acredite el pago del servicio.</li>
              <li><strong>Informe de recepción conforme:</strong> Firmado por la Dirección o Jefatura de UTP acreditando que la plataforma se encuentra operativa y utilizada por el cuerpo docente.</li>
            </ol>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              3. El Acompañamiento Administrativo de Aurenis
            </h2>
            <p>
              En Aurenis entregamos a los sostenedores el kit de rendición completo: propuesta técnica formal, contrato estandarizado, factura electrónica detallada por RBD y modelo de informe pedagógico de uso para la rendición anual ante la Superintendencia.
            </p>

            <div className="p-6 rounded-2xl bg-slate-900 text-white mt-8 space-y-4">
              <h3 className="text-xl font-bold">¿Necesitas cotizar Aurenis con cargo a fondos SEP?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Escríbenos a <strong>contact@aurenis.app</strong> indicando el número de matrícula y RBD de tu colegio para enviarte la propuesta formal y la minuta técnica de respaldo.
              </p>
              <a
                href="mailto:contact@aurenis.app?subject=Cotizacion%20Fondos%20SEP%20Aurenis"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Solicitar Minuta de Respaldo SEP</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
