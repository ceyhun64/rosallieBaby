import React from "react";
import SearchAndFilter from "./searchAndFilter";
import ProductToolbar from "./productToolBar";
import { Label } from "@/components/ui/label"; // Başlık için Label ekledim

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
    category: "hospital-outfit-set",
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
    category: "hospital-outfit-set",
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
    category: "hospital-outfit-set",
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
    category: "hospital-outfit-set",
  },
  {
    id: 5,
    name: "Tuğkan",
    mainImage: "/allProducts/product5main.webp",
    subImage1: "/allProducts/product5sub.webp",
    description: "Anchor Muslin 6-Piece Baby Romper Set",
    oldPrice: 2399,
    price: 1899,
    discount: 17,
    category: "romper",
  },
  {
    id: 6,
    name: "Defne",
    mainImage: "/allProducts/product6main.webp",
    subImage1: "/allProducts/product6sub.webp",
    description: "Flowery Muslin Blanket",
    oldPrice: 2399,
    price: 1899,
    discount: 24,
    category: "blanket",
  },
  {
    id: 7,
    name: "Sarp",
    mainImage: "/allProducts/product7main.webp",
    subImage1: "/allProducts/product7sub.webp",
    description: "Rabbit Muslin Pillow",
    oldPrice: 2299,
    price: 1999,
    discount: 13,
    category: "pillow",
  },
  {
    id: 8,
    name: "Aren",
    mainImage: "/allProducts/product8main.webp",
    subImage1: "/allProducts/product8sub.webp",
    description: "Personalized Embroidered Muslin 7-Piece Hospital Outfit",
    oldPrice: 2399,
    price: 1799,
    discount: 25,
    category: "hospital-outfit-set",
  },
];

export default function AllProducts() {
  return (
    <div className="flex p-4 md:p-8">
      {/* Left menu */}
      <div className="w-64 mr-8 hidden md:block sticky top-0 h-fit self-start">
        <SearchAndFilter />
      </div>

      {/* Right side */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Label className="text-3xl font-semibold">All Products</Label>
          <span className="text-gray-600 text-lg">
            ({products.length} products)
          </span>
        </div>

        <ProductToolbar products={products} />
      </div>
    </div>
  );
}
