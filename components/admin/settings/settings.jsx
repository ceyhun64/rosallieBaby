"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const isMobile = useIsMobile();
  const [siteName, setSiteName] = useState("RosallieBaby.com");
  const [description, setDescription] = useState("Bebek ürünleri mağazası");
  const [logo, setLogo] = useState("/logo/logo.webp");

  const [heroTitle, setHeroTitle] = useState("Hoş Geldiniz!");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "En kaliteli bebek ürünlerini keşfedin."
  );
  const [heroBg, setHeroBg] = useState("/heroes/heroes1.webp");
  const [heroMobileBg, setHeroMobileBg] = useState("/heroes/heroes2.webp");

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeroBg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleHeroMobileBgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeroMobileBg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Kaydedilen ayarlar:", {
      siteName,
      description,
      logo,
      hero: { title: heroTitle, subtitle: heroSubtitle, background: heroBg },
    });
    alert("Ayarlar kaydedildi!");
  };

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      <Sidebar />
      <main
        className={`flex-1 p-4 md:p-8 transition-all duration-300 ${
          isMobile ? "ml-0" : "ml-64"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
            Ayarlar
          </h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Link href="/" passHref>
              <Button
                variant="default"
                className="border-stone-600 text-white hover:bg-stone-800 w-full md:w-auto"
              >
                Websiteye Git
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-500 text-white w-full md:w-auto"
            >
              Kaydet
            </Button>
          </div>
        </div>

        {/* Logo Yükleme */}
        {/* Logo Yükleme */}
        <div className="p-6 bg-stone-900 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Logo ve Input */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto">
            <Image
              src={logo}
              alt="Site Logosu"
              width={100}
              height={40}
              className="object-contain border border-stone-700 rounded-lg bg-white"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="bg-black border border-stone-700 text-white w-full md:w-auto"
            />
          </div>
        </div>

        {/* Hero Ayarları */}
        <div className="p-6 bg-stone-900 rounded-xl shadow-lg space-y-6">
          <h2 className="text-xl font-semibold">Hero Bölümü</h2>

          {/* Başlık ve Alt Başlık */}
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Hero Başlığı"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400"
            />
            <Input
              type="text"
              placeholder="Hero Alt Başlığı"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>

          {/* Görseller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Hero */}
            <div className="bg-stone-800 p-4 rounded-lg flex flex-col items-center">
              <p className="mb-2 text-sm text-stone-400 font-medium">
                Masaüstü Görsel
              </p>
              <Image
                src={heroBg}
                alt="Hero Background"
                width={isMobile ? 300 : 500}
                height={isMobile ? 180 : 300}
                className="object-cover border border-stone-700 rounded-lg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeroBgChange}
                className="bg-black border border-stone-700 text-white mt-2 w-full"
              />
            </div>

            {/* Mobile Hero */}
            <div className="bg-stone-800 p-4 rounded-lg flex flex-col items-center">
              <p className="mb-2 text-sm text-stone-400 font-medium">
                Mobil Görsel
              </p>
              <Image
                src={heroMobileBg}
                alt="Hero Mobile Background"
                width={isMobile ? 200 : 250}
                height={isMobile ? 360 : 500}
                className="object-cover border border-stone-700 rounded-lg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeroMobileBgChange}
                className="bg-black border border-stone-700 text-white mt-2 w-full"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
