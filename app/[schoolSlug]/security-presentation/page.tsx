import React from "react";
import { SecurityPresentationDeck } from "@/components/security/security-presentation-deck";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Defensa de Ciberseguridad — STRIDE, OWASP y Hashing Seguro | AURENIS",
  description: "Presentación técnica interactiva, modelado de amenazas STRIDE, defensas OWASP Top 10 y criptografía aplicada en AURENIS SaaS.",
};

export default function SecurityPresentationPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 text-slate-100">
      <SecurityPresentationDeck />
    </div>
  );
}
