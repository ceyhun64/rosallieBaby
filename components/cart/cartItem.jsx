"use client";

import React from "react";
import { Trash2, Plus, Minus, Edit } from "lucide-react";
import Image from "next/image";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const basePrice = item.price;
  const oldPrice = item.oldPrice || 0;
  const quantity = item.quantity;
  const hasOptions = item.options && item.options.length > 0;

  const finalPrice =
    basePrice + (hasOptions ? item.options[0].extraPrice || 0 : 0);
  const finalOldPrice =
    oldPrice + (hasOptions ? item.options[0].extraPrice || 0 : 0);

  return (
    <div className="flex flex-row w-full justify-start items-start gap-4 p-2 border-b border-gray-200">
      {/* Product Image */}
      <div className="relative w-1/3 sm:w-32 h-40 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>

      {/* Product Info and Controls */}
      <div className="flex flex-col flex-1 w-2/3">
        {/* Product Name and Remove Button */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
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
              €{item.price.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-500 mt-0.5">
            Product Code:{" "}
            <span className="font-normal">{item.productCode}</span>
          </p>
        </div>

        {/* Product Options */}
        {hasOptions && (
          <div className="mt-1 text-gray-700 text-xs sm:text-sm">
            <h4 className="font-semibold mb-0.5">Product Options</h4>
            {item.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center text-gray-500 mt-0.5"
              >
                <span>
                  {option.label} - {option.value}
                </span>
                {option.extraPrice && (
                  <span className="text-gray-500">
                    (+€{option.extraPrice.toFixed(2)})
                  </span>
                )}
              </div>
            ))}
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
                {item.quantity}
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
            <button className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-800 transition-colors mt-1">
              <span className="mr-1">Edit</span>
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
