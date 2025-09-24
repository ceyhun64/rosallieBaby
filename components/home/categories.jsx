"use client";
import React, { useRef, useState, useEffect } from "react";
import CategoryCard from "./categoryCard";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  {
    title: "Hospital Outfit Sets",
    imageUrl: "/categories/category1.webp",
    href: "/all_products/hospital-outfit-set",
  },
  {
    title: "Toys",
    imageUrl: "/categories/category2.webp",
    href: "/all_products/toy",
  },
  {
    title: "Pillows",
    imageUrl: "/categories/category3.webp",
    href: "/all_products/pillow",
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

      // Sonsuz döngü: en sona gelince başa dön
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
      className={`${isMobile ? "px-0 py-5" : "px-12 py-12"} container mx-auto `}
    >
      <div
        ref={containerRef}
        className="md:grid md:grid-cols-3 md:gap-8 flex md:flex-none overflow-x-auto snap-x snap-mandatory relative scroll-smooth"
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
           

            {isMobile && index === activeIndex && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {categories.map((_, dotIndex) => (
                  <span
                    key={dotIndex}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      dotIndex === activeIndex ? "bg-black" : "bg-gray-400"
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
