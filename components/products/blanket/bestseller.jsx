// components/ProductCarousel.jsx
import React from "react";
import ProductCard from "../hospitalOutfitSet/productCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    id: 1,
    name: "Tugkan",
    mainImage: "/allProducts/product1main.webp",
    subImage1: "/allProducts/product1sub.webp",
    description: "Anchor Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 17,
  },
  {
    id: 2,
    name: "Defne",
    mainImage: "/allProducts/product2main.webp",
    subImage1: "/allProducts/product2sub.webp",
    description: "Flowery Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 24,
  },
  {
    id: 3,
    name: "Sarp",
    mainImage: "/allProducts/product3main.webp",
    subImage1: "/allProducts/product3sub.webp",
    description: "Rabbit Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2299,
    price: 1999,
    discount: 13,
  },
  {
    id: 4,
    name: "Aren",
    mainImage: "/allProducts/product4main.webp",
    subImage1: "/allProducts/product4sub.webp",
    description:
      "Personalized Embroidered Muslin 7-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1799,
    discount: 25,
  },
  {
    id: 5,
    name: "Tugkan",
    mainImage: "/allProducts/product5main.webp",
    subImage1: "/allProducts/product5sub.webp",
    description: "Anchor Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 17,
  },
  {
    id: 6,
    name: "Defne",
    mainImage: "/allProducts/product6main.webp",
    subImage1: "/allProducts/product6sub.webp",
    description: "Flowery Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 24,
  },
  {
    id: 7,
    name: "Sarp",
    mainImage: "/allProducts/product7main.webp",
    subImage1: "/allProducts/product7sub.webp",
    description: "Rabbit Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2299,
    price: 1999,
    discount: 13,
  },
  {
    id: 8,
    name: "Aren",
    mainImage: "/allProducts/product8main.webp",
    subImage1: "/allProducts/product8sub.webp",
    description:
      "Personalized Embroidered Muslin 7-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1799,
    discount: 25,
  },
];

export default function Bestseller() {
  return (
    <section className="container mx-auto py-12 px-5">
      <h2 className="text-start text-4xl text-teal-600 font-['Arial'] mb-8">
        Bestsellers
      </h2>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full px-4"
      >
        <CarouselContent className="-ml-1">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={"ms-4"} />
        <CarouselNext className={"me-4"} />
      </Carousel>
    </section>
  );
}
