"use client";

import React from "react";
import { Inbox } from "lucide-react";

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DashboardEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: DashboardEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-[#0C1425] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
