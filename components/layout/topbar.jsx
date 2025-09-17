import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Topbar() {
  const isMobile = useIsMobile();
  return (
    <div className="w-full bg-[#ffb14b] py-2 text-center sticky top-0 z-50  ">
      <p
        className={` font-medium text-white${isMobile ? "text-xs" : "text-md"}`}
      >
        100% organic cotton muslin sets are waiting for you
      </p>
    </div>
  );
}
