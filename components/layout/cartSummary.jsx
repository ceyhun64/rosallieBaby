"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartSummarySheet({ subtotal }) {
  return (
    <div className="sticky bottom-0 shadow-top p-4 flex flex-col gap-2 bg-white">
      {/* Ödeme adımına git butonu */}
      <Button
        asChild
        className="w-full rounded-none bg-gray-100 hover:bg-gray-200 text-black font-semibold py-3 h-auto flex items-center justify-center"
      >
        <Link
          href="/checkout"
          className="flex items-center gap-2 w-full justify-center"
        >
          <span>GO TO PAYMENT STEP</span>
          <ShoppingBag className="h-5 w-5" />
        </Link>
      </Button>

      {/* Sepete git butonu ve toplam */}
      <Button
        asChild
        variant="outline"
        className="w-full rounded-none bg-[#829969] hover:bg-[#6f855a] text-white font-semibold py-3 h-auto"
      >
        <Link
          href="/cart"
          className="flex w-full justify-between items-center px-3"
        >
          {/* Left side */}
          <div className="flex flex-col items-start">
            <span className="text-xs">Total</span>
            <span className="text-lg font-bold">€{subtotal.toFixed(2)}</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <span className="uppercase text-sm ms-25">Go to Cart</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </Button>
    </div>
  );
}
