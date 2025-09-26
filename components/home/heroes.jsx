"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Heroes() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [heroBg, setHeroBg] = useState("");
  const [heroMobileBg, setHeroMobileBg] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/setting");
        if (!res.ok) throw new Error("Ayarlar getirilemedi");
        const data = await res.json();
        setHeroBg(data.heroBg || "/heroes/heroes2.jpg");
        setHeroMobileBg(data.heroMobileBg || "/heroes/heroes1.jpg");
      } catch (err) {
        console.error(err);
      }
    }
    fetchSettings();
  }, []);

  const bgImage = isMobile ? heroMobileBg : heroBg;

  return (
    <section
      className={`relative w-full cursor-pointer ${
        isMobile ? "h-[50vh]" : "h-[120vh]"
      }`}
      onClick={() => router.push("/all_products")}
    >
      {bgImage && (
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      )}
    </section>
  );
}
