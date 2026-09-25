"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { InteractiveSandbox } from "@/components/landing/interactive-sandbox";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { ComparisonBattlecard } from "@/components/landing/comparison-battlecard";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { HowWeMigrateSection } from "@/components/landing/how-we-migrate-section";
import { TestimonialsSocialProof } from "@/components/landing/testimonials-social-proof";
import { PortalsByRole } from "@/components/landing/portals-by-role";
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
      <ProblemSolutionSection
        onOpenQuoteModal={(src) => handleOpenQuote(src || "Cotización desde Comparativa")}
        onOpenDemoModal={(src) => handleOpenQuote(src || "Demostración desde Comparativa")}
      />

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
