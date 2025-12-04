"use client";
import React, { useRef, useState, useEffect } from "react";
import CategoryCard from "./categoryCard";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  {
    title: "Hospital Outfit Specaial Sets",
    imageUrl: "/categories/category1.webp",
    href: "/all_products/hospital_outfit_special_set",
  },
  {
    title: "Hospital Outfit Sets",
    imageUrl: "/categories/category2.webp",
    href: "/all_products/hospital_outfit_set",
  },
  {
    title: "Toys",
    imageUrl: "/categories/category3.webp",
    href: "/all_products/toy",
  },
];

export default function Categories() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      let index = Math.round(scrollLeft / width);

      if (index >= categories.length) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        index = 0;
      }

      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`${isMobile ? "px-0 py-8" : "px-12 py-16"} container mx-auto`}
    >
      {/* Section Header */}
      <h2
        className="text-center font-light mb-5 md:mb-10 
    text-[18px] md:text-[32px] tracking-[0.18em] 
    text-gray-900 uppercase"
      >
        <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
          Shop By Category
        </span>

        <div className="mx-auto mt-4 w-16 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full opacity-80" />
      </h2>

      {/* Categories Grid/Carousel */}
      <div
        ref={containerRef}
        className="md:grid md:grid-cols-3 md:gap-6 flex md:flex-none overflow-x-auto snap-x snap-mandatory relative scroll-smooth scrollbar-hide"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex-none w-screen md:w-auto snap-start relative"
          >
            <CategoryCard
              title={category.title}
              imageUrl={category.imageUrl}
              href={category.href}
            />

            {/* Mobile Dots Indicator */}
            {isMobile && index === activeIndex && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {categories.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIndex === activeIndex
                        ? "w-8 bg-white"
                        : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
