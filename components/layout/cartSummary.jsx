"use client";

import React from "react";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

// Cart Summary Skeleton Component
function CartSummarySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-14 w-full rounded-sm" />
      <Skeleton className="h-12 w-full rounded-sm" />
      <div className="pt-3 flex items-center justify-center gap-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function CartSummarySheet({ subtotal, loading }) {
  if (loading) {
    return <CartSummarySkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Subtotal - Minimal & Elegant */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <span className="text-xs uppercase tracking-widest text-gray-500 font-light">
          Subtotal
        </span>
        <span className="text-2xl font-light text-gray-900 tracking-tight">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button - Primary Action */}
      <Link
        href="/checkout"
        className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-3 group"
      >
        <Lock className="h-3.5 w-3.5 opacity-70" strokeWidth={1.5} />
        <span className="text-sm font-medium tracking-wide">
          Secure Checkout
        </span>
        <ArrowRight
          className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
          strokeWidth={1.5}
        />
      </Link>

      {/* View Cart Button - Secondary Action */}
      <Link
        href="/cart"
        className="w-full border border-gray-300 hover:border-gray-900 bg-white hover:bg-gray-50 text-gray-900 py-3.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest font-light">
          View Full Cart
        </span>
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>

      {/* Security Badge - Trust Element */}
      <div className="pt-3 flex items-center justify-center gap-2 text-gray-400">
        <Lock className="h-3 w-3" strokeWidth={1.5} />
        <span className="text-[10px] tracking-wider uppercase font-light">
          Secure Payment
        </span>
      </div>
    </div>
  );
}
