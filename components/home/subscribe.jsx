// components/SubscribeSection.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function SubscribeSection() {
  return (
    <section className="w-full bg-cover bg-center py-16 md:py-24 relative">
      {/* Darker Overlay Layer */}
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
        <form className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-0 max-w-lg mx-auto">
          <Input
            type="email"
            placeholder="Your email address"
            className="w-full md:w-auto flex-1 px-5 py-3 rounded-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          />
          <Button
            type="submit"
            className="w-full md:w-auto bg-[#96a978] text-white font-bold  rounded-none px-8 py-3 shadow-lg hover:bg-[#85966a] transition-colors"
          >
            JOIN US!
          </Button>
        </form>
      </div>
    </section>
  );
}
