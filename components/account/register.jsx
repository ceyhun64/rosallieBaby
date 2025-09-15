"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

// Register page component
export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log(
      "First Name:",
      firstName,
      "Last Name:",
      lastName,
      "Email:",
      email,
      "Password:",
      password
    );
    setRegisterMessage("Register button clicked!");
  };

  const handleLoginRedirect = () => {
    router.push("/account/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left side: Form */}
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
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-gray-500 mb-2">
                * First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="text-gray-500 mb-2">
                * Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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
              Register
            </Button>
          </form>

          {registerMessage && (
            <div className="mt-4 text-center text-sm text-[#829969]">
              {registerMessage}
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
        </div>
      </div>

      {/* Right side: Image */}
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
