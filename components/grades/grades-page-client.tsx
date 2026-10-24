"use client";

import React from "react";
import { GradeMatrixSpreadsheet } from "@/components/grades/grade-matrix-spreadsheet";
import type { GradeColorThresholds } from "@/lib/validations/school.schema";

export interface GradesPageClientProps {
  schoolSlug?: string;
  gradeConfig?: {
    minGrade: number;
    maxGrade: number;
    minPassingGrade: number;
    allowDecimals?: boolean;
    precision: number;
    termType?: string;
    colorThresholds?: GradeColorThresholds;
  };
  assessments?: any[];
  readOnly?: boolean;
}

export function GradesPageClient({
  schoolSlug,
  gradeConfig,
  assessments,
  readOnly,
}: GradesPageClientProps) {
  return (
    <div className="space-y-6">
      <GradeMatrixSpreadsheet
        schoolSlug={schoolSlug}
        gradeConfig={gradeConfig}
        readOnly={readOnly}
      />
    </div>
  );
}
