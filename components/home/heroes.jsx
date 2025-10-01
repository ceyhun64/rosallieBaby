"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Heroes() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [heroBg, setHeroBg] = useState(null);
  const [heroMobileBg, setHeroMobileBg] = useState(null);

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

  return (
    <section
      className="relative w-full cursor-pointer"
      onClick={() => router.push("/all_products")}
    >
      {isMobile
        ? heroMobileBg && (
            <Image
              src={heroMobileBg}
              alt="Hero mobile background"
              width={1080}
              height={1350}
              className="w-full h-auto object-cover"
              priority
            />
          )
        : heroBg && (
            <Image
              src={heroBg}
              alt="Hero desktop background"
              width={1920}
              height={800}
              className="w-full h-auto object-cover"
              priority
            />
          )}
    </section>
  );
}
