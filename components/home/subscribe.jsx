"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SubscribeSection() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success veya error mesajı

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(""); // önce mesajı temizle

    if (!email) {
      setStatus("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus(data.error || "Something went wrong.");
        return;
      }

      setStatus("Successfully subscribed! 🎉");
      setEmail(""); // inputu temizle
    } catch (error) {
      setStatus("Something went wrong. Try again later.");
    }
  };

  return (
    <section className="w-full bg-cover bg-center py-16 md:py-24 relative">
      {/* Background Image */}
      <Image
        src="/subscribe/subscribe.webp"
        alt="Subscribe"
        layout="fill"
        objectFit="cover"
        className="brightness-90"
      />
      <div className="absolute inset-0 bg-black/85 z-0"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wide">
          Don't Miss Out
        </h2>
        <p className="text-base md:text-lg text-white mb-8 max-w-xl mx-auto">
          Leave your email now to stay updated on new product announcements,
          limited-time discounts, and much more!
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-0 max-w-lg mx-auto"
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-auto flex-1 px-5 py-3 rounded-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          />
          <Button
            type="submit"
            className={`${
              isMobile ? "w-1/3" : "w-full md:w-auto"
            } bg-[#96a978] text-white font-bold rounded-none px-8 py-3 shadow-lg hover:bg-[#85966a] transition-colors`}
          >
            JOIN US!
          </Button>
        </form>

        {/* Status Message */}
        {status && <p className="mt-4 text-white font-semibold">{status}</p>}
      </div>
    </section>
  );
}
