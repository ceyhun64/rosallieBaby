"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ title, imageUrl, href }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <div
        className="relative w-full h-[500px] md:h-[650px] overflow-hidden group cursor-pointer rounded-xs shadow-lg hover:shadow-2xl transition-all duration-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
          />
        </div>

        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Hover Overlay Effect */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-end p-10 md:p-14">
          <div className="text-center space-y-6 max-w-md">
            {/* Decorative Line */}
            <div
              className="w-16 h-px bg-white/60 mx-auto transform transition-all duration-500"
              style={{
                opacity: isHovered ? 1 : 0.6,
                width: isHovered ? "4rem" : "3rem",
              }}
            />

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-serif font-light text-white tracking-tight leading-tight transform transition-all duration-500 group-hover:scale-105">
              {title}
            </h3>

            {/* Subtitle */}
            <p
              className="text-sm text-white/80 tracking-[0.15em] uppercase font-light transform transition-all duration-500"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(10px)",
              }}
            >
              Premium Selection
            </p>

            {/* CTA Button */}
            <div
              className="hidden md:block transform transition-all duration-700 ease-out pt-2"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(50px)",
              }}
            >
              <button className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-3.5 rounded-full text-sm font-medium tracking-[0.12em] uppercase hover:bg-gray-100 transition-all duration-500 shadow-2xl group/btn">
                Discover Now
                <ArrowRight
                  className="h-4 w-4 transform group-hover/btn:translate-x-2 transition-transform duration-500"
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Top Glow Effect */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}
