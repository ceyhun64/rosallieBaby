"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Sparkles } from "lucide-react"; // Sparkles eklendi
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useIsMobile(); // Kullanılmasa da tutulabilir

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("Registering...");

    try {
      // API çağrısı kısmı olduğu gibi bırakıldı
      const res = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          surname,
          email,
          password,
          marketingConsent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterMessage(data.error || "Registration failed!");
        return;
      }

      setRegisterMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/account/login"), 1500);
    } catch (err) {
      console.error(err);
      setRegisterMessage("Server error, please try again.");
    }
  };

  const handleLoginRedirect = () => {
    router.push("/account/login");
  };

  return (
    // 1. Ana Kapsayıcı: Tam ekran yüksekliği ve arka plan resmi
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 2. Arka Plan Resmi */}
      <div className="absolute inset-0 z-0">
        {/* Lütfen bu görseli projenizdeki /public/login/register.jpg yoluyla güncelleyin. */}
        <img
          src="/login/register.webp"
          alt="Elegant lifestyle background for register"
          className="w-full h-full object-cover"
        />
        {/* Karartma (Overlay) katmanı: Formun okunurluğunu artırır */}
        <div className="absolute inset-0 bg-black/30 backdrop-brightness-75" />
      </div>

      {/* 3. Form Kapsayıcısı - Dikeyde Ortalama */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-10">
        <div className="w-full max-w-lg mx-auto">
          {/* 4. Glassmorphism Etkisi Verilen Form Kutusu */}
          <div
            className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-xs shadow-2xl border border-white/20 
                       transform transition-all duration-500 hover:shadow-rose-500/30"
          >
            {/* Header / Navigasyon */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px flex-1 bg-white/40" />
                <Sparkles className="h-5 w-5 text-rose-300" strokeWidth={1.5} />
                <div className="h-px flex-1 bg-white/40" />
              </div>

              <div className="flex justify-center items-center mb-6">
                {/* Login butonu, stil tutarlılığı için güncellendi */}
                <button
                  onClick={handleLoginRedirect}
                  className="text-lg text-white/70 hover:text-white relative group transition-colors mr-6"
                >
                  Login
                  <span className="absolute bottom-0 left-0 w-full h-px bg-white/50 transition-all duration-300 group-hover:bg-rose-300" />
                </button>
                <h2 className="text-3xl font-bold text-white drop-shadow-md">Register</h2>
              </div>
              <p className="text-center text-sm font-light text-white/80 tracking-wide drop-shadow-sm">
                Join us to start your premium experience
              </p>
            </div>

            {/* Kayıt Formu */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Ad ve Soyad, yanyana yapıldı */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Ad Input */}
                <div className="flex-1">
                  <Label htmlFor="name" className="text-white/80 mb-2 block">
                    * First Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    // Glassmorphism Input Stili
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-rose-300"
                  />
                </div>
                {/* Soyad Input */}
                <div className="flex-1">
                  <Label htmlFor="surname" className="text-white/80 mb-2 block">
                    * Last Name
                  </Label>
                  <Input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    // Glassmorphism Input Stili
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-rose-300"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <Label htmlFor="email" className="text-white/80 mb-2 block">
                  * Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  // Glassmorphism Input Stili
                  className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-rose-300"
                />
              </div>

              {/* Password Input */}
              <div>
                <Label htmlFor="password" className="text-white/80 mb-2 block">
                  * Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10 bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-rose-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-black/60 hover:text-black transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Pazarlama Onayı (Checkbox) */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 appearance-none h-4 w-4 border border-white/50 rounded-xs bg-white/10 
                             checked:bg-rose-400 checked:border-rose-400 focus:outline-none transition-all"
                  style={{ minWidth: '1rem' }} // Checkbox'ın küçülmesini engeller
                />
                <label
                  htmlFor="marketingConsent"
                  className="text-white/70 text-sm drop-shadow-sm cursor-pointer"
                >
                  I have read and agree to the{" "}
                  <strong className="text-white">Commercial Electronic Message Consent</strong>.
                </label>
              </div>

              {/* Kayıt Butonu */}
              <Button
                type="submit"
                className="group w-full relative overflow-hidden bg-white/90 text-slate-900 py-4 rounded-full 
                           hover:bg-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium tracking-widest uppercase">
                  {registerMessage.includes("Registering") ? "Processing..." : "Register"}
                 
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-rose-400/10 via-rose-400/50 to-rose-400/10 
                             translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </Button>
            </form>

            {/* Mesaj Alanı */}
            {registerMessage && (
              <div className={`mt-4 text-center text-sm font-light tracking-wide drop-shadow-sm ${
                    registerMessage.includes("successful")
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
              >
                {registerMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}