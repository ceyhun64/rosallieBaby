"use client";

import React, { useState } from "react";
import CartItemComponent from "./cartItem";
import CartSummary from "./cartSummary";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sun Muslin Hospital Discharge 6-Piece Set",
      price: 2047.99,
      oldPrice: 2347.99,
      quantity: 1,
      image: "/allProducts/product1main.webp",
      productCode: "BB0143",
      options: [
        { label: "Enter Name", value: "why" },
        {
          label: "Hat & Blanket Option",
          value: "Ruffled",
          extraPrice: 149.0,
        },
      ],
    },
    {
      id: 2,
      name: "Rabbit Muslin Pillowcase",
      price: 499.0,
      quantity: 1,
      image: "/allProducts/product2main.webp",
      productCode: "BB0143",
      options: [{ label: "Enter Name", value: "why" }],
    },
  ]);

  const handleIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const finalPrice =
      item.price +
      item.options.reduce(
        (optionAcc, option) => optionAcc + (option.extraPrice || 0),
        0
      );
    return acc + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-2 py-8 md:py-12">
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
