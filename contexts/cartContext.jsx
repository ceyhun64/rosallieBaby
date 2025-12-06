"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "sonner";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // API Fetches
  // -----------------------------
  const fetchCartFromAPI = async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    setCartItems(data);
  };

  // -----------------------------
  // Cart Load Logic
  // -----------------------------
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      await fetchCartFromAPI();
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // Add to Cart
  // -----------------------------
  const addToCart = async (item) => {
    const { productId, quantity = 1, customName = null } = item;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, customName }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Item added to cart!");
        await fetchCartFromAPI();
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch {
      toast.error("Connection error");
    }
  };

  // -----------------------------
  // Remove Item
  // -----------------------------
  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Item removed");
      } else {
        toast.error("Failed to remove item");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // -----------------------------
  // Update Quantity
  // -----------------------------
  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
        credentials: "include",
      });

      if (res.ok) {
        await fetchCartFromAPI();
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  // -----------------------------
  // Clear Cart
  // -----------------------------
  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems([]);
        toast.success("Cart cleared");
      }
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  // -----------------------------
  // Effects
  // -----------------------------
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
