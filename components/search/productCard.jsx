"use client";
import Image from "next/image";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      className="w-full cursor-pointer flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ürün Resmi */}
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full h-60 md:h-72 lg:h-80 overflow-hidden">
          <Image
            src={
              isHovered && product.subImage1
                ? product.subImage1
                : product.mainImage
            }
            alt={product.description}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Sepete Ekle Butonu: Hover veya Mobile */}
          {(isHovered || isMobile) && (
            <button
              className="absolute bottom-4 left-4 right-4 bg-teal-600 text-white font-semibold text-sm md:text-base py-2 border border-white 
              transition-colors duration-300 hover:bg-orange-300"
            >
              ADD TO CART
            </button>
          )}
        </div>

        {/* İndirim Rozeti */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 text-xs font-bold rounded">
            %{product.discount}
          </div>
        )}
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-2 md:p-4 text-center">
        <p className="text-sm md:text-base text-gray-700 mb-1 font-['Arial']">
          {product.description}
        </p>
        <div className="flex items-center justify-center space-x-2">
          {product.oldPrice > 0 && (
            <span className="text-gray-400 line-through text-sm">
              ₺{product.oldPrice.toFixed(2)}
            </span>
          )}
          <span className="text-lg md:text-xl font-bold text-teal-600">
            ₺{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
