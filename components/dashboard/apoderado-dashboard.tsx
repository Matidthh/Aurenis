"use client";

import React from "react";
import { Users, Award, CalendarCheck, HeartHandshake, Bell } from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";

export interface ApoderadoDashboardProps {
  schoolSlug: string;
  guardianName?: string;
}

export function ApoderadoDashboard({
  schoolSlug,
  guardianName = "Sra. María Belén Ahumada",
}: ApoderadoDashboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga (LPMM)"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Familia & Apoderado"
        roleBadgeColor="text-amber-400 bg-amber-500/10 border-amber-500/30"
        userName={guardianName}
        greeting="Portal del Apoderado — Seguimiento Estudiantil"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Pupilo Asignado"
          value="Yamir Alonso Ahumada"
          subtitle="Curso: 1° Medio A"
          badgeLabel="Matrícula Regular"
          icon={Users}
          accentColor="amber"
        />
        <AcademicSummaryCard
          title="Promedio General"
          value="6.5"
          subtitle="Promedio Semestral"
          badgeLabel="Decreto 67"
          icon={Award}
          accentColor="indigo"
        />
        <AcademicSummaryCard
          title="Asistencia Pupilo"
          value="91.1%"
          subtitle="Cumple requisito MINEDUC"
          badgeLabel="Semana Actual"
          icon={CalendarCheck}
          accentColor="emerald"
        />
        <AcademicSummaryCard
          title="Citaciones"
          value="0 Pendientes"
          subtitle="Convivencia escolar en regla"
          badgeLabel="Estado Normal"
          icon={HeartHandshake}
          accentColor="blue"
        />
      </div>
    </div>
  );
}
