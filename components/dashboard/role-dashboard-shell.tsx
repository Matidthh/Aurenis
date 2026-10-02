"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  BookOpen,
  HeartHandshake,
  Users,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { DirectivoDashboard } from "./directivo-dashboard";
import { DocenteDashboard } from "./docente-dashboard";
import { ConvivenciaDashboard } from "./convivencia-dashboard";
import { ApoderadoDashboard } from "./apoderado-dashboard";
import { EstudianteDashboard } from "./estudiante-dashboard";
import { cn } from "@/lib/utils/cn";

export type RoleType = "DIRECTIVO" | "DOCENTE" | "CONVIVENCIA" | "APODERADO" | "ESTUDIANTE";

interface RoleDashboardShellProps {
  schoolSlug: string;
  defaultRole?: RoleType;
  userName?: string;
  schoolName?: string;
}

interface RoleTabConfig {
  id: RoleType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  userDefaultName: string;
}

const ROLE_TABS: RoleTabConfig[] = [
  {
    id: "DIRECTIVO",
    label: "Directivos & UTP",
    description: "Supervisión institucional, cumplimiento curricular, decretos evaluativos y reportes SIGE.",
    icon: Building2,
    accentColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    userDefaultName: "Dirección Liceo Marga Marga",
  },
  {
    id: "DOCENTE",
    label: "Docentes & Profesores",
    description: "Libro de clases digital, toma de asistencia QR, actas de notas Decreto 67 y planificaciones.",
    icon: BookOpen,
    accentColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    userDefaultName: "Prof. Rodrigo Castro Díaz",
  },
  {
    id: "CONVIVENCIA",
    label: "Convivencia Escolar",
    description: "Protocolos Circular 482 MINEDUC, mediaciones formativas, Ley Aula Segura y citaciones.",
    icon: HeartHandshake,
    accentColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    userDefaultName: "Equipo Psicosocial & Convivencia",
  },
  {
    id: "APODERADO",
    label: "Familias & Apoderados",
    description: "Ficha del estudiante, justificativos médicos, promedio semestral y citaciones a reuniones.",
    icon: Users,
    accentColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    userDefaultName: "Sra. María Belén Ahumada",
  },
  {
    id: "ESTUDIANTE",
    label: "Alumnos / Estudiantes",
    description: "Escaneo de código QR para asistencia, mis asignaturas, notas parciales y calendario de pruebas.",
    icon: GraduationCap,
    accentColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    userDefaultName: "Yamir Alonso Ahumada (1° Medio A)",
  },
];

export function RoleDashboardShell({
  schoolSlug,
  defaultRole = "DIRECTIVO",
  userName,
  schoolName = "Liceo Politécnico Marga Marga",
}: RoleDashboardShellProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole);

  const currentTabConfig = ROLE_TABS.find((t) => t.id === selectedRole) || ROLE_TABS[0];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          BARRA DE CONMUTACIÓN DE ROLES ACADÉMICOS (MODO OSCURO PREMIUM)
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0B1120] p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Selector de Roles del Ecosistema Escolar
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Visualiza el sistema según los 5 estamentos oficiales de la comunidad educativa
              </span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden lg:block">
            {schoolName} · RBD 10240
          </div>
        </div>

        {/* Botones de Selección Segmentada de Rol */}
        <div
          role="tablist"
          aria-label="Vistas de rol escolar"
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none"
        >
          {ROLE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedRole === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedRole(tab.id)}
                className={cn(
                  "px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer min-h-[44px] select-none",
                  isSelected
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isSelected ? "text-blue-400 dark:text-blue-600" : "text-slate-400"
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Guía Explicativa del Rol Activo */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{currentTabConfig.description}</span>
        </div>
      </div>

      {/* =========================================================================
          RENDERIZADO DINÁMICO DEL DASHBOARD DEL ROL ACTIVO
          ========================================================================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {selectedRole === "DIRECTIVO" && (
            <DirectivoDashboard schoolSlug={schoolSlug} schoolName={schoolName} />
          )}
          {selectedRole === "DOCENTE" && (
            <DocenteDashboard
              schoolSlug={schoolSlug}
              teacherName={userName || currentTabConfig.userDefaultName}
            />
          )}
          {selectedRole === "CONVIVENCIA" && (
            <ConvivenciaDashboard
              schoolSlug={schoolSlug}
              officerName={userName || currentTabConfig.userDefaultName}
            />
          )}
          {selectedRole === "APODERADO" && (
            <ApoderadoDashboard
              schoolSlug={schoolSlug}
              guardianName={userName || currentTabConfig.userDefaultName}
            />
          )}
          {selectedRole === "ESTUDIANTE" && (
            <EstudianteDashboard
              schoolSlug={schoolSlug}
              studentName={userName || currentTabConfig.userDefaultName}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
