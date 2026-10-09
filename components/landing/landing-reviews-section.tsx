"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils/cn";

interface ReviewItem {
  id: string;
  authorName: string;
  authorEmail?: string | null;
  authorRole: string;
  institutionName?: string | null;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  originSite: string;
  createdAt: string;
}

interface ReviewStats {
  total: number;
  averageRating: number;
  verifiedCount: number;
  satisfactionPercentage: number;
  distribution: Record<number, number>;
}

export function LandingReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 5,
    averageRating: 4.8,
    verifiedCount: 5,
    satisfactionPercentage: 100,
    distribution: { 5: 4, 4: 1, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("Docente");
  const [formInstitution, setFormInstitution] = useState("Liceo Politécnico Marga Marga");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  async function loadReviews() {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?take=6");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Error cargando reseñas en Home:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || formName.trim().length < 2) {
      setFormError("Por favor ingresa un nombre válido.");
      return;
    }
    if (!formTitle.trim() || formTitle.trim().length < 3) {
      setFormError("Por favor ingresa un título.");
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 5) {
      setFormError("El comentario debe contener al menos 5 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: formName.trim(),
          authorEmail: formEmail.trim() || undefined,
          authorRole: formRole,
          institutionName: formInstitution.trim() || undefined,
          rating: formRating,
          title: formTitle.trim(),
          comment: formComment.trim(),
          originSite: "aurenis-home",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al registrar la reseña.");
      }

      setFormSuccess(true);
      setFormName("");
      setFormEmail("");
      setFormTitle("");
      setFormComment("");
      setFormRating(5);
      await loadReviews();

      setTimeout(() => {
        setFormSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al enviar reseña.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="resenas" className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
        {/* ENCABEZADO DE LA SECCIÓN EN EL HOME */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reseñas de la Comunidad • Tablas BBDD: wp_reviews</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Testimonios y Experiencias Reales
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Conoce las opiniones y valoraciones de directores, docentes, estudiantes y evaluadores ministeriales que utilizan AURENIS para su gestión escolar diaria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dejar Reseña</span>
            </button>

            <Link
              href="/resenas"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
            >
              <span>Ver todas y Conectar API</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* BARRA RESUMEN DE CALIFICACIÓN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-black text-[#0F172A]">
              {stats.averageRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-500 font-medium mt-0.5">
                Promedio de {stats.total} opiniones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-[#0F172A]">{stats.satisfactionPercentage}% Satisfacción</p>
              <p className="text-slate-500 text-[11px]">Recomendado por colegios y liceos TP</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-[#0F172A]">{stats.verifiedCount} Reseñas Verificadas</p>
              <p className="text-slate-500 text-[11px]">Persistencia directa en tabla <code className="font-mono text-blue-600">wp_reviews</code></p>
            </div>
          </div>
        </div>

        {/* TARJETAS DE RESEÑAS EN EL HOME */}
        {loading ? (
          <div className="py-12 flex justify-center items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Cargando testimonios de la comunidad...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {item.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#0F172A] truncate">
                            {item.authorName}
                          </h4>
                          {item.isVerified && (
                            <span title="Verificada">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 truncate">
                          {item.authorRole} • {item.institutionName || "Comunidad Escolar"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                      {item.originSite === "wordpress-externo" ? "WordPress" : "Aurenis"}
                    </span>
                  </div>

                  {/* Estrellas */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-3.5 h-3.5",
                          s <= item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        )}
                      />
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-1.5">
                      {item.rating}.0
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {item.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                    {item.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    BBDD: wp_reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BANNER CTA INFERIOR HACIA LA PÁGINA COMPLETA / API */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0F172A]">
              ¿Deseas conectar este sistema de reseñas a otra página web o WordPress?
            </h4>
            <p className="text-xs text-slate-600">
              Contamos con API REST abierta (<code className="font-mono text-blue-700 font-semibold">GET & POST /api/reviews</code>) con soporte CORS para enviar y leer reseñas remotas.
            </p>
          </div>

          <Link
            href="/resenas"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition shrink-0"
          >
            <span>Ver Documentación de Conexión</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* MODAL PARA PUBLICAR RESEÑA DESDE EL HOME */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Publicar Reseña en Aurenis</ModalTitle>
          <ModalDescription>
            Se guardará en la tabla de base de datos <code className="font-mono text-blue-600">wp_reviews</code> y se reflejará de inmediato en el Home.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {formSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">¡Reseña guardada exitosamente!</h4>
              <p className="text-xs text-slate-500">
                La tabla <code className="font-mono">wp_reviews</code> ha registrado tu valoración.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Selector de Estrellas */}
              <div className="space-y-1.5 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Calificación
                </label>
                <div className="flex items-center justify-center gap-2 my-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormRating(s)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7",
                          s <= (hoverRating || formRating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rodrigo Castro"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Correo (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="docente@colegio.cl"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Rol e Institución */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Rol *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Docente">Docente / Profesor</option>
                    <option value="Director">Director / Equipo Directivo</option>
                    <option value="Estudiante">Estudiante / Alumno</option>
                    <option value="Apoderado">Apoderado / Familia</option>
                    <option value="Evaluador Externo">Evaluador Externo / MINEDUC</option>
                    <option value="Comunidad Escolar">Otro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Colegio / Institución
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Liceo Politécnico Marga Marga"
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Título */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Título de la Reseña *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Registro de asistencia rápido y confiable"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Comentario */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Comentario *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe tu opinión sobre el sistema..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      <span>Publicar Reseña</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </ModalBody>
      </Modal>
    </section>
  );
}
