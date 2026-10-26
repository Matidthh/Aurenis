"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { HowWeMigrateSection } from "@/components/landing/how-we-migrate-section";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "./landing-footer";
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
    <div
      suppressHydrationWarning
      className="min-h-screen bg-[#F8F8F5] text-slate-900 selection:bg-blue-500 selection:text-white pt-[68px] sm:pt-[76px]"
    >
      {/* 1. Header Institucional Fijo y Persistente */}
      <LandingNavbar
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 2. Hero Section: Headline de Impacto + CTAs + Mockup Interactivo + Capacidades */}
      <ReplicatedHero
        hideHeader={true}
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 4. Pilares Esenciales de Gestión y Cumplimiento Normativo */}
      <ProblemSolutionSection
        onOpenQuoteModal={(src) => handleOpenQuote(src || "Cotización desde Pilares")}
        onOpenDemoModal={(src) => handleOpenQuote(src || "Demostración desde Pilares")}
      />

      {/* 5. Protocolo de Migración Rápida */}
      <HowWeMigrateSection />

      {/* 6. Planes y Precios */}
      <PricingPlans
        onSelectPlan={(plan) => handleOpenQuote(plan)}
      />

      {/* 7. Preguntas Frecuentes */}
      <FaqSection />

      {/* 8. Llamado a la Acción Final */}
      <FinalCtaSection
        onOpenQuoteModal={() => handleOpenQuote("Solicitud Cierre Comercial")}
        onOpenDemoModal={() => handleOpenQuote("Demostración Cierre Comercial")}
      />

      {/* 9. Pie de Página Institucional */}
      <LandingFooter />
    </div>
  );
}
