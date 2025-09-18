"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Truck } from "lucide-react";
import Link from "next/link";

export default function CartSummary({ subtotal }) {
  return (
    <div className="w-full md:w-110 flex-shrink-0 p-6 bg-gray-50 h-auto">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">₺{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span>₺{subtotal.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Shipping will be calculated at the next step.
        </p>
      </div>
      <Button className="w-full mt-6 bg-[#809363] hover:bg-green-900 text-white font-semibold rounded-none flex items-center justify-center h-12">
        <Link
          href="/payment"
          className="flex items-center justify-center gap-2 w-full"
        >
          <span>COMPLETE PURCHASE</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      <div className="mt-6 space-y-3 text-sm text-gray-500 items-center justify-center">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Secure checkout with 256-bit SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free shipping on orders over 150₺</span>
        </div>
      </div>
    </div>
  );
}
