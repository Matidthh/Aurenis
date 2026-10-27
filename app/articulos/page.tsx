import type { Metadata } from "next";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Award,
  Layers,
  FileCheck2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Artículos, Guías y Normativa Escolar Chilena | Aurenis",
  description:
    "Centro de conocimiento especializado en gestión escolar, Decreto 67 de 2018, Circular 30 del Libro de Clases Digital y rendición de recursos SEP ante la Superintendencia.",
  keywords: [
    "Articulos gestion escolar Chile",
    "Guia Decreto 67 evaluacion",
    "Circular 30 Libro de Clases Digital",
    "Rendir recursos SEP software",
    "Blog educacion Chile",
    "Aurenis articulos",
  ],
  alternates: {
    canonical: "https://aurenis.app/articulos",
  },
  openGraph: {
    title: "Artículos, Guías y Normativa Escolar Chilena — Aurenis",
    description:
      "Guías técnicas y pedagógicas elaboradas por el equipo de Aurenis para directores, jefes de UTP y sostenedores.",
    url: "https://aurenis.app/articulos",
    type: "website",
  },
};

interface ArticleCard {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  categoryColor: string;
  author: string;
  highlight: string;
}

const ARTICLES: ArticleCard[] = [
  {
    slug: "decreto-67-evaluacion-dual",
    title: "Cómo aplicar el Decreto 67 en la evaluación dual de forma digital",
    description:
      "Guía práctica sobre ponderaciones flexibles, rúbricas formativas, evidencias de aprendizaje en talleres técnicos y cálculo de promedios sin distorsión.",
    date: "24 de Octubre, 2026",
    readTime: "7 min de lectura",
    category: "Pedagogía & Decreto 67",
    categoryColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    author: "Maicol Recabarren & Lucas P.",
    highlight: "Incluye matriz de ponderaciones recomendadas para UTP.",
  },
  {
    slug: "circular-30-libro-clases-digital",
    title: "Requisitos indispensables de la Superintendencia para el Libro de Clases Digital (Circular 30)",
    description:
      "Análisis exhaustivo de los controles de seguridad, trazabilidad de asistencia horaria, firma digital docente y cómo evitar observaciones en fiscalizaciones.",
    date: "20 de Octubre, 2026",
    readTime: "9 min de lectura",
    category: "Normativa & Ciberseguridad",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    author: "Frank M. & Maicol Recabarren",
    highlight: "Checklist de verificación ante inspecciones del MINEDUC.",
  },
  {
    slug: "rendir-recursos-sep-software-educativo",
    title: "Guía paso a paso para rendir recursos SEP en licencias de software educativo",
    description:
      "Cómo imputar correctamente la contratación de plataformas de gestión escolar en el Plan de Mejoramiento Educativo (PME) sin observaciones de la Superintendencia.",
    date: "16 de Octubre, 2026",
    readTime: "6 min de lectura",
    category: "Gestión Sostenedores & SEP",
    categoryColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    author: "Equipo Técnico Aurenis",
    highlight: "Modelos de justificación pedagógica listos para el PME.",
  },
];

export default function ArticulosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Centro de Artículos y Normativa Escolar Aurenis",
    description:
      "Publicaciones técnicas sobre el sistema educativo chileno, Decreto 67, Circular 30 y gestión de subvenciones.",
    url: "https://aurenis.app/articulos",
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingNavbar />

      <main className="pt-24 sm:pt-28 pb-20">
        {/* Cabecera del Centro de Artículos */}
        <section className="relative overflow-hidden py-16 sm:py-20 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-[#F5F8FC] via-white to-white dark:from-[#09152C] dark:via-[#070E1A] dark:to-[#070E1A]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Centro de Conocimiento &amp; Normativa Escolar</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-6">
              Guías Técnicas para la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Educación Chilena.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Análisis claros, rigurosos y respaldados por la normativa oficial del MINEDUC y la Superintendencia de Educación, redactados por los ingenieros y autores de AURENIS.
            </p>
          </div>
        </section>

        {/* Grilla de Artículos */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((art) => (
              <article
                key={art.slug}
                className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${art.categoryColor}`}>
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{art.readTime}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                      <Link href={`/articulos/${art.slug}`}>
                        {art.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {art.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {art.highlight}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span>Por <strong>{art.author}</strong></span>
                    </div>

                    <Link
                      href={`/articulos/${art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Leer artículo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
