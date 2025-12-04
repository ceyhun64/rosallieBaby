"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/contexts/cartContext";
import { FavoriteProvider } from "@/contexts/favoriteContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FavoriteProvider>{children}</FavoriteProvider>
      </CartProvider>
    </SessionProvider>
  );
}