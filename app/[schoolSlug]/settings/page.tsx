import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { SchoolSettingsForm } from "@/components/school/settings-form";
import { Settings, ShieldCheck } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const school = await tenantDb.school.findUniqueOrThrow({
    where: { id: tenantCtx.schoolId },
    include: { settings: true },
  });

  const settings = school.settings;

  const initialSettings = {
    termType: settings?.termType || "SEMESTER",
    minPassingGrade: Number(settings?.minPassingGrade || 4.0),
    minGrade: Number(settings?.minGrade || 1.0),
    maxGrade: Number(settings?.maxGrade || 7.0),
    gradeScalePrecision: settings?.gradeScalePrecision || 1,
    primaryColor: settings?.primaryColor || "#0284c7",
    requireAttendanceNote: settings?.requireAttendanceNote || false,
  };

  return (
    <Page width="narrow">
      <PageHeader
        title="Configuración Institucional"
        description="Personaliza el régimen académico, la escala de notas y la identidad visual del colegio."
        badge={
          <Badge variant="brand">
            <Settings className="w-3.5 h-3.5" />
            Ajustes de {school.name}
          </Badge>
        }
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zona Horaria: <strong className="text-slate-700 dark:text-slate-300">{school.timezone}</strong></span>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <span>País: <strong className="text-slate-700 dark:text-slate-300">{school.country}</strong></span>
        </div>
        <div className="min-w-0 break-all">
          Slug institucional: <code className="font-mono text-brand-600">/{school.slug}</code>
        </div>
      </div>

      <SchoolSettingsForm schoolId={school.id} initialSettings={initialSettings} />
    </Page>
  );
}
