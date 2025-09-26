"use client";
import React, { useEffect,useState } from "react";
import ProductCard from "./productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MostVisited() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "/api/products/category/hospital_outfit_set"
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
  }, []); // Dependency array ekledik, sadece component mount olunca çalışır
  console.log("products", products);

  if (loading) return <p className="text-center py-12">Yükleniyor...</p>;
  if (error) return <p className="text-center py-12 text-red-500">{error}</p>;
  if (products.length === 0)
    return <p className="text-center py-12">Bu kategoride ürün yok.</p>;
  
  return (
    <section
      className={`container mx-auto  ${isMobile ? "px-1 py-8" : "px-5 py-12"}`}
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
