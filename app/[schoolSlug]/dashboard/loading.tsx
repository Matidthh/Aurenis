import React from "react";
import { Page } from "@/components/layout/page";
import {
  PageHeaderSkeleton,
  StatCardsGridSkeleton,
  CardSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="space-y-8 max-w-7xl mt-6">
        {/* 1. Tarjetas de Resumen y Métricas Cuantitativas */}
        <StatCardsGridSkeleton
          count={5}
          columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        />

        {/* 2. Accesos directos / Accesos Rápidos */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-3 w-44 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3.5"
              >
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Paneles de Novedades y Actividad */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <Skeleton className="h-5 w-48 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              <CardSkeleton lines={2} hasFooter />
              <CardSkeleton lines={2} hasFooter />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-full rounded-md" />
                    <Skeleton className="h-3 w-1/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Cursos Registrados */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-5 w-44 rounded-md" />
              <Skeleton className="h-3 w-60 rounded-md" />
            </div>
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
