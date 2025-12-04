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
      console.error("Sepet yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // Add to Cart
  // -----------------------------
  const addToCart = async (item) => {
    const {
      productId,
      quantity = 1,
      customName = null,
    } = item;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, customName }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Ürün sepete eklendi!");
        await fetchCartFromAPI();
      } else {
        toast.error("Sepete eklenemedi");
      }
    } catch {
      toast.error("Bağlantı hatası");
    }
  };

  // -----------------------------
  // Remove item
  // -----------------------------
  const removeFromCart = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
        toast.success("Ürün silindi");
      } else {
        toast.error("Ürün silinemedi");
      }
    } catch {
      toast.error("Ürün silinemedi");
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
      toast.error("Miktar güncellenemedi");
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
        toast.success("Sepet temizlendi");
      }
    } catch {
      toast.error("Sepet temizlenemedi");
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