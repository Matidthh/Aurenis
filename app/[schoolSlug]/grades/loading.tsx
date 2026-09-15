import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function GradesLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        {/* Selector de Curso y Asignatura */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl sm:ml-auto" />
        </div>

        {/* Matriz de Calificaciones */}
        <TableSkeleton
          rows={8}
          columns={[
            { header: "Estudiante", width: "25%", align: "left" },
            { header: "RUN", width: "15%", align: "left" },
            { header: "Nota 1", width: "10%", align: "center" },
            { header: "Nota 2", width: "10%", align: "center" },
            { header: "Nota 3", width: "10%", align: "center" },
            { header: "Nota 4", width: "10%", align: "center" },
            { header: "Promedio", width: "10%", align: "center" },
            { header: "Estado", width: "10%", align: "right" },
          ]}
          showPagination={false}
        />
      </div>
    </Page>
  );
}
