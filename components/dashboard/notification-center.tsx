"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Building2,
  BookOpen,
  User,
  ArrowRight,
  ExternalLink,
  Check,
  X,
  Sparkles,
  Inbox,
  ShieldCheck,
  ChevronRight,
  Clock,
  Send,
  MessageCircle,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Announcements, AnnouncementItem } from "./announcements";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  category: "Urgente" | "Académico" | "Institucional" | "Circular" | "Asistencia" | "Notas";
  author: string;
  authorRole: string;
  date: string;
  isRead: boolean;
  targetAudience: "ESTUDIANTE" | "DOCENTE" | "TODOS";
  priority: "Alta" | "Media" | "Normal";
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  schoolSlug: string;
  userRole?: "ESTUDIANTE" | "DOCENTE" | "DIRECTIVO" | "APODERADO";
  userName?: string;
}

export function NotificationCenter({
  schoolSlug,
  userRole = "ESTUDIANTE",
  userName = "Usuario AURENIS",
}: NotificationCenterProps) {
  // Sub-view mode: "announcements" | "notifications"
  const [activeSubView, setActiveSubView] = useState<"announcements" | "notifications">("announcements");
  
  // HashRouter-like state pattern using window.location.hash
  const [currentHash, setCurrentHash] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("TODOS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>("ann-1");

  // Notifications state with initial data for LPMM
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "ann-1",
      title: "Cierre de actas primer trimestre y periodo académico",
      content: "Recordatorio UTP: El ingreso formal de todas las calificaciones parciales correspondientes al primer trimestre culmina este viernes a las 18:00 hrs. Asegúrese de validar con la matriz Decreto 67.",
      category: "Urgente",
      author: "Unidad Técnica Pedagógica (UTP)",
      authorRole: "Dirección Académica LPMM",
      date: "Hoy, 09:30",
      isRead: false,
      targetAudience: "TODOS",
      priority: "Alta",
      actionUrl: `/${schoolSlug}/grades`,
      actionLabel: "Ver Matriz de Notas",
    },
    {
      id: "ann-2",
      title: "Habilitación de Asistencia Digital por Código QR",
      content: "Se encuentra disponible el módulo de asistencia con lectura de código QR activo en los laboratorios de especialidad para el registro automático y validación MINEDUC.",
      category: "Asistencia",
      author: "Inspectoría General",
      authorRole: "Convivencia & Asistencia",
      date: "Ayer, 14:15",
      isRead: false,
      targetAudience: "TODOS",
      priority: "Media",
      actionUrl: `/${schoolSlug}/attendance`,
      actionLabel: "Abrir Escáner QR",
    },
    {
      id: "ann-3",
      title: "Evaluación Sumativa Coef. 2: Base de Datos Relacionales",
      content: "Estimados estudiantes de 3° Medio E: La evaluación práctica de normalización 3FN y sentencias SQL avanzadas se realizará este jueves en el Laboratorio de Computación 2.",
      category: "Académico",
      author: "Prof. Julio Molina",
      authorRole: "Docente Especialidad Programación",
      date: "Hace 2 días",
      isRead: true,
      targetAudience: "ESTUDIANTE",
      priority: "Alta",
    },
    {
      id: "ann-4",
      title: "Circular N.° 482: Protocolos de Convivencia y Buen Trato",
      content: "Conforme a las normativas vigentes sobre protección de derechos de NNA, se recuerda a la comunidad escolar los canales de mediación formativa y apoyo psicosocial.",
      category: "Institucional",
      author: "Dirección General LPMM",
      authorRole: "Dirección Establecimiento",
      date: "Hace 3 días",
      isRead: true,
      targetAudience: "TODOS",
      priority: "Normal",
    },
    {
      id: "ann-5",
      title: "Publicación de Calificaciones Parciales: Módulo POO",
      content: "Se han ingresado oficialmente las notas del Taller Práctico N°3 de Clases, Métodos y Herencia. Puede revisar su promedio actualizado en el portal.",
      category: "Notas",
      author: "Prof. Eduardo Soto",
      authorRole: "Docente Especialidad",
      date: "Hace 4 días",
      isRead: true,
      targetAudience: "ESTUDIANTE",
      priority: "Media",
    },
  ]);

  // HashRouter Listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "announcements";
      setCurrentHash(hash);

      if (hash.startsWith("notifications/view/")) {
        const id = hash.split("/")[2];
        if (id) setSelectedNotificationId(id);
      } else if (hash.includes("notifications")) {
        setActiveSubView("notifications");
      } else {
        setActiveSubView("announcements");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const updateHash = (newHash: string) => {
    window.location.hash = newHash;
    setCurrentHash(newHash);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesCategory =
        selectedCategory === "TODOS" || n.category === selectedCategory;
      const matchesSearch =
        !query ||
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.author.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [notifications, selectedCategory, searchQuery]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const selectedNotification = useMemo(() => {
    return (
      notifications.find((n) => n.id === selectedNotificationId) ||
      notifications[0]
    );
  }, [notifications, selectedNotificationId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <Bell className="w-3.5 h-3.5 text-cyan-300" />
            <span>Centro de Notificaciones & Anuncios AURENIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hola, {userName} 👋
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Canal oficial de comunicados, alertas UTP, avisos docentes y circulares del Liceo Politécnico Marga Marga.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
            <span className="block text-2xl font-black">{unreadCount}</span>
            <span className="text-[10px] uppercase font-bold text-blue-200">No leídas</span>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-4 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl text-xs font-extrabold shadow-md transition-all cursor-pointer"
          >
            Marcar todas leídas
          </button>
        </div>
      </div>

      {/* Sub-view Tab Switcher */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0C1425] rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveSubView("announcements");
              updateHash("announcements");
            }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer",
              activeSubView === "announcements"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Megaphone className="w-4 h-4 text-amber-300" />
            <span>Anuncios por Destino (Alumno, Curso, Liceo)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubView("notifications");
              updateHash("notifications");
            }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer",
              activeSubView === "notifications"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Inbox className="w-4 h-4 text-cyan-300" />
            <span>Alertas y Registro de Avisos</span>
          </button>
        </div>

        <div className="hidden sm:block text-[10px] font-mono text-slate-400">
          Hash: #{currentHash || "announcements"}
        </div>
      </div>

      {/* Render SubView */}
      {activeSubView === "announcements" ? (
        <Announcements
          schoolSlug={schoolSlug}
          userRole={userRole}
          userName={userName}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters & Search */}
            <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {["TODOS", "Urgente", "Académico", "Institucional", "Circular", "Asistencia", "Notas"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                        selectedCategory === cat
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-end sm:self-auto shrink-0">
                  HashRoute: #{currentHash || "notifications"}
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, contenido o emisor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List items */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">No hay notificaciones en esta categoría</h4>
                  <p className="text-xs text-slate-500">Intenta cambiando el filtro o borrando la búsqueda.</p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const isSelected = selectedNotificationId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedNotificationId(item.id);
                        markAsRead(item.id);
                        updateHash(`notifications/view/${item.id}`);
                      }}
                      className={cn(
                        "bg-white dark:bg-[#0C1425] rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group",
                        !item.isRead
                          ? "border-blue-500/60 shadow-md shadow-blue-500/5 bg-blue-50/30 dark:bg-blue-950/20"
                          : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
                        isSelected && "ring-2 ring-blue-600"
                      )}
                    >
                      {!item.isRead && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border",
                              item.category === "Urgente"
                                ? "text-rose-600 bg-rose-500/10 border-rose-500/30"
                                : item.category === "Académico"
                                ? "text-blue-600 bg-blue-500/10 border-blue-500/30"
                                : item.category === "Institucional"
                                ? "text-indigo-600 bg-indigo-500/10 border-indigo-500/30"
                                : "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                            )}
                          >
                            {item.category}
                          </span>

                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.content}
                        </p>

                        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 mt-3">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.author} <span className="text-[10px] font-normal text-slate-400">({item.authorRole})</span>
                          </span>
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Detalles <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Detail View */}
          <div>
            {selectedNotification ? (
              <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs sticky top-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Detalle del Anuncio
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    ID: {selectedNotification.id}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                      {selectedNotification.category} · {selectedNotification.date}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {selectedNotification.title}
                    </h4>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedNotification.content}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Emisor:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedNotification.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cargo:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedNotification.authorRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Prioridad:</span>
                      <span className={cn(
                        "font-extrabold px-2 py-0.5 rounded-md text-[10px]",
                        selectedNotification.priority === "Alta" ? "text-rose-600 bg-rose-500/10" : "text-blue-600 bg-blue-500/10"
                      )}>
                        {selectedNotification.priority}
                      </span>
                    </div>
                  </div>

                  {selectedNotification.actionUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedNotification.actionUrl}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{selectedNotification.actionLabel || "Acceder al Módulo"}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0C1425] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center text-slate-400 text-xs">
                Seleccione una notificación para ver el contenido completo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
