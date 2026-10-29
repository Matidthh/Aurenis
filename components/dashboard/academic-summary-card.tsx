"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AcademicSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeLabel?: string;
  icon: LucideIcon;
  accentColor?: "blue" | "emerald" | "amber" | "indigo" | "rose" | "purple";
  trend?: { value: string; isPositive: boolean };
  href?: string;
}

export function AcademicSummaryCard({
  title,
  value,
  subtitle,
  badgeLabel,
  icon: Icon,
  accentColor = "blue",
  trend,
  href,
}: AcademicSummaryCardProps) {
  const CardContent = (
    <div className="bg-white dark:bg-[#0C1425] rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all group flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          {badgeLabel && (
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
              {badgeLabel}
            </span>
          )}
        </div>

        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
          accentColor === "blue" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
          accentColor === "emerald" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          accentColor === "amber" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
          accentColor === "indigo" && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
          accentColor === "rose" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
          accentColor === "purple" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-md",
              trend.isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" : "text-rose-600 bg-rose-50 dark:bg-rose-950/40"
            )}>
              {trend.value}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}
