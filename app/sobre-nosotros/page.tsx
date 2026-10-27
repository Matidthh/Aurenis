import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";

export const metadata: Metadata = {
  title: "Sobre Nosotros — Equipo & Misión",
  description:
    "Conoce al equipo técnico detrás de AURENIS: cuatro desarrolladores formados en la educación técnico-profesional chilena (Liceo Politécnico Marga Marga) liderados por Maicol Recabarren Cerda.",
  openGraph: {
    title: "Sobre Nosotros — AURENIS",
    description:
      "El equipo humano y técnico detrás de la plataforma de gestión escolar más avanzada y conforme a normativa de Chile.",
  },
};

export default function SobreNosotrosPage() {
  return <AboutPageContent />;
}
