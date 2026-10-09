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
  userEmail?: string;
  userRole?: string;
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
  userEmail,
  userRole,
  schoolName = "Liceo Politécnico Marga Marga",
}: RoleDashboardShellProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType>(defaultRole);

  const currentTabConfig = ROLE_TABS.find((t) => t.id === selectedRole) || ROLE_TABS[0];

  return (
    <div className="space-y-6">
      {/* =========================================================================
          BARRA DE CONMUTACIÓN DE ROLES ACADÉMICOS (MODO OSCURO PREMIUM)
          ========================================================================= */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0 shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white block">
                  Estamento & Perfil de Visualización
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                  <Sparkles className="w-3 h-3" />
                  Multi-Rol
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona la perspectiva del ecosistema escolar (Directivo, Docente, Convivencia, Familia o Alumno)
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{schoolName}</span>
          </div>
        </div>

        {/* Botones de Selección Segmentada de Rol con Estética Luminosa */}
        <div
          role="tablist"
          aria-label="Vistas de rol escolar"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
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
                  "p-3 rounded-2xl text-xs font-bold transition-all duration-200 flex flex-col items-start gap-1.5 cursor-pointer min-h-[56px] select-none text-left relative overflow-hidden border",
                  isSelected
                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-500 shadow-md shadow-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-xl flex items-center justify-center",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                  )}
                </div>
                <div>
                  <span className={cn("block font-extrabold text-xs", isSelected ? "text-white" : "text-slate-900 dark:text-white")}>
                    {tab.label.split("&")[0].trim()}
                  </span>
                  <span className={cn("text-[10px] truncate block", isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500")}>
                    {tab.id === "DIRECTIVO" && "UTP y Gestión"}
                    {tab.id === "DOCENTE" && "Libro y Notas"}
                    {tab.id === "CONVIVENCIA" && "Circular 482"}
                    {tab.id === "APODERADO" && "Familia y Pupilo"}
                    {tab.id === "ESTUDIANTE" && "Asistencia y Notas"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Guía Explicativa del Rol Activo */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-medium">{currentTabConfig.description}</span>
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
              studentEmail={userEmail}
              isStudentSelf={userRole === "STUDENT"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
