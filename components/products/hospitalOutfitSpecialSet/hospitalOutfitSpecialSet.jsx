"use client";

import ProductToolbar from "@/components/products/productToolBar";
import Breadcrumb from "@/components/layout/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/hospital_outfit_special_set`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", text);
    throw new Error(`Fetch failed with status ${res.status}`);
  }

  const data = await res.json();
  return data.products;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

export default function HospitalOutfitSpecialSet() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden pt-24 py-32 px-4 md:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <Image
            src="/categoryBanners/hospitalspecial.webp"
            alt="Premium Background"
            fill
            className="object-cover scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Gradient overlay for premium effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <Breadcrumb className="mb-6 text-white/90" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-none border border-white/30 shadow-lg shadow-white/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium tracking-wide">
                Premium Collection
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight drop-shadow-lg">
              Hospital Outfit Special Set
            </h1>

            <p className="text-xl text-white/90 max-w-2xl font-light drop-shadow-sm">
              Discover our curated selection of premium toys
            </p>
          </div>
        </div>

        {/* Elegant Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-10" />
      </div>

      {/* Products Section */}
      <div className="relative -mt-8 px-4 md:px-8 pb-16">
        <div className="max-w-8xl mx-auto">
          {isLoading ? (
            <div className="bg-white mt-10 rounded-none shadow-sky-100 p-6">
              {/* Toolbar Skeleton */}
              <div className="flex flex-col md:flex-row gap-4 mb-8 pb-6 border-b">
                <Skeleton className="h-10 w-full md:w-64" />
                <div className="flex gap-2 ml-auto">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>

              {/* Products Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white mt-10 rounded-none shadow-sky-100 overflow-hidden">
              <ProductToolbar products={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
