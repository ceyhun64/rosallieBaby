"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex-none p-2 w-full max-w-sm mx-auto cursor-pointer">
      <div
        className="bg-[#f9f8f4] border-[3px] border-[#e7e4db] rounded-xl overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ürün Resmi */}
        <div className="relative w-full h-120 overflow-hidden rounded-t-lg">
          <Image
            src={
              isHovered && product.subImage1
                ? product.subImage1
                : product.mainImage
            }
            alt={product.description}
            width={400}
            height={1000}
            className="w-full h-full object-cover p-3 transition-all duration-300"
          />

          {/* Sepete Ekle Butonu */}
          {isHovered && (
            <button
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 
               bg-white text-black px-6 py-3 rounded-full border-2 border-black 
               w-48 text-center opacity-90 hover:opacity-100 hover:bg-orange-50 hover:text-gray-600 
               transition-all duration-300 mb-3"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Ürün Bilgileri */}
        <div className="p-4 text-center">
          <p className="text-sm md:text-base text-gray-700 mb-2 font-['Arial']">
            {product.description}
          </p>
          <div className="flex items-center justify-center space-x-2">
            {product.discount > 0 && (
              <div className="bg-[#b3a89e] text-white rounded-full px-2 py-1 text-xs font-bold -mr-1">
                %{product.discount}
              </div>
            )}
            <span className="text-gray-400 line-through text-sm">
              ₺{product.oldPrice.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-black">
              ₺{product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
