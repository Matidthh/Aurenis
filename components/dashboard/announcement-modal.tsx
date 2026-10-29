"use client";

import React, { useState } from "react";
import { Send, Bell, Users, User, Building2, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  schoolName?: string;
  onSuccess?: (announcement: any) => void;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  authorName,
  schoolName = "Liceo Politécnico Marga Marga (LPMM)",
  onSuccess,
}: AnnouncementModalProps) {
  const [targetType, setTargetType] = useState<"STUDENT" | "COURSE" | "ALL_SCHOOL">("COURSE");
  const [targetId, setTargetId] = useState<string>("3° Medio E");
  const [category, setCategory] = useState<"Urgente" | "Académico" | "Institucional" | "Circular">("Institucional");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const coursesList = [
    "1° Medio A", "1° Medio B", "1° Medio C",
    "2° Medio A", "2° Medio B", "2° Medio C",
    "3° Medio A", "3° Medio C", "3° Medio D", "3° Medio E",
    "4° Medio A", "4° Medio C", "4° Medio D", "4° Medio E",
  ];

  const sampleStudents3E = [
    { id: "st-1", name: "Alejandra López (3° Medio E)", email: "lopezalecco@gmail.com" },
    { id: "st-2", name: "Miguel Sanhueza (3° Medio E)", email: "miguel2+sanhueza@gmail.com" },
    { id: "st-3", name: "Maithe Lobos (3° Medio E)", email: "Xulimai.lobos@gmail.com" },
    { id: "st-4", name: "Matías Vergara (3° Medio E)", email: "matiarelano602@gmail.com" },
    { id: "st-5", name: "Benjamín Ramírez (3° Medio E)", email: "benjaminramirez821292@gmail.com" },
    { id: "st-6", name: "Elías Schiller (3° Medio E)", email: "treintiseisytreintiseisanny8@gmail.com" },
    { id: "st-7", name: "María Figueroa (3° Medio E)", email: "Bunnyfunnytravel@gmail.com" },
    { id: "st-8", name: "Jessy Labraña (3° Medio E)", email: "jessylabraña5@gmail.com" },
    { id: "st-9", name: "Martín Ruiz (3° Medio E)", email: "marvizgasparcabrales@gmail.com" },
    { id: "st-10", name: "Christopher Ruiz (3° Medio E)", email: "niamexdxd@gmail.com" },
    { id: "st-11", name: "Vicente Ponce (3° Medio E)", email: "vixitoPoncefigueroa2009@gmail.com" },
    { id: "st-12", name: "Felipe Varas (3° Medio E)", email: "FELIPEVARALO12@GMAIL.COM" },
    { id: "st-13", name: "Giovanna Barcia (3° Medio E)", email: "manebarcia18@gmail.com" },
    { id: "st-14", name: "Elías Núñez (3° Medio E)", email: "en4832775@gmail.com" },
    { id: "st-15", name: "Sergio Vivanco (3° Medio E)", email: "sergiovivanco345@gmail.com" },
    { id: "st-16", name: "Diego Nuñez (3° Medio E)", email: "diegoking288@gmail.com" },
    { id: "st-17", name: "Jean Martínez (3° Medio E)", email: "jeancp7777m@gmail.com" },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const newAnn = {
        id: `ann-${Date.now()}`,
        title,
        content,
        category,
        targetType,
        targetName: targetType === "ALL_SCHOOL" ? "Todo el Liceo (LPMM)" : targetType === "COURSE" ? `Curso: ${targetId}` : `Alumno: ${targetId}`,
        author: authorName,
        date: "Justo ahora",
      };
      setSuccessMessage("¡Anuncio enviado y notificado con éxito!");
      if (onSuccess) onSuccess(newAnn);

      setTimeout(() => {
        setSuccessMessage(null);
        setTitle("");
        setContent("");
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Enviar Anuncio Oficial</h3>
              <p className="text-xs text-blue-100">Plataforma AURENIS • {schoolName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[75vh]">
          {successMessage ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{successMessage}</h4>
              <p className="text-sm text-slate-500">Los destinatarios recibirán la notificación instantánea en su portal.</p>
            </div>
          ) : (
            <>
              {/* Target Audience selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Destinatario del Anuncio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setTargetType("STUDENT"); setTargetId("Alejandra López (3° Medio E)"); }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                      targetType === "STUDENT"
                        ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <User className="w-5 h-5 mb-1 text-blue-600" />
                    1 Alumno
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTargetType("COURSE"); setTargetId("3° Medio E"); }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                      targetType === "COURSE"
                        ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Users className="w-5 h-5 mb-1 text-indigo-600" />
                    1 Curso
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTargetType("ALL_SCHOOL"); setTargetId("Todo el Liceo"); }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                      targetType === "ALL_SCHOOL"
                        ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Building2 className="w-5 h-5 mb-1 text-emerald-600" />
                    Todo el Liceo
                  </button>
                </div>
              </div>

              {/* Specific Target Selector */}
              {targetType === "COURSE" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Seleccionar Curso Destino
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {coursesList.map((c) => (
                      <option key={c} value={c}>
                        {c} {c === "3° Medio E" ? "⭐ (Curso con actualización 3°E)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === "STUDENT" && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Seleccionar Estudiante (3° Medio E y otros)
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {sampleStudents3E.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name} — {st.email}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === "ALL_SCHOOL" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Este anuncio será transmitido en tiempo real a todos los estudiantes, apoderados y docentes del Liceo Politécnico Marga Marga.</span>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Categoría del Comunicado
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Institucional", "Académico", "Urgente", "Circular"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer",
                        category === cat
                          ? cat === "Urgente"
                            ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                            : "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Título del Anuncio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Modificación de horario de taller o citación..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Mensaje Detallado
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escriba aquí el contenido oficial del comunicado..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <>Enviando anuncio...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Transmitir Anuncio
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
