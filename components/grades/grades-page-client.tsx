"use client";

import React from "react";
import { GradeMatrixSpreadsheet } from "./grade-matrix-spreadsheet";

interface GradesPageClientProps {
  gradeConfig?: {
    minGrade: number;
    maxGrade: number;
    minPassingGrade: number;
    gradeScalePrecision?: number;
  };
  assessments?: any[];
}

export function GradesPageClient({ gradeConfig, assessments }: GradesPageClientProps) {
  return (
    <div className="space-y-6">
      <GradeMatrixSpreadsheet />
    </div>
  );
}
