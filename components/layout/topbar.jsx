import React from "react";
import { Sparkles } from "lucide-react";

export default function Topbar() {
  return (
    <div
      className="
        w-full
        sticky top-0 z-50
        py-3.5
        bg-white/90 backdrop-blur-md
        border-b border-gray-200/40
        shadow-[0_1px_6px_rgba(0,0,0,0.04)]
      "
    >
      <div className="container mx-auto px-4 flex items-center justify-center gap-3">
        
        {/* Icon Left */}
        <div
          className="
            h-6 w-6 flex items-center justify-center 
            rounded-full
            animate-[pulse_2.6s_ease-in-out_infinite]
          "
        >
          <Sparkles
            className="h-3.5 w-3.5 text-amber-500/70"
            strokeWidth={1.7}
          />
        </div>

        {/* Text */}
        <p
          className="
            text-[11px] 
            uppercase font-light tracking-[0.22em]
            text-gray-700
            bg-clip-text text-transparent
            bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700
            select-none
          "
        >
          100% Organic Cotton Muslin Sets — Crafted for Gentle Luxury
        </p>

        {/* Icon Right */}
        <div
          className="
            h-6 w-6 flex items-center justify-center 
            rounded-full
            animate-[pulse_2.6s_ease-in-out_infinite]
          "
        >
          <Sparkles
            className="h-3.5 w-3.5 text-amber-500/70"
            strokeWidth={1.7}
          />
        </div>
      </div>
    </div>
  );
}
