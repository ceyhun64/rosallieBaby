import React from "react";
import { Sparkles } from "lucide-react";

export default function Topbar() {
  return (
    <div
      className="
        w-full
        sticky top-0 z-50
        py-3.5
        bg-[#cfb9a1] backdrop-blur-md
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
            className="h-3.5 w-3.5 text-white"
            strokeWidth={1.7}
          />
        </div>

        {/* Text */}
        <p
          className="
    text-[8px] md:text-[11px] 
    uppercase tracking-[0.22em]
    text-white
    bg-clip-text
    
    select-none
    text-center
  "
        >
          FREE SHIPPING ON ALL ORDERS $250+ (USA ONLY)
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
            className="h-3.5 w-3.5 text-white"
            strokeWidth={1.7}
          />
        </div>
      </div>
    </div>
  );
}
