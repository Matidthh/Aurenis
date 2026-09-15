import React from "react";
import { Page } from "@/components/layout/page";
import { PageHeaderSkeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <Page>
      <PageHeaderSkeleton />

      <div className="max-w-7xl space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={3} hasHeader hasFooter />
          ))}
        </div>
      </div>
    </Page>
  );
}
