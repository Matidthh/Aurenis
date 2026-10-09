"use client";

import React, { useState } from "react";
import {
  Calendar,
  FileText,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  School,
  Mail,
  User,
  Check,
  Building2,
} from "lucide-react";
import { getBookingUrl } from "@/lib/booking";

interface FinalCtaSectionProps {
  onOpenQuoteModal?: () => void;
  onOpenDemoModal?: () => void;
}

export function FinalCtaSection({
  onOpenQuoteModal,
  onOpenDemoModal,
}: FinalCtaSectionProps = {}) {
  const [tab, setTab] = useState<"demo" | "quote">("demo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    if (tab === "quote" && onOpenQuoteModal) {
      setLoading(false);
      onOpenQuoteModal();
      return;
    }

    if (tab === "demo" && onOpenDemoModal) {
      setLoading(false);
      onOpenDemoModal();
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);

      const subject =
        tab === "demo"
          ? `Demostración Aurenis - ${school || "Colegio"} (${name || "Directivo"})`
          : `Cotización Formal Aurenis - ${school || "Colegio"}`;

      const bookingUrl = getBookingUrl(`${subject} [${email}]`);

      if (typeof window !== "undefined") {
        if (bookingUrl.startsWith("mailto:")) {
          window.location.href = bookingUrl;
        } else {
          window.open(bookingUrl, "_blank", "noopener,noreferrer");
        }
      }
    }, 600);
  }

  return (
    <section
      id="contacto"
      suppressHydrationWarning
      className="py-16 sm:py-24 bg-[#F8F8F5] text-slate-900 relative"
    >
      <div className="max-w-[820px] mx-auto px-4 sm:px-6">
        
        {/* Tarjeta Centralizada de Alta Fidelidad */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-8 sm:p-12 text-center space-y-7 relative overflow-hidden">
          
          {/* Acento superior sutil */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          {/* Encabezado Centralizado */}
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Demostración Guiada</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Comienza a modernizar tu colegio hoy
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Coordina una videollamada de 20 minutos con tu equipo directivo y docente para ver AURENIS en acción con la realidad de tu establecimiento.
            </p>
          </div>

          {/* Selector Centralizado: Demostración vs Cotización */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl max-w-md mx-auto w-full sm:w-auto border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setTab("demo");
                setSubmitted(false);
              }}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === "demo"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Agendar Videollamada</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("quote");
                setSubmitted(false);
              }}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === "quote"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Cotización Formal</span>
            </button>
          </div>

          {/* Estado de Éxito / Confirmación */}
          {submitted ? (
            <div className="py-6 max-w-md mx-auto space-y-3 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {tab === "demo" ? "¡Videollamada Solicitada!" : "¡Solicitud Registrada!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hemos recibido tu solicitud para <strong>{school || "tu establecimiento"}</strong>. Te contactaremos a <strong>{email}</strong> en menos de 2 horas hábiles.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer pt-2"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            /* Formulario Centralizado Ordenado */
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Campo: Nombre y Cargo */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Nombre y Cargo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Directora María Paz"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                    />
                  </div>
                </div>

                {/* Campo: Establecimiento o RBD */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Colegio o RBD
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Ej: Colegio San José"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Campo: Correo Institucional (Ancho completo) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Correo Electrónico Institucional <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="director@colegio.cl"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-none"
                  />
                </div>
              </div>

              {/* Botón Principal */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all cursor-pointer min-h-[46px] disabled:opacity-70"
                >
                  {loading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <span>
                        {tab === "demo" ? "Confirmar Videollamada Guiada" : "Solicitar Cotización Oficial"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Garantías y Confianza en una sola línea ordenada */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Gratuito y sin compromiso
            </span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Respuesta en &lt; 2 hrs hábiles
            </span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-purple-600" />
              Conforme Decreto 67 &amp; Circular 30
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
