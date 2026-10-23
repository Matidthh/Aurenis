"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { InstitutionalStats } from "@/components/landing/institutional-stats";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
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

      {/* 4. Pilares Esenciales de Gestión y Cumplimiento Normativo */}
      <ProblemSolutionSection
        onOpenQuoteModal={(src) => handleOpenQuote(src || "Cotización desde Pilares")}
        onOpenDemoModal={(src) => handleOpenQuote(src || "Demostración desde Pilares")}
      />

      {/* 5. Pie de Página Institucional */}
      <LandingFooter />
    </div>
  );
}
