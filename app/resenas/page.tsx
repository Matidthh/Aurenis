"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Code,
  Copy,
  Check,
  Send,
  Filter,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
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
  isFeatured: boolean;
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

export default function ResenasPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    averageRating: 5.0,
    verifiedCount: 0,
    satisfactionPercentage: 100,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("Todos");

  // Modal de nueva reseña
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

  // Snippet copy
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showApiDocs, setShowApiDocs] = useState(false);

  // Cargar reseñas desde API
  async function fetchReviews() {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  // Enviar nueva reseña
  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || formName.trim().length < 2) {
      setFormError("Por favor ingresa un nombre válido (mínimo 2 caracteres).");
      return;
    }
    if (!formTitle.trim() || formTitle.trim().length < 3) {
      setFormError("Por favor ingresa un título para tu reseña.");
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
          originSite: "aurenis-portal",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No fue posible guardar la reseña.");
      }

      setFormSuccess(true);
      // Limpiar formulario
      setFormName("");
      setFormEmail("");
      setFormTitle("");
      setFormComment("");
      setFormRating(5);
      await fetchReviews();

      setTimeout(() => {
        setFormSuccess(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al enviar la reseña.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Filtrado de reseñas
  const filteredReviews = reviews.filter((r) => {
    if (selectedRatingFilter !== null && r.rating !== selectedRatingFilter) {
      return false;
    }
    if (selectedRoleFilter !== "Todos" && !r.authorRole.toLowerCase().includes(selectedRoleFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const ratingTexts: Record<number, string> = {
    5: "Excelente • Superó expectativas",
    4: "Muy Bueno • Cumple cabalmente",
    3: "Bueno • Satisfactorio",
    2: "Regular • Requiere mejoras",
    1: "Deficiente • No recomendado",
  };

  const integrationCodeSnippet = `// Código para integrar en cualquier otra web (WordPress, React, HTML):
async function enviarResenaExterna() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://aurenis.cl";
  const respuesta = await fetch(\`\${baseUrl}/api/reviews\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      authorName: "Juan Pérez",
      authorRole: "Docente",
      institutionName: "Colegio Externo",
      rating: 5,
      title: "Excelente plataforma de gestión escolar",
      comment: "Funciona perfectamente conectado a nuestra web externa.",
      originSite: "wordpress-externo"
    })
  });
  const data = await respuesta.json();
  console.log("Reseña guardada en tabla wp_reviews:", data);
}`;

  function handleCopySnippet() {
    navigator.clipboard.writeText(integrationCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Volver a Aurenis</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2.5">
              <AurenisLogo className="w-8 h-8" showText={true} />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowApiDocs(!showApiDocs)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition shadow-2xs cursor-pointer"
            >
              <Code className="w-4 h-4 text-[#3B82F6]" />
              <span className="hidden sm:inline">Conectar a otra web</span>
              <span className="sm:hidden">API</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Dejar Reseña</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          CONTENIDO PRINCIPAL
          ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* HERO / TÍTULO DEL APARTADO */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Módulo de Reseñas y Testimonios • Tablas BBDD: wp_reviews</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Opiniones de la Comunidad Educativa
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Valoraciones verificadas de directivos, docentes, estudiantes, apoderados y supervisores ministeriales sobre el Libro de Clases Digital y la plataforma AURENIS.
          </p>
        </section>

        {/* PANEL EXPANDIBLE: GUÍA DE INTEGRACIÓN EXTERNA / OTRA WEB (WORDPRESS) */}
        <AnimatePresence>
          {showApiDocs && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                      <Code className="w-4 h-4" />
                      <span>Integración para Conectar a Otra Web o WordPress (API REST Pública)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Las tablas en base de datos están identificadas bajo el prefijo <code className="text-amber-400 font-mono">wp_reviews</code> y <code className="text-amber-400 font-mono">wp_review_comments</code> con soporte CORS abierto para peticiones remotas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition cursor-pointer shrink-0"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans font-semibold text-[11px] uppercase tracking-wider">
                      Endpoint de Lectura (GET)
                    </span>
                    <p className="text-emerald-400 break-all">
                      GET /api/reviews
                    </p>
                    <p className="text-slate-500 font-sans text-[11px]">
                      Retorna lista completa, desglose de estrellas y métricas agregadas.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-sans font-semibold text-[11px] uppercase tracking-wider">
                      Endpoint de Escritura (POST)
                    </span>
                    <p className="text-sky-400 break-all">
                      POST /api/reviews
                    </p>
                    <p className="text-slate-500 font-sans text-[11px]">
                      Inserta reseñas validadas directamente en la tabla <span className="text-amber-300">wp_reviews</span>.
                    </p>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 text-xs overflow-x-auto font-mono leading-relaxed border border-slate-800/80">
                  {integrationCodeSnippet}
                </pre>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* =========================================================================
            RESUMEN DE MÉTRICAS Y DESGLOSE DE CALIFICACIONES
            ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Columna Izquierda: Promedio Grande */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b lg:border-b-0 lg:border-r border-slate-200">
            <span className="text-5xl sm:text-6xl font-black text-[#0F172A] tracking-tight">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-5 h-5",
                    star <= Math.round(stats.averageRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Basado en {stats.total} {stats.total === 1 ? "reseña registrada" : "reseñas registradas"}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.satisfactionPercentage}% de recomendación positiva</span>
            </div>
          </div>

          {/* Columna Central: Barras de Distribución de Estrellas */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2 py-2">
            {[5, 4, 3, 2, 1].map((ratingNum) => {
              const count = stats.distribution[ratingNum] || 0;
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              const isSelected = selectedRatingFilter === ratingNum;

              return (
                <button
                  key={ratingNum}
                  type="button"
                  onClick={() =>
                    setSelectedRatingFilter(isSelected ? null : ratingNum)
                  }
                  className={cn(
                    "w-full flex items-center gap-3 text-xs text-left p-1 rounded-lg transition cursor-pointer hover:bg-slate-50",
                    isSelected && "bg-blue-50/60 font-semibold text-blue-900"
                  )}
                >
                  <span className="w-14 font-medium flex items-center gap-1 text-slate-700">
                    {ratingNum} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </span>

                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-12 text-right text-slate-500 text-[11px]">
                    {count} ({percentage}%)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Columna Derecha: Tarjetas KPI de Confianza */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-3 p-2 bg-slate-50/70 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#3B82F6] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">
                  {stats.verifiedCount} Verificadas
                </p>
                <p className="text-[11px] text-slate-500">Comunidad ministerial y escolar</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">Multi-Establecimiento</p>
                <p className="text-[11px] text-slate-500">Liceos TP, CH y Colegios</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0F172A]">Tabla wp_reviews</p>
                <p className="text-[11px] text-slate-500">Persistente en PostgreSQL / BBDD</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BARRA DE FILTROS POR ROL Y ESTRELLAS
            ========================================================================= */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Rol:</span>
            </span>

            {["Todos", "Docente", "Director", "Estudiante", "Apoderado", "Evaluador"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRoleFilter(role)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 border",
                  selectedRoleFilter === role
                    ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-2xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
            {selectedRatingFilter !== null && (
              <button
                type="button"
                onClick={() => setSelectedRatingFilter(null)}
                className="text-[#3B82F6] hover:underline font-semibold cursor-pointer"
              >
                Quitar filtro de {selectedRatingFilter}★
              </button>
            )}
            <span>Mostrando {filteredReviews.length} reseñas</span>
          </div>
        </section>

        {/* =========================================================================
            LISTADO DE RESEÑAS EN TARJETAS
            ========================================================================= */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Cargando reseñas desde wp_reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No se encontraron reseñas con los filtros seleccionados</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Intenta restablecer los filtros o sé el primero en publicar una nueva reseña para la comunidad.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedRatingFilter(null);
                setSelectedRoleFilter("Todos");
              }}
              className="text-xs font-semibold text-[#3B82F6] hover:underline cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Cabecera de la tarjeta: Autor, Estrellas y Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shadow-2xs shrink-0">
                        {item.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#0F172A] truncate">
                            {item.authorName}
                          </h4>
                          {item.isVerified && (
                            <span title="Reseña Verificada">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 truncate">
                          {item.authorRole} • {item.institutionName || "Establecimiento Escolar"}
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
                          "w-4 h-4",
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

                  {/* Título de la reseña */}
                  <h5 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {item.title}
                  </h5>

                  {/* Comentario */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.comment}
                  </p>
                </div>

                {/* Pie de la tarjeta: Fecha */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {item.id.slice(0, 10)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: DEJAR UNA NUEVA RESEÑA
          ========================================================================= */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Publicar Reseña Institucional</ModalTitle>
          <ModalDescription>
            Tu reseña se registrará en la base de datos (tabla <code className="font-mono text-blue-600">wp_reviews</code>) y estará disponible tanto localmente como para webs externas.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {formSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A]">¡Reseña registrada con éxito!</h4>
              <p className="text-xs text-slate-500">
                Se ha guardado en la tabla <code className="font-mono">wp_reviews</code> y ya es visible en la plataforma.
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

              {/* Selección de Estrellas */}
              <div className="space-y-1.5 text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Calificación General
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
                <p className="text-xs font-medium text-slate-500">
                  {ratingTexts[hoverRating || formRating]}
                </p>
              </div>

              {/* Nombre y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Nombre Completo *
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
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="usuario@colegio.cl"
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
                    Rol Escolar *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Docente">Docente / Profesor</option>
                    <option value="Director">Director / Equipo Directivo</option>
                    <option value="Estudiante">Estudiante / Alumno</option>
                    <option value="Apoderado">Apoderado / Familia</option>
                    <option value="Evaluador Externo">Evaluador / MINEDUC</option>
                    <option value="Comunidad Escolar">Otro Miembro de la Comunidad</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Institución Educativa
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Liceo Politécnico Marga Marga"
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  placeholder="Ej. Excelente velocidad y control de asistencia"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Comentario */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Comentario Detallado *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe tu experiencia con la plataforma, facilidad de uso o características destacadas..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
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
                      <span>Guardando en BBDD...</span>
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
    </div>
  );
}
