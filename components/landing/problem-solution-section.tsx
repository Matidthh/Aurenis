"use client";

import React, { useState } from "react";
import {
  XCircle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Users,
  FileSpreadsheet,
  Zap,
  Check,
  Building2,
  BadgeAlert,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

interface ProblemSolutionSectionProps {
  onOpenQuoteModal?: (source?: string) => void;
  onOpenDemoModal?: (source?: string) => void;
}

type TabKey = "notas" | "asistencia" | "comunicacion" | "reportes";

interface ComparisonItem {
  id: TabKey;
  tabLabel: string;
  tabSub: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  // Lado Tradicional
  problemTitle: string;
  problemDesc: string;
  problemPoints: string[];
  problemSnippet: {
    badge: string;
    title: string;
    lines: { label: string; value: string; isError?: boolean }[];
    footerNote: string;
  };
  metricOld: string;
  // Lado Aurenis
  solutionTitle: string;
  solutionDesc: string;
  solutionPoints: string[];
  solutionSnippet: {
    badge: string;
    title: string;
    lines: { label: string; value: string; isSuccess?: boolean }[];
    footerNote: string;
  };
  metricNew: string;
  regulationTag: string;
}

export function ProblemSolutionSection({
  onOpenQuoteModal,
  onOpenDemoModal,
}: ProblemSolutionSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("notas");

  const comparisonData: Record<TabKey, ComparisonItem> = {
    notas: {
      id: "notas",
      tabLabel: "Calificaciones & Decreto 67",
      tabSub: "Cálculo y actas de notas",
      icon: BookOpen,
      badge: "Ahorro: 4.5 hrs/semana",
      problemTitle: "Planillas Excel desincronizadas, fórmulas alteradas y estrés de cierre",
      problemDesc:
        "Docentes perdiendo fines de semana completos transcribiendo notas en planillas locales de cálculo, con fórmulas que se rompen accidentalmente y sin registro de auditoría ministerial.",
      problemPoints: [
        "Fórmulas modificables por error que alteran promedios semestrales sin aviso.",
        "Ausencia de trazabilidad: imposible auditar quién modificó una nota y cuándo.",
        "Semanas de retraso en la emisión de informes de notas para apoderados y UTP.",
      ],
      problemSnippet: {
        badge: "Planilla Excel Local v3_final_corregida.xlsx",
        title: "Registro de Notas — 1° Medio A",
        lines: [
          { label: "Morales, Sofía", value: "N1: 5.8 | N2: #¡REF! | Prom: #¡VALOR!", isError: true },
          { label: "Rojas, Diego", value: "N1: 6.2 | N2: 4.0 | Prom: 5.1 (Ponderación desactualizada)", isError: true },
          { label: "Valenzuela, M.", value: "N1: — | N2: 5.5 | Sin justificación médica registrada", isError: true },
        ],
        footerNote: "⚠️ Error de sintaxis en celda D14. Fórmulas desfasadas de la ponderación oficial.",
      },
      metricOld: "4.5 hrs / semana por docente",
      solutionTitle: "Matriz Matricial de Alta Velocidad alineada al Decreto 67",
      solutionDesc:
        "Digitación ultrarrápida con atajos de teclado numérico continuo (ej: escribir 65 guarda automáticamente 6.5), semaforización cromática instantánea y ponderaciones reglamentarias en vivo.",
      solutionPoints: [
        "Atajo numérico ergonómico: digita calificaciones completas sin usar el mouse.",
        "Auditoría inmutable con sello de tiempo, RUT del docente y motivo de modificación.",
        "Concentración de notas y actas oficiales generadas en 1 clic para entrega inmediata.",
      ],
      solutionSnippet: {
        badge: "AURENIS Cloud — Libro Matriz Decreto 67",
        title: "Matriz Activa — Historia y Geografía 1° Medio A",
        lines: [
          { label: "Morales, Sofía", value: "N1: 5.8 (25%)  N2: 6.5 [65]  Prom: 6.2 ✓", isSuccess: true },
          { label: "Rojas, Diego", value: "N1: 6.2 (25%)  N2: 4.0 (25%)  Prom: 5.1 ✓", isSuccess: true },
          { label: "Valenzuela, M.", value: "N1: Justif. Médica #104  N2: 5.5  Prom: 5.5 ✓", isSuccess: true },
        ],
        footerNote: "⚡ Autoguardado en la nube con firma del docente y validación Decreto 67.",
      },
      metricNew: "15 segundos por bloque de clase",
      regulationTag: "100% Conforme al Decreto 67 Mineduc",
    },
    asistencia: {
      id: "asistencia",
      tabLabel: "Libro Digital & Asistencia",
      tabSub: "Circular N° 30 Superintendencia",
      icon: CalendarCheck,
      badge: "Pase en 1 Clic",
      problemTitle: "Libros físicos, transcripción tardía y multas por subvención",
      problemDesc:
        "Toma de asistencia en papel que se traspasa días después a plataformas intermedias, provocando descuadres en la subvención mensual y familias que se enteran de inasistencias semanas después.",
      problemPoints: [
        "Riesgo de extravío, deterioro o tachaduras que invalidan el libro físico ante fiscalizaciones.",
        "Descuadres crónicos entre la asistencia del aula y la asistencia declarada a Mineduc.",
        "Apoderados desinformados durante la misma jornada escolar ante ausencias no justificadas.",
      ],
      problemSnippet: {
        badge: "Libro de Clases en Papel (Tomo 2026)",
        title: "Control Diario — Bloque 1 (08:00 - 09:30)",
        lines: [
          { label: "Presentes en Sala", value: "37 / 42 alumnos (Conteo manual a mano alzada)", isError: true },
          { label: "Traspaso a Planilla", value: "Pendiente para el viernes (retraso de 4 días)", isError: true },
          { label: "Aviso al Apoderado", value: "Sin canal de alerta inmediata del colegio", isError: true },
        ],
        footerNote: "⚠️ Inconsistencia detectada en folio 89. Riesgo de glosa en subvención escolar.",
      },
      metricOld: "Descuadres de hasta 8% mensual",
      solutionTitle: "Libro de Clases Digital Oficial con Control en 1 Clic",
      solutionDesc:
        "Pase de lista instantáneo por bloque horario según las especificaciones técnicas de la Circular 30 de la Superintendencia de Educación, con notificación push/WhatsApp inmediata al apoderado.",
      solutionPoints: [
        "Cumplimiento total de la Circular N° 30 con firma electrónica avanzada y registro de IP.",
        "Algoritmo de Alerta Temprana (SAT) que detecta riesgo de deserción por bajo 85% de asistencia.",
        "Consolidación automática en tiempo real para respaldar el cobro exacto de subvención mensual.",
      ],
      solutionSnippet: {
        badge: "AURENIS Registro Oficial — Circular 30",
        title: "Pase de Lista — 2° Medio B (08:05 hrs)",
        lines: [
          { label: "Presentes Confirmados", value: "40 / 42 registrados (Pase completado en 18s)", isSuccess: true },
          { label: "Alerta Apoderado", value: "SMS / Notificación enviada a familias a las 08:14 hrs", isSuccess: true },
          { label: "Subvención Mineduc", value: "Porcentaje del día consolidado automáticamente: 95.2%", isSuccess: true },
        ],
        footerNote: "⚡ Sellado de tiempo inmutable y respaldo conforme a la Superintendencia.",
      },
      metricNew: "100% de asistencia cuadrada al día",
      regulationTag: "Certificado Circular N° 30 Superintendencia",
    },
    comunicacion: {
      id: "comunicacion",
      tabLabel: "Familias & Notificaciones Oficiales",
      tabSub: "Portal apoderados seguro",
      icon: Users,
      badge: "98% Conexión Familiar",
      problemTitle: "Cuadernos extraviados, grupos informales de chat y desinformación",
      problemDesc:
        "Comunicaciones enviadas en papel que quedan en las mochilas, grupos de WhatsApp desregulados con filtración de datos sensibles y familias que se enteran de problemas conductuales a final de año.",
      problemPoints: [
        "Gasto recurrente en fotocopias de circulares con una tasa de acuse de recibo inferior al 30%.",
        "Brechas de privacidad al compartir datos de estudiantes en grupos informales de chat.",
        "Falta de constancia legal ante citaciones no atendidas en procesos de convivencia escolar.",
      ],
      problemSnippet: {
        badge: "Canal Tradicional / Papel & WhatsApp Informal",
        title: "Citación UTP / Convivencia Escolar",
        lines: [
          { label: "Circular Impresa", value: "Enviada en mochila el lunes. No devuelta firmada.", isError: true },
          { label: "Chat de Apoderados", value: "Debate desregulado sin validez institucional.", isError: true },
          { label: "Constancia de Lectura", value: "No existe registro para auditoría de convivencia.", isError: true },
        ],
        footerNote: "⚠️ Sin respaldo formal ante denuncias en la Superintendencia de Educación.",
      },
      metricOld: "30% tasa de acuse de recibo",
      solutionTitle: "Portal Móvil Oficial para Familias con Trazabilidad Criptográfica",
      solutionDesc:
        "Canal institucional cerrado, seguro y encriptado donde las familias acceden con RUN para revisar calificaciones, asistencia diaria, citaciones con acuse firmado y felicitaciones académicas.",
      solutionPoints: [
        "Autenticación segura con RUN institucional y aislamiento estricto por estudiante.",
        "Acuse de recibo con sello de tiempo y firma digital para citaciones y circulares críticas.",
        "Muro de convivencia escolar con registro objetivo de observaciones positivas y de mejora.",
      ],
      solutionSnippet: {
        badge: "AURENIS Portal Familias — Conexión Segura",
        title: "Citación UTP & Informe de Desempeño",
        lines: [
          { label: "Entrega Digital", value: "Notificación push recibida en móvil de la madre a las 11:20 hrs", isSuccess: true },
          { label: "Acuse Confirmado", value: "Firmado digitalmente: Apoderada RUN 14.821.xxx-x a las 11:34 hrs", isSuccess: true },
          { label: "Ficha del Alumno 360°", value: "Observación vinculada automáticamente al historial del aula", isSuccess: true },
        ],
        footerNote: "⚡ Registro inmutable con valor probatorio ante la Ley de Inclusión y RICE.",
      },
      metricNew: "98% de familias activas y conectadas",
      regulationTag: "Protección de Datos conforme a Ley 21.719",
    },
    reportes: {
      id: "reportes",
      tabLabel: "Actas, Subvenciones & SIGE",
      tabSub: "Cierre de año sin colapsos",
      icon: FileSpreadsheet,
      badge: "1 Clic para Exportar",
      problemTitle: "Cierres semestrales angustiantes, reprocesos y riesgo de sanciones",
      problemDesc:
        "Equipos directivos y secretarías académicas trabajando hasta medianoche en periodos de cierre de actas, cuadrando cientos de planillas heterogéneas con miedo a rechazos en la plataforma SIGE.",
      problemPoints: [
        "Días enteros dedicados a conciliar notas, asistencias e indicadores de promoción.",
        "Doble digitación manual: registrar primero en el colegio y luego transcribir a SIGE Mineduc.",
        "Riesgo de multas y retención de subvenciones por inconsistencias en los plazos ministeriales.",
      ],
      problemSnippet: {
        badge: "Cierre Manual Semestral — Secretaría Académica",
        title: "Generación de Actas de Promoción Escolar",
        lines: [
          { label: "Consolidación de Cursos", value: "84 archivos dispersos de distintos docentes", isError: true },
          { label: "Validación de Promoción", value: "Cálculo manual de situación final (Promovido / Repite)", isError: true },
          { label: "Carga a Plataforma SIGE", value: "Tipeo manual uno a uno de 1.200 estudiantes", isError: true },
        ],
        footerNote: "⚠️ Sobrecarga extrema, riesgo de errores humanos y multas por atraso.",
      },
      metricOld: "Semanas de trabajo extra y estrés",
      solutionTitle: "Sincronización Ministerial Automatizada y Reportes Ejecutivos",
      solutionDesc:
        "Generación en un clic de concentraciones de notas oficiales, certificados de alumno regular con validación por código QR y exportaciones de actas finales 100% compatibles con el estándar SIGE Mineduc.",
      solutionPoints: [
        "Pre-validación automática con reglas Mineduc: detecta inconsistencias antes de exportar.",
        "Exportación estructurada en formatos oficiales para carga masiva directa sin doble digitación.",
        "Dashboard ejecutivo en vivo para directores, jefes UTP y administradores del sostenedor.",
      ],
      solutionSnippet: {
        badge: "AURENIS Motor Ministerial — Sincronización SIGE",
        title: "Acta Final de Rendimiento Escolar 2026",
        lines: [
          { label: "Auditoría de Requisitos", value: "1.200 alumnos validados contra reglas Decreto 67: 100% OK", isSuccess: true },
          { label: "Archivo SIGE Mineduc", value: "Estructura CSV / XML oficial exportada en 4.2 segundos", isSuccess: true },
          { label: "Certificados Digitales", value: "Firmados electrónicamente y listos para descarga con QR", isSuccess: true },
        ],
        footerNote: "⚡ Cierre de actas finalizado a tiempo, sin horas extras y con total respaldo legal.",
      },
      metricNew: "1 Clic automático verificado",
      regulationTag: "Estructura Oficial compatible con SIGE Mineduc",
    },
  };

  const current = comparisonData[activeTab];

  function scrollToSimulator() {
    const el = document.getElementById("simulador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (onOpenDemoModal) {
      onOpenDemoModal("Simulador desde Problema vs Solución");
    }
  }

  return (
    <section
      id="problema-solucion"
      className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative overflow-hidden"
    >
      {/* Fondo sutil con detalle institucional */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Encabezado Superior de Alta Jerarquía */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Transformación Digital Escolar</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            El fin de la fricción administrativa escolar
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Compara cómo cambia la rutina diaria de tu establecimiento: de procesos manuales
            propensos a error, libros físicos y planillas aisladas, a la arquitectura moderna y
            unificada de <span className="font-bold text-slate-900">AURENIS</span>.
          </p>
        </div>

        {/* Barra Segmentada de Categorías (Tabs Táctiles Accesibles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-10 sm:mb-14">
          {(
            [
              { id: "notas", label: "Calificaciones & Decreto 67", sub: "Atajo numérico ergonómico", icon: BookOpen },
              { id: "asistencia", label: "Libro Digital & Asistencia", sub: "Circular N° 30 Superintendencia", icon: CalendarCheck },
              { id: "comunicacion", label: "Familias & Notificaciones", sub: "Portal seguro con RUN", icon: Users },
              { id: "reportes", label: "Actas & Sincronización SIGE", sub: "Cierre escolar en 1 clic", icon: FileSpreadsheet },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-white border-blue-600 shadow-md shadow-blue-500/10 ring-2 ring-blue-600/20"
                    : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700 hover:text-slate-900"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? "text-blue-900" : "text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate font-medium">{tab.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tarjetas de Comparación Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {/* LADO A: El Enfoque Tradicional / Fragmentado */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-200">
            {/* Cabecera del lado tradicional */}
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  <span>Método Tradicional / Fragmentado</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Costo Operacional
                  </span>
                  <span className="text-xs font-extrabold text-rose-600">{current.metricOld}</span>
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {current.problemTitle}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {current.problemDesc}
                </p>
              </div>

              {/* Visual Mockup Box: Simulación del Problema */}
              <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/70 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-rose-800 border-b border-rose-200/60 pb-2">
                  <span className="truncate">{current.problemSnippet.badge}</span>
                  <span className="text-rose-600 text-[10px] font-semibold">❌ NO AUDITABLE</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {current.problemSnippet.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-1.5 rounded bg-white/80 border border-rose-100 text-slate-700"
                    >
                      <span className="font-semibold text-slate-900">{line.label}</span>
                      <span className="text-rose-700 text-[11px] font-medium">{line.value}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-rose-700 font-sans font-medium pt-1 flex items-start gap-1.5">
                  <BadgeAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{current.problemSnippet.footerNote}</span>
                </div>
              </div>

              {/* Lista de Fricciones Clave */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Puntos Críticos de Fricción:
                </div>
                {current.problemPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700"
                  >
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del Lado Tradicional */}
            <div className="pt-6 mt-6 border-t border-rose-100 flex items-center gap-2.5 text-xs font-bold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>Causa recurrente de desmotivación docente y reprocesos administrativos</span>
            </div>
          </div>

          {/* LADO B: La Solución Integral AURENIS */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-200">
            {/* Resplandor ambiental de alta tecnología */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-0" />

            {/* Cabecera del lado Aurenis */}
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Con Plataforma AURENIS</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Rendimiento
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400">
                    {current.metricNew}
                  </span>
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {current.solutionTitle}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {current.solutionDesc}
                </p>
              </div>

              {/* Visual Mockup Box: Simulación de la Solución Aurenis */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-blue-500/30 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-300 border-b border-slate-700/80 pb-2">
                  <span className="truncate">{current.solutionSnippet.badge}</span>
                  <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    EN VIVO
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {current.solutionSnippet.lines.map((line, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-1.5 rounded bg-slate-900/90 border border-slate-700/60 text-slate-200"
                    >
                      <span className="font-semibold text-white">{line.label}</span>
                      <span className="text-emerald-400 text-[11px] font-medium">{line.value}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-blue-300 font-sans font-medium pt-1 flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{current.solutionSnippet.footerNote}</span>
                </div>
              </div>

              {/* Lista de Ventajas Clave */}
              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ventajas Operacionales Validadas:
                </div>
                {current.solutionPoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del Lado Aurenis */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-300 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{current.regulationTag}</span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                100% Conforme
              </span>
            </div>
          </div>
        </div>

        {/* Franja de Impacto Institucional & Llamado a la Acción Directo */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 mb-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1 sm:space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                ~18 hrs
              </div>
              <div className="text-sm font-bold text-slate-900">Ahorro Mensual por Docente</div>
              <p className="text-xs text-slate-500">
                Liberadas de tipeo manual y traspaso de planillas para enfocarse en aula y retroalimentación pedagógica.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1 sm:space-y-2 pt-6 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                100%
              </div>
              <div className="text-sm font-bold text-slate-900">Trazabilidad Circular 30</div>
              <p className="text-xs text-slate-500">
                Respaldo inmutable de asistencias, firmas de docentes y observaciones ante la Superintendencia de Educación.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1 sm:space-y-2 pt-6 md:pt-0 md:pl-6">
              <div className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
                0 Multas
              </div>
              <div className="text-sm font-bold text-slate-900">Subvención Protegida</div>
              <p className="text-xs text-slate-500">
                Elimina descuadres de cobro mensual ministerial con validaciones previas automáticas compatibles con SIGE.
              </p>
            </div>
          </div>

          {/* Botones de Acción Accesibles */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-600 font-medium text-center sm:text-left">
              ¿Quieres comprobar la velocidad de carga de notas en vivo?
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={scrollToSimulator}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
              >
                <span>Probar Simulador en Vivo</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenDemoModal
                    ? onOpenDemoModal("Agendar Demostración desde Comparativa")
                    : onOpenQuoteModal
                    ? onOpenQuoteModal("Cotización desde Comparativa")
                    : scrollToSimulator()
                }
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 min-h-[44px]"
              >
                <span>Agendar Demostración</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
