import React from "react";
import { cn } from "@/lib/utils/cn";
import { StatCardSkeleton } from "./skeleton";

export interface StatCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function StatCard({ title, value, subtitle, icon, className, isLoading }: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton className={className} />;
  }

  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2",
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        {icon && <div className="text-brand-600">{icon}</div>}
      </div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value ?? "—"}</p>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

export { StatCardSkeleton };
