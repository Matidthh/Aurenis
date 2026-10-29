"use client";

import React from "react";
import { Building2, Calendar, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ContextualHeaderProps {
  schoolName: string;
  institutionalCode: string;
  academicYear: string;
  term: string;
  roleTitle: string;
  roleBadgeColor?: string;
  userName: string;
  greeting: string;
  quickActions?: React.ReactNode;
}

export function ContextualHeader({
  schoolName,
  institutionalCode,
  academicYear,
  term,
  roleTitle,
  roleBadgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/30",
  userName,
  greeting,
  quickActions,
}: ContextualHeaderProps) {
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className={cn("px-3 py-1 rounded-full font-bold border flex items-center gap-1.5", roleBadgeColor)}>
              <Sparkles className="w-3.5 h-3.5" />
              {roleTitle}
            </span>
            <span className="text-slate-400 font-medium">| {schoolName} ({institutionalCode})</span>
            <span className="text-slate-400 font-medium">• Año {academicYear} ({term})</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-400" />
              <span>Sesión activa: <strong className="text-slate-200">{userName}</strong></span>
            </p>
          </div>
        </div>

        {quickActions && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">{quickActions}</div>
        )}
      </div>
    </div>
  );
}
