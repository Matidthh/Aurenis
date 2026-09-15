import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function StudentsLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        <TableSkeleton
          showToolbar
          rows={8}
          columns={[
            { header: "Estudiante", width: "25%", align: "left" },
            { header: "Identificación (RUN)", width: "18%", align: "left" },
            { header: "Curso Asignado", width: "18%", align: "left" },
            { header: "Apoderado Titular", width: "22%", align: "left" },
            { header: "Estado", width: "10%", align: "left" },
            { header: "Acciones", width: "7%", align: "right" },
          ]}
          showPagination
        />
      </div>
    </Page>
  );
}
