import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  ShieldCheck,
  ChevronRight,
  Fingerprint,
  Clock,
  FileCheck2,
  AlertTriangle,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Requisitos de la Superintendencia para el Libro de Clases Digital (Circular 30) | Aurenis",
  description:
    "Análisis técnico-normativo de la Circular N° 30: firma digital docente, control de asistencia, trazabilidad inmutable y cómo aprobar fiscalizaciones del MINEDUC.",
  keywords: [
    "Circular 30 Superintendencia de Educacion",
    "Libro de Clases Digital requisitos",
    "Fiscalizacion MINEDUC libro digital",
    "Firma digital profesores Chile",
    "Aurenis Circular 30",
  ],
  alternates: {
    canonical: "https://aurenis.app/articulos/circular-30-libro-clases-digital",
  },
  openGraph: {
    title: "Requisitos de la Superintendencia para el Libro de Clases Digital (Circular 30) — Aurenis",
    description:
      "Evita multas y retención de subvenciones cumpliendo cada requerimiento de la Circular N° 30 de la Superintendencia de Educación.",
    url: "https://aurenis.app/articulos/circular-30-libro-clases-digital",
    type: "article",
  },
};

export default function Circular30ArticuloPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Requisitos indispensables de la Superintendencia para el Libro de Clases Digital (Circular 30)",
    description:
      "Guía técnica sobre la adopción del Libro de Clases Digital bajo los lineamientos de la Circular 30 de la Superintendencia de Educación.",
    author: [
      {
        "@type": "Person",
        name: "Frank M.",
        jobTitle: "QA & Cybersecurity Auditor",
      },
      {
        "@type": "Person",
        name: "Maicol Recabarren Cerda",
        jobTitle: "Lead & Software Architect",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Aurenis",
      url: "https://aurenis.app",
    },
    datePublished: "2026-10-20",
    dateModified: "2026-10-20",
    mainEntityOfPage: "https://aurenis.app/articulos/circular-30-libro-clases-digital",
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
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">Circular N° 30 y Libro Digital</span>
          </nav>

          <div className="space-y-4 mb-8">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              Normativa &amp; Ciberseguridad
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Requisitos indispensables de la Superintendencia para el Libro de Clases Digital (Circular 30)
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
              <span>Por <strong>Frank M.</strong> &amp; <strong>Maicol Recabarren Cerda</strong></span>
              <span>·</span>
              <span>20 de Octubre, 2026</span>
              <span>·</span>
              <span>9 min de lectura</span>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium">
              La transición del libro de clases en papel al formato digital ya no es optativa para los establecimientos educacionales que buscan eficiencia y transparencia. Sin embargo, utilizar cualquier software sin verificar el cumplimiento de la <strong>Circular N° 30 de la Superintendencia de Educación</strong> puede acarrear sanciones severas, multas y la suspensión de la subvención escolar mensual.
            </p>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              1. Los 5 Requisitos Mandatorios de la Circular 30
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Fingerprint className="w-5 h-5 text-blue-500" />
                  A. Autenticación y Firma Electrónica Docente
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Cada firma de leccionario u observación debe vincularse de forma indubitada con la identidad del profesor. Queda prohibido compartir contraseñas o el firmado genérico institucional. En Aurenis se emplea firma con token criptográfico HS256 y control de sesión activa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  B. Marca Temporal Inviolable (Timestamp de Servidor)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  La hora de ingreso de la asistencia debe registrarse desde el servidor centralizado de la plataforma, impidiendo que los docentes o directivos alteren la hora del reloj de sus computadores o teléfonos locales.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-purple-500" />
                  C. Inmutabilidad y Pistas de Auditoría (Audit Log)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Si una nota o registro de asistencia es rectificado por un motivo pedagógico justificado, el sistema debe registrar quién lo modificó, la fecha exacta, el valor anterior y el motivo de la enmienda.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <FileCheck2 className="w-5 h-5 text-amber-500" />
                  D. Disponibilidad Inmediata ante Fiscalización In Situ
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Ante la visita sorpresa de un fiscalizador de la Superintendencia, el colegio debe exhibir el libro de clases de inmediato, con opción de generar reportes impresos o descargables en formato PDF no editable.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              2. Cómo audita Aurenis la Seguridad de los Datos
            </h2>
            <p>
              A diferencia de plataformas legadas vulnerables a inyecciones o suplantaciones, la arquitectura de Aurenis fue sometida a pentesting activo:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Aislamiento estricto por establecimiento (Multi-Tenant BOLA-Proof):</strong> Ningún usuario de un colegio puede consultar o alterar registros de otro.</li>
              <li><strong>Protección de datos de menores (Circular 482 y Ley 19.628):</strong> Cifrado de bases de datos en reposo y en tránsito mediante TLS 1.3.</li>
              <li><strong>Validación estricta de entradas (Zod):</strong> Erradicación de inyecciones SQL o comandos maliciosos en campos de leccionario.</li>
            </ul>

            <div className="p-6 rounded-2xl bg-slate-900 text-white mt-8 space-y-4">
              <h3 className="text-xl font-bold">¿Tu libro de clases actual resistiría una fiscalización?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Agenda una sesión técnica con nuestros ingenieros para auditar tu proceso actual y migrar a Aurenis en menos de 48 horas.
              </p>
              <Link
                href="/libro-de-clases-digital"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Conocer Más sobre Libro Digital Aurenis</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
