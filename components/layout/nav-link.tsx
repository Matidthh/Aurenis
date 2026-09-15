"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive } from "@/lib/navigation/routes";
import { cn } from "@/lib/utils/cn";

export interface NavLinkProps {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
  onClick?: () => void;
  id?: string;
  title?: string;
}

/**
 * Enlace dinámico de navegación con resaltado automático de ruta y sección activa
 */
export function NavLink({
  href,
  exact = false,
  className,
  activeClassName = "bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold ring-1 ring-brand-200/50 dark:ring-brand-800/40 shadow-xs",
  inactiveClassName = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white",
  children,
  onClick,
  id,
  title,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isRouteActive(pathname || "/", href, exact);

  return (
    <Link
      id={id}
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={title}
      className={cn(
        "transition-all duration-150 group",
        isActive ? activeClassName : inactiveClassName,
        className
      )}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
}
