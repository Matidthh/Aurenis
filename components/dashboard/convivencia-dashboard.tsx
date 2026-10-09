"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldAlert,
  Users,
  CheckCircle2,
  CalendarCheck,
  AlertTriangle,
  FileText,
  UserCheck,
  ChevronRight,
  Plus,
  Search,
  Clock,
  Sparkles,
  PhoneCall,
  Scale,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface ConvivenciaDashboardProps {
  schoolSlug: string;
  officerName?: string;
  activeIncidentsCount?: number;
}

interface IncidentItem {
  id: string;
  student: string;
  course: string;
  type: string;
  severity: "LEVE" | "GRAVE" | "MUY_GRAVE";
  status: "EN_SEGUIMIENTO" | "MEDIACION" | "RESUELTO";
  date: string;
  officer: string;
}

export function ConvivenciaDashboard({
  schoolSlug,
  officerName = "Equipo Convivencia Escolar",
  activeIncidentsCount = 3,
}: ConvivenciaDashboardProps) {
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    {
      id: "inc1",
      student: "Benjamín Toro M.",
      course: "2° Medio B",
      type: "Conflicto entre pares en recreo",
      severity: "LEVE",
      status: "MEDIACION",
      date: "Hoy 10:15",
      officer: "Psicóloga Escolar",
    },
    {
      id: "inc2",
      student: "Matías Contreras P.",
      course: "3° Medio C",
      type: "Inasistencia reiterada y desmotivación",
      severity: "GRAVE",
      status: "EN_SEGUIMIENTO",
      date: "Ayer 15:30",
      officer: "Trabajadora Social",
    },
    {
      id: "inc3",
      student: "Sofía Valenzuela R.",
      course: "1° Medio A",
      type: "Protocolo Circular 482 - Apoyo Psicosocial",
      severity: "GRAVE",
      status: "EN_SEGUIMIENTO",
      date: "28 Sep",
      officer: "Encargado Convivencia",
    },
    {
      id: "inc4",
      student: "Martín Lagos G.",
      course: "4° Medio E",
      type: "Acuerdo formativo y mediación",
      severity: "LEVE",
      status: "RESUELTO",
      date: "25 Sep",
      officer: "Inspectoría General",
    },
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Convivencia Escolar */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Convivencia Escolar & Equipo Psicosocial"
        roleBadgeColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        userName={officerName}
        greeting="Comunidad Escolar, Mediación & Resguardo Integral"
        quickActions={
          <>
            <button
              type="button"
              onClick={() => alert("Abriendo protocolo Circular 482 y mediación escolar...")}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 min-h-[44px] cursor-pointer"
            >
              <Scale className="w-4 h-4" />
              <span>Nuevo Protocolo Circular 482</span>
            </button>
            <Link
              href={`/${schoolSlug}/students`}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-2 backdrop-blur-md min-h-[44px]"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Directorio Alumnos</span>
            </Link>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen de Convivencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Casos Activos"
          value={activeIncidentsCount}
          subtitle="2 en mediación escolar activa"
          badgeLabel="Seguimiento"
          icon={HeartHandshake}
          accentColor="emerald"
        />

        <AcademicSummaryCard
          title="Protocolos Normativos"
          value="1 caso"
          subtitle="Circular 482 y Ley Aula Segura"
          badgeLabel="Oficial MINEDUC"
          icon={ShieldAlert}
          accentColor="amber"
          thresholdAlert={{
            isCritical: true,
            message: "Protocolo 482 en plazo de notificación",
          }}
        />

        <AcademicSummaryCard
          title="Tasa de Mediación"
          value="88.5%"
          subtitle="Acuerdos formativos exitosos"
          badgeLabel="Año 2026"
          icon={CheckCircle2}
          accentColor="blue"
          trend={{ value: "+4.2%", isPositive: true }}
        />

        <AcademicSummaryCard
          title="Citaciones a Familias"
          value="4"
          subtitle="Programadas para esta semana"
          badgeLabel="Entrevistas"
          icon={CalendarCheck}
          accentColor="purple"
        />
      </div>

      {/* 3. Tabla Adaptativa de Casos de Convivencia */}
      <AdaptiveTable<IncidentItem>
        title="Bitácora de Situaciones y Mediaciones"
        description="Registro confidencial con resguardo de datos según la Ley de Protección de la Infancia."
        data={incidents}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Buscar por estudiante, curso o protocolo..."
        searchFilter={(item, q) =>
          item.student.toLowerCase().includes(q.toLowerCase()) ||
          item.course.toLowerCase().includes(q.toLowerCase()) ||
          item.type.toLowerCase().includes(q.toLowerCase())
        }
        columns={[
          {
            key: "student",
            header: "Estudiante y Curso",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{item.student}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.course}</span>
              </div>
            ),
          },
          {
            key: "type",
            header: "Naturaleza de la Situación",
            render: (item) => (
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{item.type}</span>
                <span className="text-[10px] text-slate-400">Responsable: {item.officer}</span>
              </div>
            ),
          },
          {
            key: "severity",
            header: "Gravedad",
            align: "center",
            render: (item) => (
              <span
                className={`text-[11px] font-bold ${
                  item.severity === "MUY_GRAVE"
                    ? "text-rose-600 dark:text-rose-400"
                    : item.severity === "GRAVE"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {item.severity}
              </span>
            ),
          },
          {
            key: "status",
            header: "Estado",
            align: "center",
            render: (item) => (
              <span
                className={`text-[11px] font-bold ${
                  item.status === "RESUELTO"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : item.status === "MEDIACION"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {item.status === "RESUELTO"
                  ? "Resuelto"
                  : item.status === "MEDIACION"
                  ? "En Mediación"
                  : "En Seguimiento"}
              </span>
            ),
          },
          {
            key: "date",
            header: "Fecha",
            align: "right",
            render: (item) => (
              <span className="text-xs text-slate-500 font-mono">{item.date}</span>
            ),
          },
          {
            key: "actions",
            header: "Detalle",
            align: "right",
            render: (item) => (
              <button
                type="button"
                onClick={() => alert(`Visualizando expediente confidencial de ${item.student}...`)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>Expediente</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
