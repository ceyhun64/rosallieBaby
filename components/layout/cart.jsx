"use client";

import React, { useState, useEffect } from "react";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import Loading from "../layout/loading";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import CompletePurchase from "./completePurchase";

export default function Cart({ onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletePurchase, setShowCompletePurchase] = useState(false); // 🔹 yeni

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart data.");
      const data = await res.json();
      setCartItems(data);
      if (onCartUpdate) onCartUpdate(data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleIncrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      const updated = await res.json();
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: updated.quantity } : i
        )
      );
      if (onCartUpdate) onCartUpdate(cartItems.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      const updated = await res.json();
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: updated.quantity } : i
        )
      );
      if (onCartUpdate) onCartUpdate(cartItems.length);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`/api/cart/${id}`, { method: "DELETE" });
      const updatedItems = cartItems.filter((i) => i.id !== id);
      setCartItems(updatedItems);
      if (onCartUpdate) onCartUpdate(updatedItems.length);
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product || {};
    const basePrice = product.price || 0;
    const strollerCoverPrice = item.strollerCover ? 149 : 0;
    const hatToyPrice =
      item.hatToyOption && item.hatToyOption !== "none" ? 149 : 0;
    return acc + (basePrice + strollerCoverPrice + hatToyPrice) * item.quantity;
  }, 0);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <ShoppingBag className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-center mb-4">Your cart is currently empty.</p>

            <Button
              asChild
              className="bg-[#829969] hover:bg-[#6f855a] text-white px-6 py-2 rounded-none"
            >
              <Link href="/all_products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          ))
        )}
      </div>

      {cartItems.length > 0 && !showCompletePurchase && (
        <div className="flex justify-end p-4">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-none"
            onClick={() => setShowCompletePurchase(true)}
          >
            Show Suggested Products
          </Button>
        </div>
      )}

      {/* Switch ile önerilen ürünler */}
      {showCompletePurchase && (
        <CompletePurchase
          onClose={() => setShowCompletePurchase(false)}
          onCartUpdate={(newCartItems) => setCartItems(newCartItems)}
        />
      )}

      {/* Summary */}
      <div className="sticky bottom-0 bg-white shadow-top">
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
