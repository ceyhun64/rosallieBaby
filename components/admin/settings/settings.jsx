"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const isMobile = useIsMobile();

  const [logo, setLogo] = useState("");
  const [heroBg, setHeroBg] = useState("");
  const [heroMobileBg, setHeroMobileBg] = useState("");
  const [loading, setLoading] = useState(true);

  // İlk açılışta DB’den ayarları al
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/setting");
        if (!res.ok) throw new Error("Ayarlar getirilemedi");
        const data = await res.json();

        setLogo(data.logo || "/logo/logo.webp");
        setHeroBg(data.heroBg || "/heroes/heroes1.webp");
        setHeroMobileBg(data.heroMobileBg || "/heroes/heroes2.webp");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Upload failed:", text);
      return;
    }

    const data = await res.json();
    if (data.path) setLogo(data.path);
  };

  const handleHeroBgChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const text = await res.text();
      console.error("Upload failed:", text);
      return;
    }

    const data = await res.json();
    if (data.path) setHeroBg(data.path); // artık sadece URL kaydediliyor
  };

  const handleHeroMobileBgChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Upload failed:", text);
      return;
    }

    const data = await res.json();
    if (data.path) setHeroMobileBg(data.path);
  };

  const handleSave = async () => {
    try {
      const payload = {
        logo,
        heroBg,
        heroMobileBg,
      };

      console.log("payload:", payload);
      const res = await fetch("/api/setting", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız!");

      alert("Ayarlar kaydedildi ✅");
    } catch (err) {
      console.error(err);
      alert("Kaydedilemedi ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Yükleniyor...
      </div>
    );
  }

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
        <div className="p-6 bg-stone-900 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row items-center md:items-start gap-4">
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
