"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "123456") {
      setLoginMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
      router.push("/admin/dashboard");
    } else {
      setLoginMessage("Hatalı email veya şifre!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Right side: Image */}
      <div className="hidden md:flex flex-1 relative">
        <img
          src="/login/adminLogin.jpg"
          alt="Login Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Left side: Form */}
      <div className="flex flex-col justify-center items-center p-8 md:w-[30rem]">
        <div className="w-full max-w-sm bg-gray-900 p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">Admin Girişi</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2">
                * Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:ring-gray-500"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-300 mb-2">
                * Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:ring-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
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
