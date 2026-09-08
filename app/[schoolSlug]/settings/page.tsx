import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Configuración Institucional"
        description="Personaliza el régimen académico, la escala de notas y la identidad visual del colegio."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: `/${schoolSlug}/dashboard` },
              { label: "Configuración" },
            ]}
          />
        }
        badge={
          <Badge variant="brand">
            <Settings className="w-3.5 h-3.5" />
            Ajustes de {school.name}
          </Badge>
        }
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zona Horaria: <strong className="text-slate-700 dark:text-slate-300">{school.timezone}</strong></span>
          <span>•</span>
          <span>País: <strong className="text-slate-700 dark:text-slate-300">{school.country}</strong></span>
        </div>
        <div>
          Slug institucional: <code className="font-mono text-brand-600">/{school.slug}</code>
        </div>
      </div>

      <SchoolSettingsForm schoolId={school.id} initialSettings={initialSettings} />
    </div>
  );
}
