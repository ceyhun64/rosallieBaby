"use client";
import React from "react";
import ProductCard from "./productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

// Örnek ürün verisi
const products = [
  {
    id: 1,
    name: "Tuğkan",
    mainImage: "/muslinSets/muslin1main.webp",
    subImage1: "/muslinSets/muslin1sub.webp",
    description: "Anchor Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 17,
  },
  {
    id: 2,
    name: "Defne",
    mainImage: "/muslinSets/muslin2main.webp",
    subImage1: "/muslinSets/muslin2sub.webp",
    description: "Flowery Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 24,
  },
  {
    id: 3,
    name: "Sarp",
    mainImage: "/muslinSets/muslin3main.webp",
    subImage1: "/muslinSets/muslin3sub.webp",
    description: "Rabbit Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2299,
    price: 1999,
    discount: 13,
  },
  {
    id: 4,
    name: "Aren",
    mainImage: "/muslinSets/muslin4main.webp",
    subImage1: "/muslinSets/muslin4sub.webp",
    description:
      "Personalized Embroidered Muslin 7-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1799,
    discount: 25,
  },
];

export default function MostVisited() {
  const isMobile = useIsMobile();

  return (
    <section
      className={`container mx-auto  ${isMobile ? "px-0 py-8" : "px-5 py-12"}`}
    >
      <h2 className="text-center text-2xl mb-8">Most Visited</h2>

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
                  ? "basis-1/2" // Mobilde 2 ürün
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
