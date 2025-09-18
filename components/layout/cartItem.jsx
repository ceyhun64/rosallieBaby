"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Edit,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Separator } from "../ui/separator";

export const CartItem = ({ item }) => {
  const finalPrice =
    item.price +
    item.options.reduce((acc, option) => acc + (option.extraPrice || 0), 0);
  const finalOldPrice =
    item.oldPrice +
    item.options.reduce((acc, option) => acc + (option.extraPrice || 0), 0);

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(true);

  return (
    <div className="flex flex-col sm:flex-row gap-3 py-3 border-b border-gray-200">
      {/* Left: Product Image */}
      <div className="flex-shrink-0 relative w-28 h-40">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Title and Remove */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-sm sm:text-base text-gray-800 leading-snug">
            {item.name}
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Price */}
        <p className="text-xs sm:text-sm text-gray-500">
          Price:{" "}
          <span className="font-bold text-gray-800">
            ₺{item.price.toFixed(2)}
          </span>
        </p>

        <Separator className={"my-1"} />
        {/* Product Options */}
        <div className="flex gap-3 items-start mt-1">
          <div className="flex-1 text-xs sm:text-sm text-gray-700">
            <button
              className="flex justify-between items-center w-full py-0.5"
              onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
            >
              <span className="font-semibold text-gray-800">
                Product Options
              </span>
              {isOptionsExpanded ? (
                <ChevronUp className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              )}
            </button>
            {isOptionsExpanded && (
              <div className="space-y-0.5">
                {item.options.map((option, index) => (
                  <p key={index} className="text-gray-500">
                    {option.label} - {option.value}{" "}
                    {option.extraPrice > 0 && (
                      <span className="ml-1 text-gray-400">
                        (+₺{option.extraPrice.toFixed(2)})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator className={"my-1"} />
        {/* Quantity and Total Price */}
        <div className="flex justify-between items-center mt-2">
          {/* Quantity */}
          <div className="flex items-center space-x-1">
            <span className="text-gray-700 text-xs sm:text-sm">Qty</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button className="px-1 text-gray-500 hover:text-gray-700 transition-colors">
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button className="px-1 text-gray-500 hover:text-gray-700 transition-colors">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex flex-col items-end">
            {item.oldPrice > 0 && (
              <span className="text-gray-400 text-xs line-through">
                ₺{finalOldPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-gray-800">
              ₺{finalPrice.toFixed(2)}
            </span>
            <button className="flex items-center text-xs text-gray-500 hover:text-gray-800 transition-colors">
              <span className="mr-0.5">Edit</span>
              <Edit className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
