import React from "react";
import Image from "next/image";

export function AurenisLogo({ 
  className = "w-32 h-32", 
  textClassName = "text-slate-900 text-lg font-black tracking-tight" 
}: { 
  className?: string; 
  textClassName?: string 
}) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className={`${className} relative flex items-center justify-center shrink-0`}>
        <Image 
          src="/logonuevo.png" 
          alt="Aurenis Logo" 
          fill
          className="object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className={textClassName}>Aurenis</span>
    </div>
  );
}
