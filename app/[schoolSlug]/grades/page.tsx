import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { listAssessmentsWithGrades, getSchoolGradingConfig } from "@/lib/services/grade.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { GradesPageClient } from "@/components/features/academic/grades-page-client";

export default async function GradesPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const [assessments, gradeConfig] = await Promise.all([
    listAssessmentsWithGrades(tenantDb, tenantCtx.schoolId),
    getSchoolGradingConfig(tenantDb, tenantCtx.schoolId),
  ]);

  return (
    <Page>
      <PageHeader
        title="Libro de Calificaciones & Planilla Matricial"
        description={`Registro oficial de evaluaciones y planilla de alta densidad. Escala configurada: ${gradeConfig.minGrade.toFixed(1)} a ${gradeConfig.maxGrade.toFixed(1)} (Aprobación: ${gradeConfig.minPassingGrade.toFixed(1)}).`}
        badge={
          <Badge variant="brand">
            <Award className="w-3.5 h-3.5" />
            Escala {gradeConfig.minGrade.toFixed(1)} - {gradeConfig.maxGrade.toFixed(1)}
          </Badge>
        }
      />

      <GradesPageClient gradeConfig={gradeConfig} assessments={assessments} />
    </Page>
  );
}
