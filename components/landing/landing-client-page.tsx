"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { TestimonialsSocialProof } from "@/components/landing/testimonials-social-proof";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
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
      className="min-h-screen bg-[#F8F8F5] text-slate-900 selection:bg-blue-500 selection:text-white"
    >
      {/* 1. Header institucional y navegación principal */}
      <LandingNavbar
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 2. Hero Section con Pitch de Valor y Mini Dashboard Interactivo (Notas, Asistencia, Semáforo) */}
      <ReplicatedHero
        hideHeader={true}
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 3. Dolores del colegio vs Solución AURENIS */}
      <ProblemSolutionSection
        onOpenQuoteModal={(src) => handleOpenQuote(src || "Cotización desde Comparativa")}
        onOpenDemoModal={(src) => handleOpenQuote(src || "Demostración desde Comparativa")}
      />

      {/* 4. Planes y Precios Transparentes */}
      <PricingPlans
        onSelectPlan={(plan) => handleOpenQuote(plan)}
      />

      {/* 5. Casos de Éxito y Prueba Social */}
      <TestimonialsSocialProof />

      {/* 6. Preguntas Frecuentes */}
      <FaqSection />

      {/* 7. Llamado a la Acción Final */}
      <FinalCtaSection
        onOpenQuoteModal={() => handleOpenQuote("Solicitud Cierre Comercial")}
      />

      {/* 8. Pie de página institucional */}
      <LandingFooter />
    </div>
  );
}
