"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SchoolSummary } from "@/types/tenant";
import { School, ChevronRight, Loader2 } from "lucide-react";

export function SchoolSelectorList({ schools }: { schools: SchoolSummary[] }) {
  const router = useRouter();
  const [loadingSchoolId, setLoadingSchoolId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(schoolId: string) {
    setLoadingSchoolId(schoolId);
    setError(null);

    try {
      const res = await fetch("/api/auth/select-school", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No fue posible ingresar a la institución");
      }

      const redirectUrl = data.data?.redirectUrl || data.redirectUrl;
      router.push(redirectUrl || "/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoadingSchoolId(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {schools.map((school) => {
        const isCurrentLoading = loadingSchoolId === school.id;

        return (
          <button
            key={school.id}
            onClick={() => handleSelect(school.id)}
            disabled={loadingSchoolId !== null}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition text-left group disabled:opacity-60"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-900 group-hover:scale-105 transition-transform">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 transition">
                  {school.name}
                </h3>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-1">
                  {school.roleDisplayName}
                </span>
              </div>
            </div>

            <div>
              {isCurrentLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
