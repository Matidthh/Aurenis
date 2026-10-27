import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  Scale,
  FileText,
  ChevronRight,
  CheckCircle2,
  Building2,
  ExternalLink,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description:
    "Términos y condiciones de uso de la plataforma de gestión escolar AURENIS, desarrollada por Softium Studios. Conforme a la legislación de la República de Chile.",
  openGraph: {
    title: "Términos y Condiciones — AURENIS",
    description: "Marco legal contractual para el uso institucional de AURENIS.",
  },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar Global */}
      <LandingNavbar />

      {/* Header / Hero */}
      <header className="pt-28 pb-12 sm:pt-36 sm:pb-16 bg-gradient-to-b from-white via-[#F8F8F5] to-[#F0F3F9] border-b border-slate-200/80 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Términos y Condiciones</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Condiciones Contractuales de Uso · Versión 1.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
            Disposiciones reglamentarias para el acceso, licenciamiento y operación de la plataforma escolar AURENIS en establecimientos educacionales de la República de Chile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Vigencia</span>
              <span className="text-slate-800 font-bold">Año Escolar 2026</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Desarrollo Tecnológico</span>
              <a
                href="https://softium.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1"
              >
                Softium Studios <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Contacto Legal</span>
              <a href="mailto:contact@aurenis.app" className="text-slate-800 hover:text-blue-600 font-bold">
                contact@aurenis.app
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="py-12 sm:py-16 bg-white flex-1 border-b border-slate-200/80">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Aceptación de los Términos
            </h2>
            <p>
              Al acceder, navegar o utilizar la plataforma AURENIS (incluyendo sus módulos de libro de clases, calificaciones, asistencia y portales directivos o docentes), el usuario y el establecimiento educacional representado declaran haber leído, comprendido y aceptado en su totalidad estos Términos y Condiciones, así como la Política de Privacidad vinculada.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> Naturaleza del Servicio y Rol Institucional
            </h2>
            <p>
              AURENIS es una plataforma de software como servicio (SaaS) multi-tenant desarrollada y mantenida por <strong className="text-slate-900 font-semibold">Softium Studios</strong> para facilitar la administración académica y el cumplimiento de las normativas del Ministerio de Educación de Chile (Decreto N° 67 de Evaluación y Circular N° 482).
            </p>
            <p>
              Softium Studios y AURENIS actúan estrictamente como <strong className="text-slate-900 font-semibold">Encargados del Tratamiento de Datos (Data Processor)</strong>. Los establecimientos educacionales contratantes actúan como <strong className="text-slate-900 font-semibold">Responsables del Tratamiento</strong> y son los únicos titulares de la información de sus estudiantes, apoderados y docentes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Cuentas, Credenciales y Responsabilidad de Uso
            </h2>
            <p>
              Las cuentas asignadas son personales e intransferibles. Cada usuario es responsable de custodiar sus credenciales de acceso y de reportar de inmediato cualquier indicio de uso no autorizado o vulneración de seguridad a la dirección de su establecimiento o a <strong className="text-blue-600 font-semibold">contact@aurenis.app</strong>.
            </p>
            <p>
              Queda estrictamente prohibida la suplantación de identidad, la alteración no autorizada de calificaciones o la extracción automatizada de datos (scraping).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Cumplimiento Normativo y Auditoría Escolar
            </h2>
            <p>
              El motor de calificaciones y promedios de AURENIS opera bajo los estándares del Decreto N° 67 del MINEDUC, manteniendo trazabilidad e inmutabilidad en las notas ingresadas por el cuerpo docente. El sistema no permite modificaciones retroactivas arbitrarias que vulneren la fe pública del registro escolar oficial.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Jurisdicción y Ley Aplicable
            </h2>
            <p>
              Los presentes términos se rigen íntegramente por las leyes de la República de Chile. Cualquier discrepancia o controversia derivada de la interpretación o ejecución de estos términos será sometida a la jurisdicción de los tribunales ordinarios de justicia competentes en Chile.
            </p>
          </section>

          {/* Caja Resumen Softium */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0C1B33] to-[#081224] text-white space-y-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Softium Studios</h3>
                <p className="text-xs text-blue-300">Desarrollo, Arquitectura &amp; Soporte de AURENIS</p>
              </div>
            </div>
            <div className="text-xs text-slate-300 pt-2 border-t border-slate-800 flex flex-wrap gap-4">
              <span>Sitio oficial: <a href="https://softium.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">https://softium.xyz</a></span>
              <span>Contacto: <a href="mailto:contact@aurenis.app" className="text-blue-400 underline">contact@aurenis.app</a></span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/privacidad"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
            >
              <span>Revisar Política de Privacidad</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sobre-nosotros"
              className="text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Conocer al Equipo Técnico
            </Link>
          </div>

        </article>
      </main>

      {/* Footer Global */}
      <LandingFooter />
    </div>
  );
}
