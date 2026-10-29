"use client";

import React from "react";
import { HeartHandshake, ShieldCheck, FileText, Users } from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";

export interface ConvivenciaDashboardProps {
  schoolSlug: string;
  officerName?: string;
}

export function ConvivenciaDashboard({
  schoolSlug,
  officerName = "Equipo Psicosocial & Convivencia",
}: ConvivenciaDashboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga (LPMM)"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Convivencia Escolar & Dupla Psicosocial"
        roleBadgeColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        userName={officerName}
        greeting="Gestión de Convivencia Escolar & Circular 482 MINEDUC"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Casos Activos"
          value="3"
          subtitle="Seguimiento Psicosocial"
          badgeLabel="Circular 482"
          icon={HeartHandshake}
          accentColor="emerald"
        />
        <AcademicSummaryCard
          title="Mediaciones Concluidas"
          value="12"
          subtitle="Acuerdos formativos vigentes"
          badgeLabel="1er Semestre"
          icon={ShieldCheck}
          accentColor="blue"
        />
        <AcademicSummaryCard
          title="Citaciones Apoderados"
          value="2 Esta Semana"
          subtitle="Coordinadas con inspectoría"
          badgeLabel="Programadas"
          icon={Users}
          accentColor="amber"
        />
        <AcademicSummaryCard
          title="Informes Formativos"
          value="100%"
          subtitle="Cumplimiento con Superintendencia"
          badgeLabel="Auditoría OK"
          icon={FileText}
          accentColor="indigo"
        />
      </div>
    </div>
  );
}
