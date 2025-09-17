"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="w-full cursor-pointer flex flex-col">
      <div
        className="overflow-hidden relative flex-1"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Ürün Resmi */}
        <Link href={`/all-products/toy/${product.id}`}>
          <div className="relative w-full aspect-[2.5/4] overflow-hidden">
            <Image
              src={
                !isMobile && isHovered && product.subImage1
                  ? product.subImage1
                  : product.mainImage
              }
              alt={product.description}
              fill
              className="object-cover transition-all duration-300"
            />

            {/* Sepete Ekle Butonu */}
            {isHovered && (
              <button
                className="absolute bottom-4 left-4 right-4 bg-teal-600 text-white font-semibold 
                text-sm md:text-base text-center py-2 px-3 border border-white 
                transition-colors duration-500 ease-in-out hover:bg-orange-300"
              >
                ADD TO CART
              </button>
            )}
          </div>
        </Link>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-3 md:p-4 text-center">
        <p className="text-xs md:text-sm lg:text-base text-gray-700 mb-2 font-['Arial'] line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-center gap-3">
          {/* İndirim Yüzdesi */}
          {product.discount > 0 && (
            <div className="bg-teal-600 text-white px-2 py-3 text-[10px] md:text-sm font-extrabold rounded-none">
              %{product.discount}
            </div>
          )}

          {/* Fiyatlar */}
          <div className="flex flex-col items-start">
            <span className="text-gray-400 line-through text-xs md:text-sm">
              ₺{product.oldPrice.toFixed(2)}
            </span>
            <span className="text-base md:text-lg lg:text-xl font-bold text-teal-600">
              ₺{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
