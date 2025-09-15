"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full cursor-pointer flex flex-col">
      <div
        className="overflow-hidden relative flex-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ürün Resmi */}
        <Link href={`/all-products/blanket/${product.id}`}>
          <div className="relative w-full aspect-[2.5/4] overflow-hidden">
            <Image
              src={
                isHovered && product.subImage1
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
                className="absolute bottom-4 left-4 right-4 bg-teal-600 text-white font-semibold text-base text-center py-2 px-3 border border-white 
                transition-colors duration-500 ease-in-out hover:bg-orange-300"
              >
                ADD TO CART
              </button>
            )}
          </div>
        </Link>
      </div>

      {/* Ürün Bilgileri */}
      <div className="p-4 text-center">
        <p className="text-sm md:text-base text-gray-700 mb-2 font-['Arial']">
          {product.description}
        </p>
        <div className="flex items-center justify-center space-x-2">
          {product.discount > 0 && (
            <div className="bg-teal-600 text-white px-2.5 py-2.5 text-xs font-extrabold -mr-1">
              %{product.discount}
            </div>
          )}
          <span className="text-gray-400 line-through text-sm">
            ₺{product.oldPrice.toFixed(2)}
          </span>
          <span className="text-xl font-bold text-teal-600">
            ₺{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
