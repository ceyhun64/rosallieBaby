"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "./productCard";
import { Input } from "@/components/ui/input";
import { X, Search, Trash } from "lucide-react";
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

export default function DefaultSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className="p-4 md:p-8">
      {/* Üst Bar */}
      <div className="flex items-center justify-between mb-8 md:mb-16 gap-4">
        {/* Desktop: Logo */}
        {!isMobile && (
          <Link className="text-xl text-teal-600 font-extrabold" href="/">
            RosallieBaby
          </Link>
        )}

        <div className="flex items-center gap-2 w-full relative">
          {/* Input + Clear button */}
          <div className="flex-1 relative">
            {/* Search ikonu */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />

            <Input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10" // sol padding ikonu, sağ padding clear butonu
            />

            {/* Input içinde silme butonu */}
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Inputun dışında hep sağda: sayfayı kapatma/back butonu */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Ürün Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
