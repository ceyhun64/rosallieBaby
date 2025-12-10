"use client";

import React from "react";
import { Trash2, Plus, Minus, Edit2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const product = item?.product || {};
  const basePrice = product?.price || 0;
  const oldPrice = product?.oldPrice || 0;

  const quantity = item?.quantity || 1;

  const finalPrice = basePrice * quantity;
  const finalOldPrice = oldPrice * quantity;

  const imageSrc = product?.mainImage || "/api/placeholder/300/400";

  const hasOptions = item?.customName && item.customName !== "none";

  return (
    <div className="group relative bg-white rounded-xs shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex flex-col sm:flex-row w-full p-4 sm:p-6 gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-40 sm:h-40 flex-shrink-0 rounded-xs overflow-hidden bg-gray-50">
          <img
            src={imageSrc}
            alt={product?.name || "Product Image"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-gray-900 mb-1 tracking-wide">
                  {product?.name || "Unnamed Product"}
                </h3>
                <p className="text-xs text-gray-500 tracking-wider uppercase">
                  Code: #{product?.id || "N/A"}
                </p>
              </div>

              {/* ✅ Doğrudan onRemove çağrısı - parametre Cart'tan geliyor */}
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 hover:bg-red-50 rounded-full"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Custom Options */}
            {hasOptions && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                <h4 className="text-xs font-semibold text-gray-700 mb-2 tracking-wider uppercase">
                  Customizations
                </h4>
                <div className="space-y-1.5 text-sm">
                  {item.customName && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                      <span className="font-medium">Name:</span>
                      <span className="ml-1.5 italic">{item.customName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            {/* Quantity Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 tracking-wider uppercase">
                Quantity
              </span>

              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                {/* ✅ Doğrudan onDecrease çağrısı */}
                <button
                  onClick={onDecrease}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="px-4 py-2 font-medium text-sm border-x border-gray-200 min-w-[3rem] text-center">
                  {quantity}
                </span>

                {/* ✅ Doğrudan onIncrease çağrısı */}
                <button
                  onClick={onIncrease}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-start sm:items-end gap-1 mt-2 sm:mt-0">
              {oldPrice > 0 && finalOldPrice > finalPrice && (
                <span className="text-gray-400 line-through text-sm font-sans">
                  ${finalOldPrice.toFixed(2)}
                </span>
              )}

              <span className="text-2xl font-medium text-gray-900 font-sans">
                ${finalPrice.toFixed(2)}
              </span>

              {product?.id && (
                <Link
                  href={`/all_products/${product.category || "all_products"}/${
                    product.id
                  }`}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors mt-1 group/edit"
                >
                  <Edit2 className="h-3 w-3 group-hover/edit:translate-x-0.5 transition-transform" />
                  <span className="tracking-wide">Edit Options</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
