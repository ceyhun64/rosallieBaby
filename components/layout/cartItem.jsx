"use client";

import React, { useState } from "react";
import { Trash2, Plus, Minus, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const [loading, setLoading] = useState(false);

  const product = item?.product || {};
  const basePrice = product?.price || 0;
  const oldPrice = product?.oldPrice || 0;
  const category = product?.category || "all_products";
  const quantity = item?.quantity || 1;

  const strollerCoverPrice = item?.strollerCover ? 149 : 0;
  const hatToyPrice =
    item?.hatToyOption && item.hatToyOption !== "none" ? 149 : 0;

  const finalPrice = (basePrice + strollerCoverPrice + hatToyPrice) * quantity;
  const finalOldPrice =
    (oldPrice + strollerCoverPrice + hatToyPrice) * quantity;

  const imageSrc = product?.mainImage || "/placeholder.png";

  const hasOptions =
    (item?.customName && item.customName !== "none") ||
    item?.strollerCover ||
    (item?.hatToyOption && item.hatToyOption !== "none");

  const handleIncrease = async () => {
    setLoading(true);
    await onIncrease(item.id);
    setLoading(false);
  };

  const handleDecrease = async () => {
    if (quantity <= 1) return;
    setLoading(true);
    await onDecrease(item.id);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await onRemove(item.id);
    setLoading(false);
  };

  return (
    <div className="flex flex-row w-full justify-start items-start gap-3 p-2 border-b border-gray-200">
      {/* Product Image */}
      <div className="relative w-1/3 sm:w-28 h-36 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={product?.name || "Product Image"}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 w-2/3">
        {/* Name & Remove */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-xs sm:text-sm">
            {product?.name || "Unnamed Product"}
          </h3>
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Price & Code */}
        <div className="text-gray-700 mb-1 text-[11px] sm:text-xs">
          <p className="font-semibold">
            Price:{" "}
            <span className="font-bold text-xs sm:text-sm">
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
          <div className="mt-1 text-gray-700 text-[11px] sm:text-xs">
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

        {/* Quantity & Price */}
        <div className="flex justify-between items-center mt-2 w-full gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-gray-700">Qty</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1 || loading}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center font-medium text-[11px]">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                disabled={loading}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end">
            {oldPrice > 0 && (
              <span className="text-gray-400 line-through text-[9px] sm:text-xs">
                €{finalOldPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-xs sm:text-sm text-gray-800">
              €{finalPrice.toFixed(2)}
            </span>
            <Link href={`/all_products/${category}/${product.id}`}>
              <button className="flex items-center text-[10px] sm:text-xs text-gray-500 hover:text-gray-800 transition-colors mt-1">
                <span className="mr-1">Edit</span>
                <Edit className="h-3 w-3" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
