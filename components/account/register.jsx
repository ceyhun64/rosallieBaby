"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  const isMobile = useIsMobile();

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("Registering...");

    try {
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
    <div
      className={`bg-white min-h-screen flex flex-col md:flex-row font-sans ${
        isMobile ? "mt-10" : "mt-0"
      }`}
    >
      <div className="flex flex-col justify-center items-center p-8 md:w-[30rem]">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleLoginRedirect}
              className="text-lg text-gray-500 hover:text-[#829969]"
            >
              Login
            </button>
            <h2 className="text-3xl font-bold text-[#829969]">Register</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-500 mb-2">
                * First Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="surname" className="text-gray-500 mb-2">
                * Last Name
              </Label>
              <Input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>

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

            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1"
              />
              <label
                htmlFor="marketingConsent"
                className="text-gray-500 text-sm"
              >
                I have read and agree to the{" "}
                <strong>Commercial Electronic Message Consent</strong>.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#829969] hover:bg-[#6f855a] text-white"
            >
              Register
            </Button>
          </form>

          {registerMessage && (
            <div className="mt-4 text-center text-sm text-[#829969]">
              {registerMessage}
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-1 relative">
        <img
          src="/login/register.jpg"
          alt="Register Image"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}
