"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/products/productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "../ui/skeleton"; // Skeleton bileşeni içe aktarıldı

// Yeni Loading bileşeni (mevcut Loading'in yerini alacak)
const Loading = ({ isMobile }) => {
  // Ekran boyutuna göre kaç tane iskelet kartı gösterileceğini belirler
  const cardCount = isMobile ? 2 : 4;

  return (
    <div className={`container mx-auto py-12 ${isMobile ? "px-1" : "px-5"} `}>
      <div className="text-center font-light mb-10 text-[18px] md:text-[32px] tracking-[0.18em] text-gray-900 uppercase">
        <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
          Named Muslin Sets
        </span>
        <div className="mx-auto mt-4 w-16 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full opacity-80" />
      </div>
      <div
        className={`flex ${isMobile ? "space-x-2" : "gap-4"} justify-center`}
      >
        {/* Belirtilen sayıda iskelet kartı oluştur */}
        {[...Array(cardCount)].map((_, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${
              isMobile ? "basis-1/2 max-w-[50%]" : "basis-1/4 max-w-[25%]"
            } pl-1`}
          >
            {/* İskelet kutusu: resim ve metin alanlarını taklit eder */}
            <Skeleton className="w-full aspect-[4/4] rounded-lg mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};
// ---

export default function MuslinSets() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/products/category/hospital_outfit_special_set"
        );
        if (!response.ok) throw new Error("Ürünler alınamadı");
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
  }, []);

  // Loading bileşenini isMobile prop'u ile çağır
  if (loading) return <Loading isMobile={isMobile} />;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;
  if (products.length === 0)
    return <p className="text-center py-12">Bu kategoride ürün yok.</p>;

  return (
    <section
      className={`container mx-auto py-12 ${isMobile ? "px-1" : "px-5"} `}
    >
      <h2
        className="text-center font-light mb-2 
text-[18px] md:text-[32px] tracking-[0.18em] 
text-gray-900 uppercase"
      >
        <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
          Named Muslin Sets
        </span>
      </h2>
      <p className="text-center text-gray-500 text-xs md:text-sm font-light mb-3 max-w-xl mx-auto">
        Add name for personalization
      </p>
      <div className="mx-auto w-16 h-[2px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full opacity-80 mb-7"/>

      <Carousel
        opts={{ align: "start" }}
        className={`w-full ${isMobile ? "px-0 gap-2" : "px-4"}`}
      >
        <CarouselContent className={`-ml-1 ${isMobile ? "space-x-2" : ""}`}>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={`pl-1 ${
                isMobile
                  ? "basis-1/2"
                  : "md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              }`}
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className={`absolute top-1/3 left-2 transform -translate-y-1/2 z-20 
            bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors`}
        >
          &#8249;
        </CarouselPrevious>

        <CarouselNext
          className={`absolute top-1/3 right-2 transform -translate-y-1/2 z-20 
            bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors`}
        >
          &#8250;
        </CarouselNext>
      </Carousel>
    </section>
  );
}
