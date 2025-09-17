"use client"
import React from "react";
import ProductToolbar from "./productToolBar";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/layout/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";

// Örnek ürün verileri
const products = [
  {
    id: 1,
    name: "Tuğkan",
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
    name: "Tuğkan",
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

export default function HospitalOutfitSet() {
  const isMobile = useIsMobile();
  return (
    <div className="p-4 md:p-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      {/* Başlık + ürün sayısı */}
      <div className="flex items-center gap-2 mb-4">
        <Label className={`text-3xl font-semibold ${isMobile ? "text-xl" : "text-3xl"}`}>Hospital Outfit Set</Label>
        <span className="text-gray-600 text-lg">
          ({products.length} products)
        </span>
      </div>

      <ProductToolbar products={products} />
    </div>
  );
}
