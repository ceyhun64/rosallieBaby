"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Heroes() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <section
      className={`relative w-full cursor-pointer ${
        isMobile ? "h-[50vh]" : "h-[120vh]"
      }`}
      onClick={() => router.push("/all_products")}
    >
      <Image
        src={isMobile ? "/heroes/heroes1.jpg" : "/heroes/heroes2.jpg"}
        alt="Hero background"
        fill
        className="object-cover"
        
        priority
      />
    </section>
  );
}
