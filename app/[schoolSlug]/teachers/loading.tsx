import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function TeachersLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        <TableSkeleton
          showToolbar
          rows={6}
          columns={[
            { header: "Profesor", width: "30%", align: "left" },
            { header: "Identificación (RUN)", width: "20%", align: "left" },
            { header: "Email", width: "25%", align: "left" },
            { header: "Estado", width: "15%", align: "left" },
            { header: "Acciones", width: "10%", align: "right" },
          ]}
          showPagination
        />
      </div>
    </Page>
  );
}
