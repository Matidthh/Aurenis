"use client";

import { Building2, Mail, Phone, ArrowRight } from "lucide-react";

export function ContactSection() {
  return (
    <section className="relative py-24 bg-[#F8F8F5]" id="contacto">
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[128px] opacity-70 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                Contrata Aurenis
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Lleva la innovación digital a tu institución
              </h2>
              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Agenda una demostración personalizada con nuestro equipo y descubre cómo Aurenis puede transformar la gestión académica y administrativa de tu colegio o liceo.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Oficina Central</h4>
                  <p className="text-sm text-slate-500">Av. Providencia 1208, Santiago, Chile</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Correo Comercial</h4>
                  <p className="text-sm text-slate-500">contacto@aurenis.cl</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Teléfono</h4>
                  <p className="text-sm text-slate-500">+56 2 2345 6789</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Solicitar información</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="school" className="text-sm font-medium text-slate-700">Institución</label>
                  <input
                    type="text"
                    id="school"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
                    placeholder="Colegio San José"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Correo institucional</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
                  placeholder="director@colegio.cl"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Mensaje o requerimiento</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm resize-none"
                  placeholder="Cuéntanos sobre las necesidades de tu establecimiento..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Enviar solicitud</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                Nos pondremos en contacto contigo en un plazo máximo de 24 horas hábiles.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
