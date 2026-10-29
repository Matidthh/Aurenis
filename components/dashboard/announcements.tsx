"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Search,
  Filter,
  Users,
  User,
  Building2,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  AlertTriangle,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AnnouncementTargetType = "ALL" | "COURSE" | "STUDENT";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: "Urgente" | "Académico" | "Institucional" | "Circular" | "Asistencia" | "Notas";
  targetType: AnnouncementTargetType;
  targetName: string; // e.g. "Todo el Liceo", "3° Medio E", "Alejandra López"
  author: string;
  authorRole: string;
  date: string;
  timestamp: number;
  isRead: boolean;
  priority: "Alta" | "Media" | "Normal";
}

interface AnnouncementsProps {
  schoolSlug: string;
  userRole?: "ESTUDIANTE" | "DOCENTE" | "DIRECTIVO" | "APODERADO";
  userName?: string;
  onSelectAnnouncement?: (announcement: AnnouncementItem) => void;
}

const DEFAULT_LPMM_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Cierre de actas primer trimestre y periodo académico",
    content: "Recordatorio UTP: El ingreso formal de todas las calificaciones parciales correspondientes al primer trimestre culmina este viernes a las 18:00 hrs. Asegúrese de validar con la matriz Decreto 67.",
    category: "Urgente",
    targetType: "ALL",
    targetName: "Todo el Liceo (LPMM)",
    author: "Unidad Técnica Pedagógica (UTP)",
    authorRole: "Dirección Académica",
    date: "Hoy, 09:30",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    isRead: false,
    priority: "Alta",
  },
  {
    id: "ann-2",
    title: "Evaluación Sumativa Coef. 2: Bases de Datos Relacionales",
    content: "Estimados estudiantes de 3° Medio E: La prueba sumativa de normalización 3FN y consultas SQL avanzadas se realizará este jueves en el Laboratorio 2.",
    category: "Académico",
    targetType: "COURSE",
    targetName: "3° Medio E",
    author: "Prof. Julio Molina",
    authorRole: "Docente Especialidad Programación",
    date: "Ayer, 14:15",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    isRead: false,
    priority: "Alta",
  },
  {
    id: "ann-3",
    title: "Citación a Apoderado y Revisión de Ficha de Asistencia",
    content: "Se cita a reunión informativa respecto a los compromisos de asistencia MINEDUC (>85%) y planillas de evaluación formativa.",
    category: "Circular",
    targetType: "STUDENT",
    targetName: "Alejandra López (3° Medio E)",
    author: "Inspectoría General",
    authorRole: "Convivencia Escolar",
    date: "Hace 2 días",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    isRead: true,
    priority: "Media",
  },
  {
    id: "ann-4",
    title: "Habilitación de Asistencia Digital por Código QR",
    content: "Se encuentra disponible el módulo de asistencia con lectura de código QR activo en los laboratorios de especialidad para el registro automático y validación MINEDUC.",
    category: "Asistencia",
    targetType: "ALL",
    targetName: "Todo el Liceo (LPMM)",
    author: "Dirección LPMM",
    authorRole: "Administración",
    date: "Hace 3 días",
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    isRead: true,
    priority: "Normal",
  },
];

export function Announcements({
  schoolSlug,
  userRole = "ESTUDIANTE",
  userName = "Usuario AURENIS",
  onSelectAnnouncement,
}: AnnouncementsProps) {
  // Target Filter state: "ALL_TARGETS" | "ALL" | "COURSE" | "STUDENT"
  const [selectedTargetFilter, setSelectedTargetFilter] = useState<"ALL_TARGETS" | AnnouncementTargetType>("ALL_TARGETS");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState<boolean>(false);

  // Persistence Key for localStorage
  const storageKey = `aurenis_announcements_${schoolSlug}`;

  // Announcements state with persistence
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error("Error reading announcements from localStorage:", e);
      }
    }
    return DEFAULT_LPMM_ANNOUNCEMENTS;
  });

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(announcements));
      } catch (e) {
        console.error("Error saving announcements to localStorage:", e);
      }
    }
  }, [announcements, storageKey]);

  // Can post check (Teachers, Directors, Staff)
  const canPost = userRole === "DOCENTE" || userRole === "DIRECTIVO" || userRole === "APODERADO";

  // Post new announcement
  const handlePostAnnouncement = (newAnn: {
    title: string;
    content: string;
    category: AnnouncementItem["category"];
    targetType: AnnouncementTargetType;
    targetName: string;
    priority: "Alta" | "Media" | "Normal";
  }) => {
    const item: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: newAnn.title,
      content: newAnn.content,
      category: newAnn.category,
      targetType: newAnn.targetType,
      targetName: newAnn.targetName,
      author: userName,
      authorRole: userRole === "DIRECTIVO" ? "Equipo Directivo UTP" : "Docente de Asignatura",
      date: "Justo ahora",
      timestamp: Date.now(),
      isRead: false,
      priority: newAnn.priority,
    };

    setAnnouncements((prev) => [item, ...prev]);
    setIsPostingModalOpen(false);
  };

  // Filtered list
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      // Filter by Target
      const matchesTarget =
        selectedTargetFilter === "ALL_TARGETS" || ann.targetType === selectedTargetFilter;

      // Filter by Course if applicable
      const matchesCourse =
        selectedCourseFilter === "ALL" ||
        ann.targetName.toLowerCase().includes(selectedCourseFilter.toLowerCase());

      // Filter by Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        ann.title.toLowerCase().includes(query) ||
        ann.content.toLowerCase().includes(query) ||
        ann.author.toLowerCase().includes(query) ||
        ann.targetName.toLowerCase().includes(query);

      return matchesTarget && matchesCourse && matchesSearch;
    });
  }, [announcements, selectedTargetFilter, selectedCourseFilter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header & Post Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0C1425] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Tablón de Anuncios y Comunicados LPMM
            </h3>
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
              Estado Persistente
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualiza comunicados dirigidos a Todo el Liceo, Cursos específicos (como 3° Medio E) o Alumnos individuales.
          </p>
        </div>

        {canPost && (
          <button
            type="button"
            onClick={() => setIsPostingModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Anuncio</span>
          </button>
        )}
      </div>

      {/* Target Filtering Tabs */}
      <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Filtrar Destino:
            </span>

            <button
              type="button"
              onClick={() => setSelectedTargetFilter("ALL_TARGETS")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                selectedTargetFilter === "ALL_TARGETS"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Todos los Destinos</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTargetFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                selectedTargetFilter === "ALL"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Todo el Liceo</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTargetFilter("COURSE")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                selectedTargetFilter === "COURSE"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Cursos Especificos</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTargetFilter("STUDENT")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                selectedTargetFilter === "STUDENT"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              <User className="w-3.5 h-3.5" />
              <span>1 Alumno</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en anuncios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-400 text-xs space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No hay anuncios que coincidan con el filtro de destino seleccionado.</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                window.location.hash = `notifications/view/${item.id}`;
                if (onSelectAnnouncement) onSelectAnnouncement(item);
              }}
              className="bg-white dark:bg-[#0C1425] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all cursor-pointer group shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Target Badge */}
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border flex items-center gap-1",
                        item.targetType === "ALL"
                          ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                          : item.targetType === "COURSE"
                          ? "text-indigo-600 bg-indigo-500/10 border-indigo-500/30"
                          : "text-purple-600 bg-purple-500/10 border-purple-500/30"
                      )}
                    >
                      {item.targetType === "ALL" && <Building2 className="w-3 h-3" />}
                      {item.targetType === "COURSE" && <Users className="w-3 h-3" />}
                      {item.targetType === "STUDENT" && <User className="w-3 h-3" />}
                      <span>{item.targetName}</span>
                    </span>

                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Publicado por: <strong className="text-slate-800 dark:text-slate-200">{item.author}</strong> ({item.authorRole})</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Leer aviso <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Posting Announcements */}
      {isPostingModalOpen && (
        <PostAnnouncementModal
          isOpen={isPostingModalOpen}
          onClose={() => setIsPostingModalOpen(false)}
          authorName={userName}
          onPost={handlePostAnnouncement}
        />
      )}
    </div>
  );
}

{/* Post Announcement Modal Component */}
function PostAnnouncementModal({
  isOpen,
  onClose,
  authorName,
  onPost,
}: {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  onPost: (data: {
    title: string;
    content: string;
    category: AnnouncementItem["category"];
    targetType: AnnouncementTargetType;
    targetName: string;
    priority: "Alta" | "Media" | "Normal";
  }) => void;
}) {
  const [targetType, setTargetType] = useState<AnnouncementTargetType>("COURSE");
  const [targetName, setTargetName] = useState<string>("3° Medio E");
  const [category, setCategory] = useState<AnnouncementItem["category"]>("Institucional");
  const [priority, setPriority] = useState<"Alta" | "Media" | "Normal">("Normal");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let finalTargetName = targetName;
    if (targetType === "ALL") finalTargetName = "Todo el Liceo (LPMM)";

    onPost({
      title,
      content,
      category,
      targetType,
      targetName: finalTargetName,
      priority,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0C1425] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-cyan-300" />
            <h3 className="font-black text-base">Publicar Anuncio Oficial</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Destinatario del Anuncio
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setTargetType("STUDENT"); setTargetName("Alejandra López (3° Medio E)"); }}
                className={cn(
                  "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition",
                  targetType === "STUDENT"
                    ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <User className="w-4 h-4 text-purple-600" />
                1 Alumno
              </button>

              <button
                type="button"
                onClick={() => { setTargetType("COURSE"); setTargetName("3° Medio E"); }}
                className={cn(
                  "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition",
                  targetType === "COURSE"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <Users className="w-4 h-4 text-indigo-600" />
                1 Curso
              </button>

              <button
                type="button"
                onClick={() => { setTargetType("ALL"); setTargetName("Todo el Liceo (LPMM)"); }}
                className={cn(
                  "p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition",
                  targetType === "ALL"
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Todo el Liceo
              </button>
            </div>
          </div>

          {targetType === "COURSE" && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Seleccionar Curso
              </label>
              <select
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                {["1° Medio A", "1° Medio B", "2° Medio A", "3° Medio E", "4° Medio E"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {targetType === "STUDENT" && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Seleccionar Estudiante
              </label>
              <select
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                {[
                  "Alejandra López (3° Medio E)",
                  "Miguel Sanhueza (3° Medio E)",
                  "Maithe Lobos (3° Medio E)",
                  "Matías Vergara (3° Medio E)",
                  "Benjamín Ramírez (3° Medio E)",
                ].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Título del Anuncio
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Evaluación Coef. 2 o Citación a reunión..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Contenido del Mensaje
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detalle el contenido oficial del comunicado..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Anuncio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
