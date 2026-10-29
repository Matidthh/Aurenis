import React from "react";
import { RoleDashboardShell } from "@/components/dashboard/role-dashboard-shell";

interface PageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

export default async function SchoolDashboardPage({ params }: PageProps) {
  const { schoolSlug } = await params;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070C18] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <RoleDashboardShell
          schoolSlug={schoolSlug}
          schoolName="Liceo Politécnico Marga Marga (LPMM)"
          defaultRole="DIRECTIVO"
        />
      </div>
    </main>
  );
}
