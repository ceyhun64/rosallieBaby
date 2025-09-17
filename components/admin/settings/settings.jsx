"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";

export default function Settings() {
  const [siteName, setSiteName] = useState("RosallieBaby.com");
  const [description, setDescription] = useState("Bebek ürünleri mağazası");
  const [logo, setLogo] = useState("/logo/logo.webp");

  // Hero state
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
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroBg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroMobileBgChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroMobileBg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Kaydedilen ayarlar:", {
      siteName,
      description,
      logo,
      hero: {
        title: heroTitle,
        subtitle: heroSubtitle,
        background: heroBg,
      },
    });
    alert("Ayarlar kaydedildi!");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 ml-64 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Site Ayarları</h1>
          <div className="flex items-center gap-3">
            <Link href="/" passHref>
              <Button
                variant="default"
                className="border-stone-600 text-white hover:bg-stone-800"
              >
                Websiteye Git
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Kaydet
            </Button>
          </div>
        </div>

        {/* Logo Yükleme */}
        <div className="p-6 bg-stone-900 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          <div className="flex items-center gap-6">
            <Image
              src={logo}
              alt="Site Logosu"
              width={100}
              height={40}
              className=" object-contain border border-stone-700 rounded-lg bg-white"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="bg-black border border-stone-700 text-white"
            />
          </div>
        </div>

        {/* Hero Ayarları */}
        <div className="p-6 bg-stone-900 rounded-xl shadow-lg space-y-6">
          <h2 className="text-xl font-semibold">Hero Bölümü</h2>

          {/* Başlık ve Alt Başlık */}
          <div className="space-y-4">
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
                width={500}
                height={300}
                className="object-cover border border-stone-700 rounded-lg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeroBgChange}
                className="bg-black border border-stone-700 text-white mt-2"
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
                width={250}
                height={500}
                className="object-cover border border-stone-700 rounded-lg"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleHeroMobileBgChange}
                className="bg-black border border-stone-700 text-white mt-2"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
