"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ContextualHeaderProps {
  schoolName: string;
  institutionalCode?: string;
  academicYear?: string;
  term?: string;
  roleTitle: string;
  roleBadgeColor?: string;
  userName: string;
  greeting?: string;
  quickActions?: React.ReactNode;
  className?: string;
}

export function ContextualHeader({
  schoolName,
  institutionalCode = "RBD 10240",
  academicYear = "2026",
  term = "1er Semestre",
  roleTitle,
  roleBadgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/30",
  userName,
  greeting = "Panel de Control Académico",
  quickActions,
  className,
}: ContextualHeaderProps) {
  const [timeGreeting, setTimeGreeting] = useState("Buenos días");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setTimeGreeting("Buenos días");
    } else if (hour >= 12 && hour < 20) {
      setTimeGreeting("Buenas tardes");
    } else {
      setTimeGreeting("Buenas noches");
    }
  }, []);

  return (
    <div
      className={cn(
        "relative rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-300",
        "bg-gradient-to-br from-[#0B1528] via-[#0F1F3D] to-[#0A1224] text-white",
        "border border-slate-700/60 shadow-xl shadow-slate-950/30",
        className
      )}
    >
      {/* Resplandores y Luces Ambientales */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-cyan-600/20 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Información Contextual Izquierda */}
        <div className="space-y-3 max-w-2xl">
          {/* Metadata Institucional */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <Building2 className="w-4 h-4 text-blue-400" />
              {schoolName}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
              {institutionalCode}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Año Lectivo {academicYear} ({term})
            </span>
          </div>

          {/* Saludo y Nombre del Usuario */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn("text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg border tracking-wide", roleBadgeColor)}>
                {roleTitle}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                MINEDUC Sincronizado
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-blue-300 font-medium bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                <Clock className="w-3 h-3 text-blue-400" />
                JEC Activa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{timeGreeting}, {userName.split(" ")[0]}</span>
              <Sparkles className="w-5 h-5 text-amber-400 inline shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {greeting} · Sesión oficial de <strong className="text-white font-semibold">{userName}</strong>.
            </p>
          </div>
        </div>

        {/* Acciones Rápidas del Rol */}
        {quickActions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            {quickActions}
          </div>
        )}
      </div>
    </div>
  );
}
