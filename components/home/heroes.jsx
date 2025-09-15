"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Heroes() {
  const router = useRouter();

  return (
    <section
      className="relative w-full h-[80vh] cursor-pointer"
      onClick={() => router.push("/all-products")}
    >
      {/* Background Image */}
      <Image
        src="/heroes/heroes1.webp"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Optional Overlay for better visuals */}
    </section>
  );
}
