"use client";

import React, { useState } from "react";
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
  subtitleClassName = "text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400",
  showText = true,
  subtitle,
  preferSvg = false,
}: AurenisLogoProps) {
  const [imageError, setImageError] = useState(false);
  const logoSrc = imageError
    ? "/aurenis-logo.svg"
    : preferSvg
    ? "/aurenis-logo.svg"
    : "/logonuevo.png";

  const imageElement = (
    <div
      className={cn("relative flex items-center justify-center shrink-0 select-none", className)}
      suppressHydrationWarning
    >
      <Image
        src={logoSrc}
        alt="Aurenis Logo"
        fill
        sizes="(max-width: 768px) 48px, 64px"
        className={cn("transition-transform duration-200", imageClassName)}
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
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
