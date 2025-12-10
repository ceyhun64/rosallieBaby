"use client";

import React, { useState } from "react";
import { Trash2, Plus, Minus, Edit2, Tag } from "lucide-react";

export default function CartItem({
  item,
  product,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const [loading, setLoading] = useState(false);

  const productData = product || item?.product || {};
  const basePrice = productData?.price || 0;
  const oldPrice = productData?.oldPrice || 0;
  const quantity = item?.quantity || 1;

  const finalPrice = (basePrice * quantity).toFixed(2);
  const finalOldPrice = (oldPrice * quantity).toFixed(2);
  const imageSrc = productData?.mainImage || "/placeholder.png";

  const hasOptions = item?.customName && item.customName !== "none";

  const handleIncrease = async () => {
    setLoading(true);
    // Cart.js'ten gelen onIncrease(id, newQuantity) çağrısını yap
    await onIncrease();
    setLoading(false);
  };

  const handleDecrease = async () => {
    if (quantity <= 1) return;
    setLoading(true);
    // Cart.js'ten gelen onDecrease(id, newQuantity) çağrısını yap
    await onDecrease();
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    // Cart.js'ten gelen onRemove(id) çağrısını yap
    await onRemove();
    setLoading(false);
  };

  return (
    <div className="flex gap-4 p-4 group hover:bg-gray-50/50 transition-colors duration-300">
      <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={productData?.name || "Product"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-light text-gray-900 tracking-wide line-clamp-2">
                {productData?.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
                <span>#{productData?.id}</span>
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1"
              disabled={loading}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" /> {/* İkon kullanmak daha modern */}
            </button>
          </div>

          {hasOptions && (
            <div className="mt-3 space-y-1 text-[11px] text-gray-500 font-light">
              {item.customName && item.customName !== "none" && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-gray-600">{item.customName}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center border border-gray-200 rounded-sm bg-white">
            <button
              onClick={handleDecrease}
              disabled={quantity <= 1 || loading}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>

            <span className="px-4 text-sm font-light text-gray-900 border-x border-gray-200 min-w-[40px] text-center">
              {quantity}
            </span>

            <button
              onClick={handleIncrease}
              disabled={loading}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="text-right">
            {oldPrice > 0 && finalOldPrice > finalPrice && (
              <div className="text-[10px] line-through text-gray-400 mb-0.5">
                ${finalOldPrice}
              </div>
            )}

            <div className="text-lg font-light text-gray-900 tracking-tight">
              ${finalPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
