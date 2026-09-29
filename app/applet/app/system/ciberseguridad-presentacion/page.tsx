import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CybersecurityPresentationModule } from "@/components/features/security/cybersecurity-presentation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Defensa de Ciberseguridad, STRIDE y OWASP — AURENIS",
  description:
    "Presentación oficial, modelo de amenazas STRIDE, defensas OWASP Top 10, esquema criptográfico Argon2id/bcrypt y demostración en vivo de bloqueo de accesos.",
};

export default function CybersecurityPresentationPage() {
  return (
    <Page>
      <PageHeader
        title="Defensa Técnica de Ciberseguridad & Modelado STRIDE"
        description="Diapositivas oficiales, mitigaciones OWASP Top 10, hashing seguro Argon2id/bcrypt, demostración en vivo de bloqueo de accesos y ensayo de sustentación."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Panel General", href: "/system/dashboard" },
              { label: "Seguridad y Auditoría", href: "/system/security" },
              { label: "Defensa STRIDE & OWASP" },
            ]}
          />
        }
      />

      <CybersecurityPresentationModule />
    </Page>
  );
}
