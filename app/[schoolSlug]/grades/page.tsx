import { requireTenantContext } from "@/lib/tenant/context";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { getGradeMatrixData } from "@/lib/services/grade.service";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Award, Table } from "lucide-react";
import { GradeMatrixView } from "@/components/academic/grade-matrix-view";

export default async function GradesPage({
  params,
  searchParams,
}: {
  params: Promise<{ schoolSlug: string }>;
  searchParams?: Promise<{ courseId?: string; subjectId?: string; periodId?: string }>;
}) {
  const { schoolSlug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tenantCtx = await requireTenantContext(schoolSlug);
  const tenantDb = createTenantPrisma(tenantCtx.schoolId);

  const matrixData = await getGradeMatrixData(tenantDb, tenantCtx.schoolId, {
    courseId: resolvedSearchParams.courseId,
    subjectId: resolvedSearchParams.subjectId,
    periodId: resolvedSearchParams.periodId,
  });

  return (
    <Page>
      <PageHeader
        title="Planilla Matricial de Calificaciones"
        description={`Libro de clases y registro de evaluaciones por asignatura. Escala oficial: ${matrixData.gradingConfig.minGrade.toFixed(1)} a ${matrixData.gradingConfig.maxGrade.toFixed(1)} (Aprobación: ${matrixData.gradingConfig.minPassingGrade.toFixed(1)}).`}
        badge={
          <Badge variant="brand">
            <Award className="w-3.5 h-3.5" />
            Escala {matrixData.gradingConfig.minGrade.toFixed(1)} - {matrixData.gradingConfig.maxGrade.toFixed(1)}
          </Badge>
        }
      />

      <GradeMatrixView
        initialData={matrixData}
        schoolSlug={schoolSlug}
        schoolId={tenantCtx.schoolId}
      />
    </Page>
  );
}

