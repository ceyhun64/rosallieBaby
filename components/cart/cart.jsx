"use client";

import React, { useState, useEffect } from "react";
import CartItemComponent from "./cartItem";
import CartSummary from "./cartSummary";
import Loading from "../layout/loading";
import Link from "next/link";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den sepeti çek
  useEffect(() => {
    async function fetchCart() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Sepet verileri alınamadı.");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Quantity artır
  const handleIncrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity + 1 }),
      });
      if (!res.ok) throw new Error("Quantity güncellenemedi");
      const updated = await res.json();
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: updated.quantity } : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Quantity azalt
  const handleDecrease = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: item.quantity - 1 }),
      });
      if (!res.ok) throw new Error("Quantity güncellenemedi");
      const updated = await res.json();
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: updated.quantity } : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Ürünü sil
  const handleRemove = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Ürün silinemedi");
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const product = item.product || {};
    const basePrice = product?.price || 0;
    const strollerCoverPrice = item?.strollerCover ? 149 : 0;
    const hatToyPrice =
      item?.hatToyOption && item.hatToyOption !== "none" ? 149 : 0;

    const finalPrice =
      (basePrice + strollerCoverPrice + hatToyPrice) * item.quantity;
    return acc + finalPrice;
  }, 0);

  if (isLoading)
    return (
     <Loading />
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-2 sm:px-10 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 px-4">
        My Cart ({cartItems.length})
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sepet İçeriği */}
        <div className="flex-1 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
          ) : (
            cartItems.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Sipariş Özeti */}
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
