import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, badge, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
