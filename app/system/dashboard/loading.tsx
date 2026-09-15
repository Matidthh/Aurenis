import React from "react";
import { Page } from "@/components/layout/page";
import {
  PageHeaderSkeleton,
  StatCardsGridSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton";

export default function SystemDashboardLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="space-y-8 max-w-7xl mt-6">
        {/* Métricas del Sistema */}
        <StatCardsGridSkeleton
          count={3}
          columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        />

        {/* Tabla de Colegios Recientes */}
        <TableSkeleton
          rows={5}
          columns={[
            { header: "Institución Educativa", width: "40%", align: "left" },
            { header: "Identificador", width: "20%", align: "left" },
            { header: "Estado Operativo", width: "20%", align: "left" },
            { header: "Gestión", width: "20%", align: "right" },
          ]}
          showPagination={false}
        />
      </div>
    </Page>
  );
}
