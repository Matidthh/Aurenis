"use client";

import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, ArrowRight, Loader2, Phone, Building2, User, Mail, MessageSquare, ShieldCheck } from "lucide-react";

interface CommercialQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export function CommercialQuoteModal({ isOpen, onClose, defaultPlan }: CommercialQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    rbd: "",
    role: "director",
    studentsCount: "200 - 500 alumnos",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string>("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          schoolName: formData.school,
          rbd: formData.rbd || undefined,
          role: formData.role,
          studentCount: formData.studentsCount,
          requestedPlan: defaultPlan || "General",
          message: formData.notes || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "No fue posible procesar la solicitud.");
      }

      setReferenceId(json.data?.referenceId || `AUR-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error inesperado de conexión");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenWhatsApp() {
    const text = encodeURIComponent(
      `Hola equipo comercial AURENIS, me interesa agendar una demostración y cotización para el colegio "${formData.school || "nuestra institución"}". Mi nombre es ${formData.name || "un directivo interesado"}.`
    );
    window.open(`https://wa.me/56912345678?text=${text}`, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                ¡Solicitud de Demostración Registrada!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Muchas gracias <strong className="text-slate-900">{formData.name}</strong>. Hemos registrado tu requerimiento para el establecimiento <strong className="text-slate-900">{formData.school || "indicado"}</strong>.
              </p>
              {referenceId && (
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-700">
                  Código de seguimiento: {referenceId}
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Próximos pasos de la coordinación:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                <li>Contacto por correo o WhatsApp para agendar la sesión interactiva</li>
                <li>Presentación de módulos adaptada a los niveles y cursos del colegio</li>
                <li>Entrega de cotización formal para rendición o presupuesto interno</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition"
              >
                Entendido
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Demostración Guiada y Cotización
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Coordina una demostración para tu colegio
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ingresa los datos de tu establecimiento para coordinar una sesión personalizada y conocer el flujo de trabajo en vivo.
              </p>
              {defaultPlan && (
                <div className="mt-2 text-xs font-bold text-blue-600 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl inline-block">
                  Interesado en: {defaultPlan}
                </div>
              )}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                  {errorMessage}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Carolina Sepúlveda"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Nombre del Colegio / Red *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="Ej. Colegio Santa María"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Correo Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="directora@colegio.cl"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9 8765 4321"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tu Rol en el Colegio</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  >
                    <option value="Director / Equipo Directivo">Director / Equipo Directivo</option>
                    <option value="Sostenedor / Representante Legal">Sostenedor / Representante Legal</option>
                    <option value="Jefe UTP / Coordinador Académico">Jefe UTP / Coordinador Académico</option>
                    <option value="Inspector General">Inspector General</option>
                    <option value="Docente / Profesor Jefe">Docente / Profesor Jefe</option>
                    <option value="Encargado de Informática">Encargado de Informática</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Matrícula Estimada</label>
                  <select
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm transition"
                  >
                    <option value="Menos de 200 alumnos">Menos de 200 alumnos</option>
                    <option value="200 - 500 alumnos">200 - 500 alumnos</option>
                    <option value="500 - 1.000 alumnos">500 - 1.000 alumnos</option>
                    <option value="Más de 1.000 alumnos">Más de 1.000 alumnos (Multi-Sede / Red)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Comentarios o sistema actual (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej: Usamos planillas Excel y queremos pasar a Libro Digital oficial Circular 30..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm resize-none transition"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Solicitar Propuesta y Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Chatear por WhatsApp</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                🔒 Sin compromisos de permanencia. Confidencialidad y protección de datos conforme a ley 19.628.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
