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
        isMobile ? "h-[60vh]" : "h-[80vh]"
      }`}
      onClick={() => router.push("/all_products")}
    >
      <Image
        src={isMobile ? "/heroes/heroes2.webp" : "/heroes/heroes1.webp"}
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />
    </section>
  );
}
