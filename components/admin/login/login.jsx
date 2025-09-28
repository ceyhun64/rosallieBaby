"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // NextAuth login
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setLoginMessage("Hatalı email veya şifre!");
      return;
    }

    // Admin role kontrolü
    const sessionRes = await fetch("/api/account/check");
    const sessionData = await sessionRes.json();

    if (!sessionData.user || sessionData.user.role !== "ADMIN") {
      setLoginMessage("Bu alan sadece adminlere açıktır!");
      return;
    }

    setLoginMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      <div className="hidden md:flex flex-2 relative">
        <img
          src="/login/adminLogin.jpg"
          alt="Login Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8 bg-black">
        <div className="w-full max-w-sm bg-stone-900 p-6 md:p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-600 mb-4 text-center">
            RosallieBaby
          </h1>
          <Separator className={"my-4"} />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Admin Girişi
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-stone-300 mb-2">
                * Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-stone-800 text-white placeholder-stone-500 border-stone-700 focus:ring-stone-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-stone-300 mb-2">
                * Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10 bg-stone-800 text-white placeholder-stone-500 border-stone-700 focus:ring-stone-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-stone-700 hover:bg-stone-600 text-white"
            >
              Login
            </Button>
          </form>

          {loginMessage && (
            <div
              className={`mt-4 text-center text-sm ${
                loginMessage.includes("başarılı")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {loginMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
