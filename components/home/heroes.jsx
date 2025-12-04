"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Heroes() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden group cursor-pointer"
      onClick={() => router.push("/all_products")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 z-10" />

      {/* Image */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <Image
          src="/heroes/heroes.webp"
          alt="Luxury baby essentials"
          width={1920}
          height={800}
          className="w-full h-full object-cover transform transition-transform duration-1000 ease-out group-hover:scale-110"
          priority
        />
      </div>

      {/* CTA Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-6 max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-black/20 backdrop-blur-sm py-6 sm:py-8 md:py-10 rounded-xs shadow-2xl border border-white/10">
          <div className="flex justify-center mb-2 sm:mb-4">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white/80 animate-pulse" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light text-white tracking-tight mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl leading-tight px-2">
              Discover Elegance
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-light text-white/95 tracking-[0.1em] drop-shadow-xl uppercase px-2">
              Handcrafted Premium Collections for Your Little One
            </p>
          </div>

          {/* Luxury Button - Mobile always visible */}
          <div className="mt-2">
            <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-white text-gray-900 text-xs sm:text-sm font-light tracking-[0.15em] uppercase hover:bg-gray-50 transition-all duration-500 shadow-2xl hover:shadow-3xl border border-white/20 backdrop-blur-sm">
              <span className="hidden sm:inline">Explore Collection</span>
              <span className="sm:hidden">Explore</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transform transition-transform duration-500" strokeWidth={1.8} />
            </button>
          </div>

          {/* Decorative Bottom Line */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
            <div className="w-12 sm:w-16 h-px bg-white/60" />
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 md:h-40 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
    </section>
  );
}