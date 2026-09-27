"use client";

import React from "react";
import { GradeMatrixSpreadsheet } from "@/components/grades/grade-matrix-spreadsheet";

export interface GradesPageClientProps {
  gradeConfig?: {
    minGrade: number;
    maxGrade: number;
    minPassingGrade: number;
    allowDecimals?: boolean;
    precision: number;
    termType?: string;
  };
  assessments?: any[];
}

export function GradesPageClient({
  gradeConfig,
  assessments,
}: GradesPageClientProps) {
  return (
    <div className="space-y-6">
      <GradeMatrixSpreadsheet />
    </div>
  );
}
