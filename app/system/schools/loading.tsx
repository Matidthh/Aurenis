import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function SchoolsLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        <TableSkeleton
          showToolbar
          rows={6}
          columns={[
            { header: "Colegio", width: "35%", align: "left" },
            { header: "Slug", width: "20%", align: "left" },
            { header: "Estado", width: "15%", align: "left" },
            { header: "Fecha Creación", width: "15%", align: "left" },
            { header: "Acciones", width: "15%", align: "right" },
          ]}
          showPagination
        />
      </div>
    </Page>
  );
}
