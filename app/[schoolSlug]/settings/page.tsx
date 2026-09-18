import { requireTenantContext } from "@/lib/tenant/context";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { SchoolSettingsView } from "@/components/features/school/school-settings-view";
import { getSchoolFullDetails } from "@/lib/services/school.service";
import { Settings, ShieldCheck } from "lucide-react";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);

  const fullData = await getSchoolFullDetails(tenantCtx.schoolId);

  return (
    <Page width="default">
      <PageHeader
        title="Parametrización Institucional"
        description="Administra los datos oficiales del colegio, régimen lectivo, escala de notas y periodos académicos con ponderación anual."
        badge={
          <Badge variant="brand">
            <Settings className="w-3.5 h-3.5 mr-1" />
            Configuración de {fullData.school.name}
          </Badge>
        }
      />

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Zona Horaria: <strong className="text-slate-700 dark:text-slate-300">{fullData.school.timezone}</strong></span>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <span>País: <strong className="text-slate-700 dark:text-slate-300">{fullData.school.country}</strong></span>
          <span className="hidden sm:inline" aria-hidden="true">•</span>
          <span>Estado: <strong className="text-emerald-600 dark:text-emerald-400">Activo (SaaS Multi-tenant)</strong></span>
        </div>
        <div className="min-w-0 break-all">
          URL / Slug Institucional: <code className="font-mono font-semibold text-brand-600 dark:text-brand-400">/{fullData.school.slug}</code>
        </div>
      </div>

      <SchoolSettingsView
        initialData={fullData}
        schoolId={fullData.school.id}
        schoolSlug={fullData.school.slug}
      />
    </Page>
  );
}

