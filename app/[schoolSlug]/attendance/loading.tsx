import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, TableSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function AttendanceLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        {/* Filtros de Fecha y Curso */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Skeleton className="h-10 w-full sm:w-60 rounded-xl" />
          <Skeleton className="h-10 w-full sm:w-60 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl sm:ml-auto" />
        </div>

        {/* Tabla de Registro de Asistencia */}
        <TableSkeleton
          rows={10}
          columns={[
            { header: "Estudiante", width: "35%", align: "left" },
            { header: "RUN", width: "20%", align: "left" },
            { header: "Estado de Asistencia", width: "25%", align: "left" },
            { header: "Observaciones", width: "20%", align: "left" },
          ]}
          showPagination
        />
      </div>
    </Page>
  );
}
