"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartSummary({ subtotal }) {
  return (
    <div className="sticky top-4">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xs shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
          <h2 className="font-serif text-xl font-medium text-white tracking-wide">
            Order Summary
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Pricing Details */}
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm tracking-wide">Subtotal</span>
              <span className="font-medium text-lg">
                €{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="font-serif text-lg font-medium">Total</span>
              <span className="font-sans text-2xl font-semibold text-gray-900">
                €{subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-100">
            Shipping costs will be calculated at checkout
          </p>

          {/* Checkout Button */}
          <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium py-4 px-6 rounded-xs transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group mt-6">
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="tracking-wider uppercase text-sm">
              Complete Purchase
            </span>
          </button>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs">Secure 256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              <span className="text-xs">Free shipping over €150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
