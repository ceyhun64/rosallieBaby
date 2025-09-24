"use client";

import React from "react";
import { Trash2, Plus, Minus, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  console.log("item:", item);
  const product = item?.product || {};
  const basePrice = product?.price || 0;
  const oldPrice = product?.oldPrice || 0;
  const category = product?.category || {};
  const quantity = item?.quantity || 1;

  // Extra fiyatları direkt state'ten alıyoruz
  const strollerCoverPrice = item?.strollerCover ? 149 : 0;
  const hatToyPrice =
    item?.hatToyOption && item.hatToyOption !== "none" ? 149 : 0;

  const finalPrice = (basePrice + strollerCoverPrice + hatToyPrice) * quantity;
  const finalOldPrice =
    (oldPrice + strollerCoverPrice + hatToyPrice) * quantity;

  const imageSrc = product?.mainImage || "/placeholder.png";

  // Options gösterilecek mi kontrolü
  const hasOptions =
    (item?.customName && item.customName !== "none") ||
    item?.strollerCover ||
    (item?.hatToyOption && item.hatToyOption !== "none");

  return (
    <div className="flex flex-row w-full justify-start items-start gap-4 p-2 border-b border-gray-200">
      {/* Product Image */}
      <div className="relative w-1/3 sm:w-32 h-40 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={product?.name || "Product Image"}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>

      {/* Product Info and Controls */}
      <div className="flex flex-col flex-1 w-2/3">
        {/* Product Name and Remove Button */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm sm:text-base">
            {product?.name || "Unnamed Product"}
          </h3>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Price and Product Code */}
        <div className="text-gray-700 mb-1 text-xs sm:text-sm">
          <p className="font-semibold">
            Price:{" "}
            <span className="font-bold text-sm sm:text-base">
              €{finalPrice.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-500 mt-0.5">
            Product Code:{" "}
            <span className="font-normal">{product?.id || "N/A"}</span>
          </p>
        </div>

        {/* Product Options */}
        {hasOptions && (
          <div className="mt-1 text-gray-700 text-xs sm:text-sm">
            <h4 className="font-semibold mb-0.5">Product Options</h4>
            {item?.customName && item.customName !== "none" && (
              <div className="flex items-center text-gray-500 mt-0.5">
                <span>Custom Name: {item.customName}</span>
              </div>
            )}
            {item?.strollerCover && (
              <div className="flex items-center text-gray-500 mt-0.5">
                <span>Stroller Cover (+€149)</span>
              </div>
            )}
            {item?.hatToyOption && item.hatToyOption !== "none" && (
              <div className="flex items-center text-gray-500 mt-0.5">
                <span>Hat & Toy Option: {item.hatToyOption} (+€149)</span>
              </div>
            )}
          </div>
        )}

        {/* Quantity and Price Section */}
        <div className="flex justify-between items-center mt-2 w-full gap-3 text-xs sm:text-sm">
          {/* Quantity Control */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Qty</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => onDecrease(item.id)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <span className="w-6 text-center font-medium text-xs">
                {quantity}
              </span>
              <button
                onClick={() => onIncrease(item.id)}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Price Display and Edit Button */}
          <div className="flex flex-col items-end">
            {oldPrice > 0 && (
              <span className="text-gray-400 line-through text-[10px] sm:text-sm">
                €{finalOldPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-sm sm:text-base text-gray-800">
              €{finalPrice.toFixed(2)}
            </span>
            <Link href={`/all_products/${category}/${product.id}`}>
              <button className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition-colors mt-1">
                <span className="mr-1">Edit</span>
                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
