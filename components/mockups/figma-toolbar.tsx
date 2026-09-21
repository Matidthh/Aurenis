"use client";

import React from "react";
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Grid,
  Layers,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Share2,
  Sliders,
  Play,
  RotateCcw,
  School,
  BookOpen,
  GraduationCap,
  FileSpreadsheet,
  ServerCrash,
  SlidersHorizontal,
  Globe,
  Database,
  Users,
  Award,
  Bug,
} from "lucide-react";

export type ViewportMode = "desktop" | "laptop" | "tablet" | "mobile" | "mobile-se" | "fluid";
export type ActiveTab =
  | "hero-landing"
  | "grade-matrix"
  | "teachers-list"
  | "subject-selector"
  | "teacher-profile-edit"
  | "students-list"
  | "student-profile"
  | "student-registration"
  | "executive"
  | "teacher"
  | "error-resilience"
  | "device-matrix"
  | "browser-matrix"
  | "e2e-flow"
  | "user-journeys"
  | "lifecycle-e2e"
  | "qa-issues";

interface FigmaToolbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  viewport: ViewportMode;
  onViewportChange: (vp: ViewportMode) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  showTokens: boolean;
  onToggleTokens: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentsCount: number;
  onOpenChecklist: () => void;
  dodCompletedCount: number;
  totalDodCount: number;
  onResetInteractiveState: () => void;
}

export function FigmaToolbar({
  activeTab,
  onTabChange,
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  showHotspots,
  onToggleHotspots,
  showTokens,
  onToggleTokens,
  showComments,
  onToggleComments,
  commentsCount,
  onOpenChecklist,
  dodCompletedCount,
  totalDodCount,
  onResetInteractiveState,
}: FigmaToolbarProps) {
  const isAllDodDone = dodCompletedCount === totalDodCount;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Lado izquierdo: Identificador Figma & Switcher de Dashboards */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700/80">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <span className="font-extrabold text-[11px] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                  F
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-100 tracking-tight">Figma Prototype</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hi-Fi
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block leading-none">Aurenis Design System v2.4</span>
            </div>
          </div>

          {/* Switcher de Vistas */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/70 overflow-x-auto max-w-full">
            <button
              onClick={() => onTabChange("hero-landing")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "hero-landing"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hero Landing</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold hidden sm:inline">
                Replicado
              </span>
            </button>

            <button
              onClick={() => onTabChange("grade-matrix")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "grade-matrix"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planilla de Notas</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold hidden sm:inline">
                DoD Notas
              </span>
            </button>

            <button
              onClick={() => onTabChange("teachers-list")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "teachers-list"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Nómina Profesores</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold hidden sm:inline">
                DoD 1
              </span>
            </button>

            <button
              onClick={() => onTabChange("subject-selector")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "subject-selector"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Selector Asignaturas</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold hidden sm:inline">
                DoD 2
              </span>
            </button>

            <button
              onClick={() => onTabChange("teacher-profile-edit")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "teacher-profile-edit"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ficha & Modales</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold hidden sm:inline">
                DoD 3
              </span>
            </button>

            <button
              onClick={() => onTabChange("students-list")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "students-list"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Estudiantes</span>
            </button>

            <button
              onClick={() => onTabChange("executive")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "executive"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Dashboard Directivo</span>
            </button>

            <button
              onClick={() => onTabChange("error-resilience")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "error-resilience"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-rose-400 hover:text-rose-200 hover:bg-rose-950/40"
              }`}
            >
              <ServerCrash className="w-3.5 h-3.5" />
              <span>Resiliencia & Errores 500</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-rose-500/30 text-rose-200 font-bold hidden sm:inline">
                DoD UI 500
              </span>
            </button>

            <button
              onClick={() => onTabChange("device-matrix")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "device-matrix"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-blue-400 hover:text-blue-200 hover:bg-blue-950/40"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
              <span>Matriz de Dispositivos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/30 text-cyan-200 font-bold hidden sm:inline">
                DoD Móvil
              </span>
            </button>

            <button
              onClick={() => onTabChange("browser-matrix")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "browser-matrix"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/40"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-300" />
              <span>4 Navegadores</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 font-bold hidden sm:inline">
                DoD Web
              </span>
            </button>

            <button
              onClick={() => onTabChange("e2e-flow")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "e2e-flow"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/40"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span>Flujo E2E & BD</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-bold hidden sm:inline">
                DoD E2E
              </span>
            </button>

            <button
              onClick={() => onTabChange("user-journeys")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "user-journeys"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs ring-1 ring-white/20"
                  : "text-indigo-300 hover:text-white hover:bg-indigo-950/50"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Jornadas de Uso</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 font-bold">
                Admin • Profe • Alumno
              </span>
            </button>

            <button
              onClick={() => onTabChange("lifecycle-e2e")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "lifecycle-e2e"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs ring-1 ring-white/20"
                  : "text-emerald-300 hover:text-white hover:bg-emerald-950/50"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ciclo Académico E2E</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-200 font-bold">
                Decreto 67 • Dictamen E2E
              </span>
            </button>

            <button
              onClick={() => onTabChange("qa-issues")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === "qa-issues"
                  ? "bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-xs ring-1 ring-white/20"
                  : "text-rose-300 hover:text-white hover:bg-rose-950/50"
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              <span>Bitácora QA</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-200 font-bold">
                Hallazgos • Bugs
              </span>
            </button>
          </div>
        </div>

        {/* Lado derecho: Controles de Viewport, Zoom, Tokens, Criterios y Hotspots */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Selector de Dispositivo / Viewport */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-slate-400">
            <button
              title="Desktop 1440px / Monitores 4K"
              onClick={() => onViewportChange("desktop")}
              className={`p-1.5 rounded-md hover:text-slate-100 transition ${
                viewport === "desktop" ? "bg-slate-700 text-white shadow-xs font-bold" : ""
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              title="Laptop 1200px"
              onClick={() => onViewportChange("laptop")}
              className={`p-1.5 rounded-md hover:text-slate-100 transition ${
                viewport === "laptop" ? "bg-slate-700 text-white shadow-xs font-bold" : ""
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
            <button
              title="Tablet 834px (iPad)"
              onClick={() => onViewportChange("tablet")}
              className={`p-1.5 rounded-md hover:text-slate-100 transition ${
                viewport === "tablet" ? "bg-slate-700 text-white shadow-xs font-bold" : ""
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              title="Mobile Estándar 390px"
              onClick={() => onViewportChange("mobile")}
              className={`p-1.5 rounded-md hover:text-slate-100 transition ${
                viewport === "mobile" ? "bg-slate-700 text-white shadow-xs font-bold" : ""
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              title="Mobile Compacto 375px (iPhone SE / 0 Overflow)"
              onClick={() => onViewportChange("mobile-se")}
              className={`px-1.5 py-1 rounded-md hover:text-slate-100 transition text-[10px] font-black leading-none ${
                viewport === "mobile-se"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:bg-slate-700/60"
              }`}
            >
              375
            </button>
            <button
              title="Full Fluid Viewport (100%)"
              onClick={() => onViewportChange("fluid")}
              className={`p-1.5 rounded-md hover:text-slate-100 transition ${
                viewport === "fluid" ? "bg-slate-700 text-white shadow-xs font-bold" : ""
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60 text-xs text-slate-300">
            <button
              onClick={() => onZoomChange(Math.max(0.6, Number((zoom - 0.1).toFixed(2))))}
              className="p-0.5 hover:text-white transition"
              title="Reducir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium px-1 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => onZoomChange(Math.min(1.3, Number((zoom + 0.1).toFixed(2))))}
              className="p-0.5 hover:text-white transition"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hotspots interactivos toggle */}
          <button
            onClick={onToggleHotspots}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              showHotspots
                ? "bg-blue-600/30 text-blue-300 border-blue-500/50"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
            }`}
            title="Resaltar zonas clickeables del prototipo"
          >
            <div className={`w-2 h-2 rounded-full ${showHotspots ? "bg-blue-400 animate-pulse" : "bg-slate-500"}`} />
            <span className="hidden sm:inline">Hotspots</span>
          </button>

          {/* Column Grid toggle */}
          <button
            onClick={onToggleGrid}
            className={`p-1.5 rounded-lg text-xs font-medium border transition ${
              showGrid
                ? "bg-purple-600/30 text-purple-300 border-purple-500/50"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
            }`}
            title="Alternar Guías de Columna (12 Columnas 8px)"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Inspector de Tokens de Diseño */}
          <button
            onClick={onToggleTokens}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              showTokens
                ? "bg-amber-600/30 text-amber-300 border-amber-500/50"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
            }`}
            title="Ver Tokens de Diseño (Colores, Tipografía, Espaciado)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tokens</span>
          </button>

          {/* Comentarios de diseño */}
          <button
            onClick={onToggleComments}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              showComments
                ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50"
                : "bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200"
            }`}
            title="Anotaciones de UX y notas de diseño"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-[10px] font-bold text-slate-300">
              {commentsCount}
            </span>
          </button>

          {/* Checklist de Criterios DoD (Definition of Done) */}
          <button
            onClick={onOpenChecklist}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              isAllDodDone
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-xs"
                : "bg-amber-600 hover:bg-amber-700 text-white border-amber-500 shadow-xs"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DoD: {dodCompletedCount}/{totalDodCount}</span>
            <span className="text-[10px] opacity-80 hidden md:inline">
              ({Math.round((dodCompletedCount / totalDodCount) * 100)}%)
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
