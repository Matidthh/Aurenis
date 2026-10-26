"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface AurenisLogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  showText?: boolean;
  subtitle?: string;
  variant?: "brand" | "white" | "monochrome";
  preferSvg?: boolean;
}

export function AurenisLogo({
  className = "w-9 h-9",
  imageClassName = "object-contain",
  textClassName = "text-slate-900 dark:text-white text-lg font-black tracking-tight",
  subtitleClassName = "text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400",
  showText = true,
  subtitle,
}: AurenisLogoProps) {
  const logoSrc = "/logonuevo.png";

  const imageElement = (
    <div
      className={cn("relative flex items-center justify-center shrink-0 select-none overflow-hidden", className)}
      suppressHydrationWarning
    >
      <Image
        src={logoSrc}
        alt="Aurenis Logo"
        width={160}
        height={160}
        className={cn("w-full h-full object-contain transition-transform duration-200", imageClassName)}
        referrerPolicy="no-referrer"
        priority
      />
    </div>
  );

  if (!showText) {
    return imageElement;
  }

  return (
    <div className="flex items-center gap-3 group select-none" suppressHydrationWarning>
      {imageElement}
      <div className="flex flex-col justify-center">
        <span className={cn("leading-none transition-colors", textClassName)}>Aurenis</span>
        {subtitle && (
          <span className={cn("leading-tight mt-0.5", subtitleClassName)}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
