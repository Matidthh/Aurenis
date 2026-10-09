"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { InstitutionalStats } from "@/components/landing/institutional-stats";
import { PortalsByRole } from "@/components/landing/portals-by-role";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { HowWeMigrateSection } from "@/components/landing/how-we-migrate-section";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { LandingReviewsSection } from "@/components/landing/landing-reviews-section";
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
      className="min-h-screen bg-[#F8F8F5] text-slate-900 selection:bg-blue-500 selection:text-white pt-[68px] sm:pt-[76px]"
    >
      {/* 1. Header Institucional Fijo y Persistente */}
      <LandingNavbar
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 2. Hero Section: Headline de Impacto + CTAs + Mockup Interactivo */}
      <ReplicatedHero
        hideHeader={true}
        onOpenQuoteModal={() => handleOpenQuote()}
        onOpenDemoModal={() => handleOpenQuote()}
      />

      {/* 3. Barra de Métricas y Capacidades Técnicas (Trust Strip) */}
      <InstitutionalStats />

      {/* 4. Demostración de Producto por Roles: Directivo/UTP, Docente, Alumno, Apoderado */}
      <PortalsByRole />

      {/* 5. Pilares Esenciales de Gestión y Cumplimiento Normativo */}
      <ProblemSolutionSection
        onOpenQuoteModal={(src) => handleOpenQuote(src || "Cotización desde Pilares")}
        onOpenDemoModal={(src) => handleOpenQuote(src || "Demostración desde Pilares")}
      />

      {/* 6. Protocolo de Migración Rápida en 48 Horas */}
      <HowWeMigrateSection />

      {/* 7. Planes y Precios Transparentes */}
      <PricingPlans
        onSelectPlan={(plan) => handleOpenQuote(plan)}
      />

      {/* 8. Reseñas y Testimonios de la Comunidad (Tablas BBDD: wp_reviews) */}
      <LandingReviewsSection />

      {/* 9. Preguntas Frecuentes - Derribo de Objeciones */}
      <FaqSection />

      {/* 9. Llamado a la Acción Final y Cierre Comercial */}
      <FinalCtaSection
        onOpenQuoteModal={() => handleOpenQuote("Solicitud Cierre Comercial")}
        onOpenDemoModal={() => handleOpenQuote("Demostración Cierre Comercial")}
      />

      {/* 10. Pie de Página Institucional */}
      <LandingFooter />
    </div>
  );
}
