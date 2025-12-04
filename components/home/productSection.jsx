"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Loading from "@/components/layout/loading";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

// Shared Product Section Component
function ProductSection({ title, subtitle, category, decorativeIcon }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/category/${category}`);
        if (!response.ok) throw new Error("Unable to fetch products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <Loading />;
  if (error) return (
    <p className="text-center py-16 text-red-500 font-light">
      Unable to load products. Please try again.
    </p>
  );
  if (products.length === 0) return (
    <p className="text-center py-16 text-gray-500 font-light">
      No products available in this category.
    </p>
  );

  return (
    <section
      className={`container mx-auto ${isMobile ? "px-4 py-12" : "px-8 py-20"} bg-gradient-to-b from-white to-gray-50/30`}
    >
      {/* Elegant Section Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gray-300" />
          {decorativeIcon}
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gray-300" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-serif font-light text-gray-900 tracking-tight">
          {title}
        </h2>
        
        {subtitle && (
          <p className="text-sm font-light text-gray-500 tracking-[0.12em] uppercase">
            {subtitle}
          </p>
        )}
      </div>

      {/* Premium Carousel */}
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={`pl-4 ${
                isMobile
                  ? "basis-[85%]"
                  : "md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              }`}
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Luxury Navigation Buttons */}
        <CarouselPrevious
          className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 z-20 
          bg-white hover:bg-gray-50 text-gray-900 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl 
          transition-all duration-300 border border-gray-200 hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </CarouselPrevious>

        <CarouselNext
          className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 z-20 
          bg-white hover:bg-gray-50 text-gray-900 p-3 md:p-4 rounded-full shadow-xl hover:shadow-2xl 
          transition-all duration-300 border border-gray-200 hover:scale-110"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} />
        </CarouselNext>
      </Carousel>
    </section>
  );
}

// Individual Section Exports
export function MostVisited() {
  return (
    <ProductSection
      title="Most Visited"
      subtitle="Customer Favorites"
      category="hospital_outfit_set"
      decorativeIcon={<Sparkles className="h-5 w-5 text-amber-600/70" strokeWidth={1.5} />}
    />
  );
}

export function MuslinSets() {
  return (
    <ProductSection
      title="Named Muslin Sets"
      subtitle="Personalized Excellence"
      category="hospital_outfit_special_set"
      decorativeIcon={<Sparkles className="h-5 w-5 text-amber-600/70" strokeWidth={1.5} />}
    />
  );
}

export function SleepingFriends() {
  return (
    <ProductSection
      title="Sleeping Friends"
      subtitle="Comfort Companions"
      category="toy"
      decorativeIcon={<Sparkles className="h-5 w-5 text-amber-600/70" strokeWidth={1.5} />}
    />
  );
}