"use client";

export const dynamic = 'force-dynamic';

import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { SystemFeaturesGrid } from "@/components/landing/system-features-grid";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section";
import { SecuritySection } from "@/components/landing/security-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { TargetAudienceSection } from "@/components/landing/target-audience-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { PortalsByRole } from "@/components/landing/portals-by-role";
import { InstitutionalStats } from "@/components/landing/institutional-stats";
import { FaqSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* 1. Navbar & Hero */}
      <ReplicatedHero />

      {/* 2. Problema → Solución */}
      <ProblemSolutionSection />

      {/* 3. Características */}
      <SystemFeaturesGrid />

      {/* 4. Cómo funciona */}
      <HowItWorksSection />

      {/* 5. Dashboard Preview */}
      <DashboardPreviewSection />

      {/* 6. Seguridad */}
      <SecuritySection />

      {/* 7. Beneficios */}
      <BenefitsSection />

      {/* 8. Para quién es AURENIS */}
      <TargetAudienceSection />

      {/* Portals & Stats additional context */}
      <PortalsByRole />
      <InstitutionalStats />

      {/* 9. CTA Final */}
      <FinalCtaSection />

      <FaqSection />

      {/* 10. Footer */}
      <LandingFooter />
    </div>
  );
}

