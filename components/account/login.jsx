"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Main login component
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    setLoginMessage("Login button clicked!");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center items-center p-8 md:w-[30rem]">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            {/* Title on left */}
            <h2 className="text-3xl font-bold text-[#829969]">Login</h2>
            {/* Button on right */}
            <button
              onClick={() => router.push("/account/register")}
              className="text-lg text-gray-500 hover:text-[#829969]"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-500 mb-2">
                * Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-500 mb-2">
                * Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#829969] hover:bg-[#6f855a] text-white"
            >
              Login
            </Button>
          </form>

          {loginMessage && (
            <div className="mt-4 text-center text-sm text-[#829969]">
              {loginMessage}
            </div>
          )}

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            Sign in with Google
          </Button>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Right side: Image */}
      <div className="hidden md:flex flex-1 relative">
        <img
          src="/login/login.jpg"
          alt="Login Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
