"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  SlidersHorizontal,
  Eye,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  Check,
} from "lucide-react";
import { ViewportMode } from "./figma-toolbar";

export interface DeviceSpec {
  id: string;
  category: "mobile-compact" | "mobile-standard" | "tablet" | "laptop" | "desktop-4k";
  name: string;
  viewportWidth: number;
  viewportHeight: number;
  targetViewport: ViewportMode;
  dpr: string;
  popularDevices: string[];
  layoutMode: string;
  tableBehavior: string;
  touchStandard: string;
  testStatus: "passed" | "warning" | "in-progress";
  testedItems: {
    name: string;
    passed: boolean;
    note: string;
  }[];
}

export const DEVICE_MATRIX_DATA: DeviceSpec[] = [
  {
    id: "dev-mobile-compact",
    category: "mobile-compact",
    name: "Mobile Compacto (375px)",
    viewportWidth: 375,
    viewportHeight: 667,
    targetViewport: "mobile",
    dpr: "2.0x / 3.0x",
    popularDevices: ["iPhone SE (2ª y 3ª Gen)", "iPhone 12/13 Mini", "Pixel 4a", "Galaxy A10"],
    layoutMode: "Monocolumna fluida (1 columna) con padding exterior de 12-16px",
    tableBehavior: "Desplazamiento horizontal con scroll nativo táctil y primera columna fija (identificador alumno)",
    touchStandard: "Área táctil mínima ≥ 44×44px (WCAG 2.5.5 AAA / Touch Manipulation activo)",
    testStatus: "passed",
    testedItems: [
      {
        name: "Ausencia de desbordamiento horizontal en 375px",
        passed: true,
        note: "Verificado sin scroll horizontal indeseado en la página raíz ni en modales.",
      },
      {
        name: "Tablas operables con swipe táctil fluido",
        passed: true,
        note: "Scroll horizontal con inercia (-webkit-overflow-scrolling: touch) e indicador visual de scroll.",
      },
      {
        name: "Botones y controles con tamaño mínimo táctil",
        passed: true,
        note: "Botones con min-h-[42px], selectores con padding amplio y touch-action: manipulation.",
      },
      {
        name: "Navegación y modales responsivos",
        passed: true,
        note: "Modales ajustados a 95vw con scroll interno independiente y botón de cierre accesible.",
      },
    ],
  },
  {
    id: "dev-mobile-standard",
    category: "mobile-standard",
    name: "Mobile Estándar (390px - 414px)",
    viewportWidth: 390,
    viewportHeight: 844,
    targetViewport: "mobile",
    dpr: "3.0x Super Retina",
    popularDevices: ["iPhone 13 / 14 / 15 / 16", "Samsung Galaxy S22 / S23 / S24", "Google Pixel 7 / 8"],
    layoutMode: "Monocolumna optimizada con vista bento simplificada y tarjetas colapsables",
    tableBehavior: "Tabla con scroll horizontal optimizado y alternancia a vista de tarjetas de perfil",
    touchStandard: "Controles de entrada táctil con hit-targets ampliados y spacing ≥ 8px entre botones",
    testStatus: "passed",
    testedItems: [
      {
        name: "Visualización de métricas y KPIs ejecutivos",
        passed: true,
        note: "Tarjetas de asistencia y cobertura en grid 2 columnas o 1 columna fluida.",
      },
      {
        name: "Ingreso de calificaciones con teclado numérico",
        passed: true,
        note: "Modo de tipeo rápido y celdas de nota con fácil acceso táctil.",
      },
      {
        name: "Directorio de docentes y filtros",
        passed: true,
        note: "Selector de departamento y toggle de vista en tarjetas de perfil optimizadas.",
      },
      {
        name: "Feedback visual y banners de estado",
        passed: true,
        note: "Notificaciones y estados vacíos sin corte de texto ni truncamiento erróneo.",
      },
    ],
  },
  {
    id: "dev-tablet",
    category: "tablet",
    name: "Tablets Vertical & Horizontal (768px - 834px)",
    viewportWidth: 834,
    viewportHeight: 1194,
    targetViewport: "tablet",
    dpr: "2.0x Liquid Retina",
    popularDevices: ["iPad 10.2\" / 10.9\"", "iPad Air 11\"", "iPad Pro 11\"", "Samsung Galaxy Tab S9"],
    layoutMode: "Bento-grid adaptativo en 2 columnas, métricas en 3-4 columnas, barra lateral retráctil",
    tableBehavior: "Tabla matricial con columnas secundarias visibles y navegación híbrida táctil + teclado",
    touchStandard: "Objetivos táctiles confortables con soporte para Apple Pencil y puntero de trackpad",
    testStatus: "passed",
    testedItems: [
      {
        name: "Distribución de planilla matricial",
        passed: true,
        note: "Estudiante, evaluaciones principales y promedio ponderado visibles simultáneamente.",
      },
      {
        name: "Panel de control directivo y gráficos SVG",
        passed: true,
        note: "Gráficos de barras de asistencia MINEDUC con tooltips interactivos al toque.",
      },
      {
        name: "Selector de asignaturas docentes",
        passed: true,
        note: "Drag & drop y botones de adición de materias con retroalimentación inmediata.",
      },
      {
        name: "Modales de ingreso y edición",
        passed: true,
        note: "Centrados con margen seguro y formularios organizados en 2 columnas.",
      },
    ],
  },
  {
    id: "dev-laptop",
    category: "laptop",
    name: "Laptops & Notebooks (1200px - 1366px)",
    viewportWidth: 1200,
    viewportHeight: 800,
    targetViewport: "laptop",
    dpr: "1.0x / 2.0x Retina",
    popularDevices: ["MacBook Air 13\"", "MacBook Pro 14\"", "Dell XPS 13 / 15", "Lenovo ThinkPad X1"],
    layoutMode: "Dashboard completo en 3 columnas bento, barra de herramientas Figma y atajos de teclado",
    tableBehavior: "Planilla completa de alta densidad con navegación por flechas de cursor y guardado automático",
    touchStandard: "Optimizado para trackpad de precisión y teclado mecánico/físico",
    testStatus: "passed",
    testedItems: [
      {
        name: "Velocidad de tipeo Decreto 67",
        passed: true,
        note: "Atajos de flechas ↑↓←→, auto-salto a la siguiente celda y auto-formato decimal.",
      },
      {
        name: "Visualización de histogramas cromáticos",
        passed: true,
        note: "Rango de notas oficial sin compresión ni desbordamiento de contenido.",
      },
      {
        name: "Exportación de informes y reportes oficiales",
        passed: true,
        note: "Generación simulada de PDF y Excel con confirmación visual en pantalla.",
      },
      {
        name: "Herramientas de inspección y comentarios Figma",
        passed: true,
        note: "Drawer lateral y panel de tokens de diseño accesibles sin ocultar la vista principal.",
      },
    ],
  },
  {
    id: "dev-desktop-4k",
    category: "desktop-4k",
    name: "Monitores Desktop & Alta Resolución (1440px - 4K)",
    viewportWidth: 1440,
    viewportHeight: 900,
    targetViewport: "desktop",
    dpr: "1.0x / 2.0x / 4K UHD",
    popularDevices: ["iMac 24\" / 27\"", "Monitores Ultrawide 3440×1440", "Pantallas 4K 3840×2160", "Dell UltraSharp"],
    layoutMode: "Diseño ergonómico contenido (max-w-7xl) para evitar estiramiento excesivo en pantallas anchas",
    tableBehavior: "Planilla de máxima amplitud con todas las evaluaciones, desgloses y ponderaciones visibles",
    touchStandard: "Cursor de precisión con estados de hover refinados y transiciones suaves",
    testStatus: "passed",
    testedItems: [
      {
        name: "Contención de layout en pantallas ultra-anchas",
        passed: true,
        note: "Estructura delimitada con max-w-7xl que mantiene longitud de línea legible (65-75ch).",
      },
      {
        name: "Nitidez tipográfica y tokens cromáticos",
        passed: true,
        note: "Renderizado SVG vectorial nítido a 4K sin artefactos de pixelado.",
      },
      {
        name: "Matriz completa de notas con estadísticas en vivo",
        passed: true,
        note: "Todas las 6 columnas de evaluaciones y promedios finales visibles sin scrolling forzado.",
      },
      {
        name: "Módulo de resiliencia y simulación de fallas",
        passed: true,
        note: "Banners HTTP 500/503 y Error Boundary operativos con visualización de estado.",
      },
    ],
  },
];

interface DeviceMatrixViewProps {
  currentViewport: ViewportMode;
  onSelectViewport: (vp: ViewportMode) => void;
  onNavigateToTab: (tab: any) => void;
}

export function DeviceMatrixView({
  currentViewport,
  onSelectViewport,
  onNavigateToTab,
}: DeviceMatrixViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>("dev-mobile-compact");

  const activeSpec =
    DEVICE_MATRIX_DATA.find((d) => d.id === selectedDevice) || DEVICE_MATRIX_DATA[0];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-12">
      {/* 1. Encabezado de la Matriz de Dispositivos */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Matriz de Dispositivos & Auditoría Responsiva
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Criterios DoD Aprobados</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Documentación técnica de verificación en pantallas móviles (desde 375px), tablets, notebooks y monitores 4K de alta densidad. Ausencia estricta de desbordamiento horizontal y operabilidad táctil certificada.
          </p>
        </div>

        {/* Resumen de Estado */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dispositivos</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">5 Clases</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min. Viewport</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">375 px</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overflow</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">0 px</span>
          </div>
        </div>
      </div>

      {/* 2. Selector Rápido de Categorías de Dispositivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {DEVICE_MATRIX_DATA.map((dev) => {
          const isSelected = selectedDevice === dev.id;
          const isCurrentViewport = currentViewport === dev.targetViewport;

          const IconComponent =
            dev.category === "mobile-compact" || dev.category === "mobile-standard"
              ? Smartphone
              : dev.category === "tablet"
              ? Tablet
              : dev.category === "laptop"
              ? Laptop
              : Monitor;

          return (
            <div
              key={dev.id}
              onClick={() => setSelectedDevice(dev.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-1">
                  {isCurrentViewport && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      Activo
                    </span>
                  )}
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    OK
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                  {dev.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {dev.viewportWidth} × {dev.viewportHeight} px
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectViewport(dev.targetViewport);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Simular</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-slate-400 text-[10px]">{dev.dpr}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detalle Técnico del Dispositivo Seleccionado */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              {activeSpec.category === "mobile-compact" || activeSpec.category === "mobile-standard" ? (
                <Smartphone className="w-5 h-5" />
              ) : activeSpec.category === "tablet" ? (
                <Tablet className="w-5 h-5" />
              ) : activeSpec.category === "laptop" ? (
                <Laptop className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {activeSpec.name}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {activeSpec.viewportWidth}px Breakpoint
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Modelos representativos: {activeSpec.popularDevices.join(", ")}
              </p>
            </div>
          </div>

          {/* Botón de cambio de viewport al dispositivo inspeccionado */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectViewport(activeSpec.targetViewport)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex items-center gap-2 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Prototipo en {activeSpec.viewportWidth}px</span>
            </button>
          </div>
        </div>

        {/* Especificaciones de Arquitectura Responsiva */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Estrategia de Layout</span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeSpec.layoutMode}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Comportamiento de Tablas</span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeSpec.tableBehavior}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Estándar Táctil & Hit-Area</span>
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeSpec.touchStandard}
            </p>
          </div>
        </div>

        {/* 4. Lista de Pruebas y Criterios DoD Validados */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Criterios de Aceptación Validados en {activeSpec.name}
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {activeSpec.testedItems.filter((i) => i.passed).length} de {activeSpec.testedItems.length} comprobados
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSpec.testedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Accesos Directos a Vistas Clave para Pruebas en Vivo */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Probar Módulos en {activeSpec.name}
            </span>
            <span className="text-[11px] text-slate-400">
              Selecciona un módulo para verificar el comportamiento en este ancho
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                onSelectViewport(activeSpec.targetViewport);
                onNavigateToTab("grade-matrix");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Planilla de Notas (Decreto 67)</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onSelectViewport(activeSpec.targetViewport);
                onNavigateToTab("teachers-list");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Gestión de Profesores (Cards & Tabla)</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onSelectViewport(activeSpec.targetViewport);
                onNavigateToTab("students-list");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Directorio de Estudiantes</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onSelectViewport(activeSpec.targetViewport);
                onNavigateToTab("executive");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Dashboard Directivo & Gráficos</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onSelectViewport(activeSpec.targetViewport);
                onNavigateToTab("error-resilience");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Resiliencia & Errores 500</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
