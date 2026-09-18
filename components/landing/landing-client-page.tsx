"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

// Code-split heavy interactive sections for optimized chunk loading
const InteractiveSandbox = dynamic(
  () => import("@/components/landing/interactive-sandbox").then((mod) => mod.InteractiveSandbox),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando simulador interactivo...</div>
      </div>
    ),
  }
);

const RoiCalculator = dynamic(
  () => import("@/components/landing/roi-calculator").then((mod) => mod.RoiCalculator),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando calculadora ROI...</div>
      </div>
    ),
  }
);

const ComparisonBattlecard = dynamic(
  () => import("@/components/landing/comparison-battlecard").then((mod) => mod.ComparisonBattlecard),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando comparativa...</div>
      </div>
    ),
  }
);

const PricingPlans = dynamic(
  () => import("@/components/landing/pricing-plans").then((mod) => mod.PricingPlans),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando planes y tarifas...</div>
      </div>
    ),
  }
);

const HowWeMigrateSection = dynamic(
  () => import("@/components/landing/how-we-migrate-section").then((mod) => mod.HowWeMigrateSection),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando pasos de migración...</div>
      </div>
    ),
  }
);

const TestimonialsSocialProof = dynamic(
  () => import("@/components/landing/testimonials-social-proof").then((mod) => mod.TestimonialsSocialProof),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando testimonios...</div>
      </div>
    ),
  }
);

const PortalsByRole = dynamic(
  () => import("@/components/landing/portals-by-role").then((mod) => mod.PortalsByRole),
  {
    ssr: true,
    loading: () => (
      <div className="py-20 flex items-center justify-center text-slate-400">
        <div className="animate-pulse">Cargando módulos y portales...</div>
      </div>
    ),
  }
);

import { getBookingUrl } from "@/lib/booking";

export function LandingClientPage() {
  function handleOpenQuote(planName?: string) {
    const url = getBookingUrl(planName);
    if (url.startsWith("mailto:")) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* 1. Header con navegación a secciones comerciales y CTA directo */}
      <LandingNavbar
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 2. Hero Section con propuesta de valor clara y llamadas a la acción */}
      <ReplicatedHero
        hideHeader={true}
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 3. SIMULADOR EN VIVO: El cliente interactúa antes de comprar */}
      <InteractiveSandbox
        onOpenQuoteModal={() => handleOpenQuote("Plan Interactivo Demo")}
      />

      {/* 4. Dolores reales del colegio vs Solución AURENIS */}
      <ProblemSolutionSection />

      {/* 5. CALCULADORA DE RETORNO Y AHORRO: Justifica la inversión financieramente */}
      <RoiCalculator
        onOpenQuoteModal={() => handleOpenQuote("Cotización según Cálculo ROI")}
      />

      {/* 6. TABLA COMPARATIVA: AURENIS vs Software Tradicional vs Planillas Excel */}
      <ComparisonBattlecard
        onOpenQuoteModal={() => handleOpenQuote("Migración desde otro software")}
      />

      {/* 7. PLANES Y PRECIOS TRANSPARENTES: Elimina la fricción de compra */}
      <PricingPlans
        onSelectPlan={(plan) => handleOpenQuote(plan)}
      />

      {/* 8. CÓMO MIGRAMOS TU COLEGIO: 3 pasos sin fricción */}
      <HowWeMigrateSection />

      {/* 9. CASOS DE ÉXITO Y PRUEBA SOCIAL: Confianza y validación institucional */}
      <TestimonialsSocialProof />

      {/* 10. Portales por Rol: Experiencia para Director, Docente, Alumno y Apoderado */}
      <PortalsByRole />

      {/* 11. Preguntas Frecuentes: Responde y derriba las objeciones comerciales */}
      <FaqSection />

      {/* 12. Cierre Comercial y Captura Final */}
      <FinalCtaSection
        onOpenQuoteModal={() => handleOpenQuote("Solicitud Cierre Comercial")}
      />

      {/* 13. Pie de página institucional */}
      <LandingFooter />
    </div>
  );
}
