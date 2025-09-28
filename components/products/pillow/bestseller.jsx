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

export default function Bestseller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          // Rastgele 10 ürün seç
          const shuffled = data.products.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          setProducts(selected);
        }
      } catch (error) {
        console.error("Ürünler çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-start text-4xl text-teal-600 font-['Arial'] mb-8">
        Bestsellers
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
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
