"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="group w-full cursor-pointer flex flex-col bg-white transition-all duration-500 hover:shadow-2xl">
      <div
        className="overflow-hidden relative flex-1 bg-gray-50"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <div className="relative w-full aspect-[1] overflow-hidden">
            {/* Ürün Resmi */}
            <Image
              src={
                !isMobile && isHovered && product.subImage1
                  ? product.subImage1
                  : product.mainImage
              }
              alt={product.description}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />

            {/* Premium Gradient Overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500" />
            )}

            {/* İndirim Rozeti - Premium */}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-black text-white px-3 py-1.5 text-xs font-medium tracking-wider">
                  -{product.discount}%
                </div>
              </div>
            )}

            {/* Premium Hover Action Button */}
            {isHovered && (
              <div className="absolute inset-x-0 bottom-0 p-4 transform transition-all duration-500 ease-out">
                <button
                  aria-label="Add to cart"
                  className="w-full bg-white/80 text-black/80 font-medium text-sm py-3 px-4 
                  flex items-center justify-center gap-2
                  hover:bg-white/90 hover:text-black/90 
                  transition-all duration-300 
                  shadow-lg group/btn"
                >
                  <ShoppingBag
                    size={18}
                    className="transition-transform group-hover/btn:scale-110"
                  />
                  <span className="tracking-wide">ADD TO CART</span>
                </button>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Ürün Bilgileri - Premium Stil */}
      <div className="p-5 text-center bg-white transition-all duration-300 group-hover:bg-gray-50">
        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed tracking-wide min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            {product.oldPrice > 0 && product.oldPrice > product.price && (
              <span className="text-gray-400 line-through text-xs tracking-wide">
                €{product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg md:text-xl font-semibold text-black tracking-tight">
              €{product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Premium Divider */}
        <div className="mt-4 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
