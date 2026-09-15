"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, CheckCircle2, Loader2, Send } from "lucide-react";

export function FinalCtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <section className="py-24 bg-[#F8F8F5] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        <div className="bg-blue-900 text-white rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          {/* Decorative background gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Comienza la transformación digital hoy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Lleva tu colegio al siguiente nivel con AURENIS
            </h2>

            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Únete a las instituciones que ya optimizaron su gestión académica, redujeron la carga administrativa y conectaron a toda su comunidad.
            </p>

            {submitted ? (
              <div className="bg-emerald-900/90 border border-emerald-700 text-emerald-200 p-6 rounded-2xl max-w-md mx-auto space-y-2 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-base text-white">¡Solicitud recibida con éxito!</h3>
                <p className="text-xs text-emerald-300">
                  Un asesor pedagógico se pondrá en contacto contigo en menos de 2 horas hábiles.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo institucional..."
                  className="w-full sm:flex-1 px-5 py-4 rounded-full bg-white/10 border border-blue-400/30 text-white placeholder:text-blue-200 text-sm focus:outline-none focus:bg-white/20 focus:border-white transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-white text-blue-900 hover:bg-blue-50 transition shadow-lg shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-900" />
                  ) : (
                    <>
                      <span>Agendar Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-blue-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sin compromiso inicial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Migración asistida de datos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Soporte 24/7</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
