"use client";

import React from "react";
import {
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Building2,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Lock,
  Layers,
} from "lucide-react";

export function SystemFeaturesGrid() {
  const features = [
    {
      icon: FileSpreadsheet,
      title: "Planilla Matricial de Alta Densidad",
      badge: "Decreto 67",
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
      description:
        "Carga ultrarrápida de notas con navegación fluida por teclado (flechas, Enter, Tab), tipeo rápido de 2 dígitos (ej: 65 = 6.5) y semaforización cromática oficial.",
    },
    {
      icon: BookOpen,
      title: "Libro de Clases Digital Oficial",
      badge: "Circular 30 Mineduc",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      description:
        "Control de leccionario con Objetivos de Aprendizaje (OA), asistencia horaria en 1-click, registro de atrasos, justificaciones médicas y firma electrónica de actas.",
    },
    {
      icon: AlertTriangle,
      title: "Sistema de Alerta Temprana (SAT)",
      badge: "Prevención Deserción",
      badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
      description:
        "Detección proactiva de estudiantes en riesgo académico o de asistencia (< 85%), activando protocolos y fichas de seguimiento antes del cierre semestral.",
    },
    {
      icon: Building2,
      title: "Arquitectura Multi-Sede & Sostenedores",
      badge: "Redes & SLEP",
      badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
      description:
        "Gestión consolidada para corporaciones municipales, servicios locales de educación pública (SLEP) y fundaciones con múltiples establecimientos.",
    },
    {
      icon: Layers,
      title: "Módulo PIE & Necesidades Especiales",
      badge: "Decreto 83 & 170",
      badgeColor: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
      description:
        "Ficha clínica y psicopedagógica para especialistas, registro de adecuaciones de acceso y curriculares, con reportes confidenciales protegidos.",
    },
    {
      icon: BrainCircuit,
      title: "Copiloto IA Pedagógico Aurenis",
      badge: "Asistente Docente",
      badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
      description:
        "Generación asistida de rúbricas analíticas, sugerencias de retroalimentación formativa y resúmenes de cobertura curricular alineados al currículum nacional.",
    },
    {
      icon: Lock,
      title: "Aislamiento de Datos & Trazabilidad",
      badge: "Seguridad Bancaria",
      badgeColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
      description:
        "Auditoría inmutable de todas las calificaciones modificadas, control de roles granular (RBAC) y cifrado de datos de extremo a extremo.",
    },
    {
      icon: ShieldCheck,
      title: "Sincronización SIGE & Mineduc",
      badge: "Normativa Nacional",
      badgeColor: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
      description:
        "Exportación estructurada de matrículas, actas de notas finales y asistencia para la carga oficial en las plataformas del Ministerio de Educación.",
    },
  ];

  return (
    <section className="relative w-full pt-32 pb-28 bg-[#F8F8F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-100/50 text-blue-700 border border-blue-200 shadow-sm">
            Capacidades Integrales del Sistema
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Diseñado para las Exigencias de la Educación Chilena
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Aurenis integra todas las herramientas requeridas por la normativa ministerial en una única plataforma de alto rendimiento, evitando duplicidad de tareas en los docentes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/60 p-6 space-y-5 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-blue-500">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Disponible en todos los liceos</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
