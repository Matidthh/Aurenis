import React from "react";
import Image from "next/image";

export function AurenisLogo({ 
  className = "w-10 h-10", 
  textClassName = "text-slate-900 text-lg font-black tracking-tight",
  showText = true,
}: { 
  className?: string; 
  textClassName?: string;
  showText?: boolean;
}) {
  const imageElement = (
    <div className={`${className} relative flex items-center justify-center shrink-0`} suppressHydrationWarning>
      <Image 
        src="/logonuevo.png" 
        alt="Aurenis Logo" 
        fill
        className="object-contain"
        referrerPolicy="no-referrer"
        priority
      />
    </div>
  );

  if (!showText) {
    return imageElement;
  }

  return (
    <div className="flex items-center gap-3 group cursor-pointer" suppressHydrationWarning>
      {imageElement}
      <span className={textClassName}>Aurenis</span>
    </div>
  );
}
