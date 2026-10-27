import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  Scale,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo aplicar el Decreto 67 en la evaluación dual de forma digital | Aurenis",
  description:
    "Guía técnica y pedagógica para Jefes de UTP y directivos: ponderaciones, evaluación formativa, evidencias en talleres de especialidad y prevención de repitencia escolar.",
  keywords: [
    "Decreto 67 evaluacion dual",
    "Reglamento de evaluacion RIE",
    "Evaluacion formativa liceo tecnico",
    "Ponderaciones Decreto 67",
    "Aurenis Decreto 67",
  ],
  alternates: {
    canonical: "https://aurenis.app/articulos/decreto-67-evaluacion-dual",
  },
  openGraph: {
    title: "Cómo aplicar el Decreto 67 en la evaluación dual de forma digital — Aurenis",
    description:
      "Alinea el reglamento de evaluación de tu establecimiento con el Decreto 67 de 2018 del MINEDUC.",
    url: "https://aurenis.app/articulos/decreto-67-evaluacion-dual",
    type: "article",
  },
};

export default function Decreto67ArticuloPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cómo aplicar el Decreto 67 en la evaluación dual de forma digital",
    description:
      "Guía técnica y pedagógica sobre la implementación del Decreto 67 de 2018 en establecimientos de educación técnico-profesional y científica.",
    author: [
      {
        "@type": "Person",
        name: "Maicol Recabarren Cerda",
        jobTitle: "Lead & Software Architect",
      },
      {
        "@type": "Person",
        name: "Lucas P.",
        jobTitle: "UI/UX & Education Design",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Aurenis",
      url: "https://aurenis.app",
    },
    datePublished: "2026-10-24",
    dateModified: "2026-10-24",
    mainEntityOfPage: "https://aurenis.app/articulos/decreto-67-evaluacion-dual",
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
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">Decreto 67 y Evaluación Dual</span>
          </nav>

          <div className="space-y-4 mb-8">
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Pedagogía &amp; Decreto 67
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Cómo aplicar el Decreto 67 en la evaluación dual de forma digital
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 dark:border-slate-800 pb-6">
              <span>Por <strong>Maicol Recabarren Cerda</strong> &amp; <strong>Lucas P.</strong></span>
              <span>·</span>
              <span>24 de Octubre, 2026</span>
              <span>·</span>
              <span>7 min de lectura</span>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium">
              El <strong>Decreto N° 67 de 2018 del Ministerio de Educación</strong> representó el cambio de paradigma más significativo en los últimos 20 años de educación en Chile: erradicó la evaluación punitiva, prohibió la repitencia automática por promedio insuficiente y consagró a la <strong>evaluación formativa</strong> como el motor principal del aprendizaje.
            </p>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              1. El Desafío de la Educación Dual Técnico-Profesional
            </h2>
            <p>
              En liceos técnicos (como nuestro querido Liceo Politécnico Marga Marga en Quilpué), los estudiantes aprenden tanto en el aula tradicional como en los talleres de especialidad y en empresas colaboradoras mediante la modalidad dual. Evaluar este aprendizaje con un libro tradicional que solo admite una columna de notas del 1.0 al 7.0 produce un desfase insostenible:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Falta de trazabilidad de competencias:</strong> Las rúbricas prácticas de taller no caben en una casilla de papel.</li>
              <li><strong>Ponderaciones rígidas:</strong> Un examen teórico termina valiendo lo mismo que 6 semanas de trabajo en taller.</li>
              <li><strong>Atraso en la retroalimentación:</strong> El alumno se entera de su situación cuando ya es tarde para corregir el rumbo pedagógico.</li>
            </ul>

            <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200">
              <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                Criterio del Artículo 8 del Decreto 67:
              </h4>
              <p className="text-xs leading-relaxed">
                "La calificación final anual de cada asignatura o módulo deberá sustentarse en un proceso diversificado de evaluación, donde las calificaciones sumativas representen logros acumulativos verificados y no eventos aislados de memorización."
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              2. Cómo configurar las ponderaciones en Aurenis
            </h2>
            <p>
              Para cumplir cabalmente con la normativa sin abrumar a los docentes, en Aurenis diseñamos un motor de evaluación que permite a la Unidad Técnica Pedagógica (UTP):
            </p>

            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Crear categorías ponderadas:</strong> Por ejemplo, 40% Talleres Prácticos, 30% Proyecto ABP Interdisciplinario, 20% Evaluaciones Sumativas y 10% Autoevaluación y Co-evaluación.</li>
              <li><strong>Registrar evidencias formativas sin calificar con nota numérica:</strong> Indicadores de logro (Logrado, Medianamente Logrado, Por Lograr) que orientan al alumno antes de la calificación sumativa.</li>
              <li><strong>Cálculo centralizado sin distorsión aritmética:</strong> El servidor aplica los factores de ponderación exactos conforme al Reglamento Interno de Evaluación (RIE) del colegio, evitando fórmulas erróneas en hojas de cálculo externas.</li>
            </ol>

            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white pt-4">
              3. Protocolo Preventivo de Repitencia (Artículo 11 y 12)
            </h2>
            <p>
              Uno de los puntos más fiscalizados por la Superintendencia de Educación es la activación obligatoria de medidas de acompañamiento pedagógico para estudiantes con riesgo de repitencia. Aurenis emite alertas tempranas automáticas para el equipo directivo cuando:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Un estudiante presenta dos o más asignaturas con promedio proyectado inferior a 4.0.</li>
              <li>El promedio general del alumno desciende por debajo de 4.5 teniendo un módulo reprobado.</li>
              <li>El porcentaje de asistencia acumulada cae por debajo del 85% normativo.</li>
            </ul>

            <div className="p-6 rounded-2xl bg-slate-900 text-white mt-8 space-y-4">
              <h3 className="text-xl font-bold">¿Deseas implementar el Decreto 67 en tu colegio?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Aurenis ya tiene configurados los modelos pedagógicos para educación básica, media humanista y media técnico-profesional de Chile.
              </p>
              <Link
                href="/login?school=lpmm"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Explorar Demostración en Vivo</span>
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
