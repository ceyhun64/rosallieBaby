"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/products/productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";

// Product Card Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Bestseller Skeleton Component
function BestsellerSkeleton() {
  return (
    <section className="container mx-auto py-16 px-4">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-px w-24 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto mt-6" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <div className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </section>
  );
}

export default function Bestseller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          const shuffled = data.products.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          setProducts(selected);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <BestsellerSkeleton />;
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="container mx-auto py-16 px-4">
      {/* Premium Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-light tracking-wide text-gray-800 mb-4">
          Bestsellers
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm tracking-wide mt-6">
          Discover our most loved products
        </p>
      </div>

      {/* Premium Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-1 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Premium Navigation Buttons */}
        <CarouselPrevious
          className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-sm text-black p-3 rounded-full shadow-lg 
                hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
        />

        <CarouselNext
          className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-sm text-black p-3 rounded-full shadow-lg 
                hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
        />
      </Carousel>
    </section>
  );
}
