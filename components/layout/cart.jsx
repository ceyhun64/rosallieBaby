"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import CompletePurchase from "./completePurchase";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../ui/sheet";
import { Skeleton } from "../ui/skeleton";
import {
  getCart,
  updateGuestCartQuantity as updateGuestCartQuantityUtil,
  removeFromGuestCart,
} from "@/utils/cart";
import { toast } from "sonner";

// Cart Skeleton Component (Placeholder for loading state)
function CartSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white">
      <SheetHeader className="py-4 px-5 border-b">
        <SheetTitle>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">My Cart</span>
            <SheetClose asChild>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </SheetClose>
          </div>
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {/* Mock items for skeleton loader */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b pb-3">
              <div className="flex gap-4 p-4">
                <Skeleton className="w-24 h-28 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between items-end mt-4">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4 space-y-3">
        {/* Skeleton for subtotal/summary */}
        <div className="flex justify-between items-center pb-4 border-b">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
        {/* Skeleton for checkout buttons */}
        <Skeleton className="h-14 w-full rounded-sm" />
        <Skeleton className="h-12 w-full rounded-sm" />
      </div>
    </div>
  );
}

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCompletePurchase, setShowCompletePurchase] = useState(false);

  const debug = (label, data) =>
    console.log(`[🛒 Cart DEBUG] ${label}`, data ?? "");

  // Check login status
  const checkLogin = useCallback(async () => {
    try {
      const res = await fetch("/api/account/check", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setIsLoggedIn(false);
        return false;
      }
      const data = await res.json();
      const logged = !!data?.user?.id;
      setIsLoggedIn(logged);
      return logged;
    } catch {
      setIsLoggedIn(false);
      return false;
    }
  }, []);

  // Fetch cart from backend (Logged-in user)
  const fetchCart = useCallback(async () => {
    debug("fetchCart() started (Logged-in)");
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      debug("fetchCart data", data);
      setCartItems(data);
    } catch (err) {
      debug("fetchCart error", err);
      setCartItems([]);
      toast.error("Cart information could not be loaded from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load guest cart from localStorage (Guest user)
  const loadGuestCart = useCallback(() => {
    debug("loadGuestCart() started (Guest)");
    setLoading(true);
    try {
      const cart = getCart();
      // Map guest cart structure to match the logged-in user cart structure for consistency
      const guestCart = cart.map((item) => ({
        id: undefined, // No backend ID for guest items
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.productId,
          name: item.title,
          description: item.description,
          price: item.price,
          oldPrice: item.oldPrice,
          mainImage: item.image,
          category: item.category,
        },
        customName: item.customName,
      }));
      debug("Guest cart loaded", guestCart);
      setCartItems(guestCart);
    } catch (err) {
      debug("loadGuestCart() error", err);
      toast.error(
        "An error occurred while loading cart information from local storage."
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load (Login check + Cart load)
  useEffect(() => {
    (async () => {
      debug("Initial login + cart load");
      const logged = await checkLogin();
      if (logged) await fetchCart();
      else loadGuestCart();
    })();
  }, [checkLogin, fetchCart, loadGuestCart]);

  // Listen for cart updates from other parts of the app
  useEffect(() => {
    const handleCartUpdate = () => {
      debug("Cart update event received");
      if (isLoggedIn) fetchCart();
      else loadGuestCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [isLoggedIn, fetchCart, loadGuestCart]);

  /**
   * 🛒 Update Quantity Operation
   */
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    // **Guest Cart (Local Storage):**
    if (!isLoggedIn) {
      try {
        // 'id' for guest cart is assumed to be 'productId'
        updateGuestCartQuantityUtil(id, newQuantity);
        loadGuestCart(); // Re-load the cart to update the state
        toast.success("Quantity updated successfully.");
        // 🔥 Update the header/other components
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } catch (err) {
        console.error("Guest quantity update error:", err);
        toast.error("Could not update quantity in the local cart.");
      }
      return;
    }

    // **Logged-in Cart (API):**
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Quantity could not be updated");
        return;
      }

      const updatedItem = await res.json();
      setCartItems((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, quantity: updatedItem.quantity } : c
        )
      );
      toast.success("Quantity updated successfully.");
      // 🔥 Update the header/other components
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (err) {
      console.error("Quantity update error (API):", err);
      toast.error("Quantity could not be updated");
    }
  };

  /**
   * 🗑️ Remove from Cart Operation
   */
  const removeFromCart = async (id) => {
    // **Guest Cart (Local Storage):**
    if (!isLoggedIn) {
      // 'id' for guest cart is assumed to be 'productId'
      removeFromGuestCart(id);
      loadGuestCart(); // Re-load the cart to update the state
      toast.success("Product removed from cart");
      // 🔥 Update the header/other components
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    // **Logged-in Cart (API):**
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((c) => c.id !== id));
        toast.success("Product removed from cart");
        // 🔥 Update the header/other components
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Product could not be removed");
      }
    } catch {
      toast.error("Product could not be removed");
    }
  };

  // Use cartItems directly - no enrichment needed
  // Logged-in users: cartItems already contains full product data from backend
  // Guest users: loadGuestCart already maps the data with product info
  const enrichedItems = useMemo(() => cartItems, [cartItems]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return enrichedItems.reduce((acc, item) => {
      const product = item.product || {};
      // Determine the base price, considering standard price, price per M2, or the item's own price field
      const basePrice = product.price || product.pricePerM2 || item.price || 0;
      const quantity = item.quantity || 1;
      // Assume 'm2' defaults to 1 if not specified, likely for products priced per square meter
      const m2 = item.m2 || 1;

      return acc + basePrice * quantity * m2;
    }, 0);
  }, [enrichedItems]);

  if (loading) return <CartSkeleton />;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <SheetHeader className="py-4 px-5 border-b">
        <SheetTitle>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-900">My Cart</span>
            <SheetClose asChild>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </SheetClose>
          </div>
        </SheetTitle>
        <SheetDescription className="text-xs text-gray-500 mt-1">
          {enrichedItems.length} {enrichedItems.length === 1 ? "item" : "items"}
        </SheetDescription>
      </SheetHeader>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {enrichedItems.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center text-center pt-20 px-4">
            <ShoppingBag
              className="h-12 w-12 text-gray-300 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-sm text-gray-500 mb-6">Your cart is empty</p>
            <Button asChild variant="outline" className="text-sm">
              <Link href="/all_products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          // Cart Items List
          <div className="space-y-3">
            {enrichedItems.map((item, index) => (
              <div
                // Use backend ID or a combination of productId and index for guest cart keys
                key={item.id || `${item.productId}-${index}`}
                className="border-b last:border-0 pb-3 last:pb-0"
              >
                <CartItem
                  item={item}
                  product={item.product}
                  // Pass appropriate ID (backend ID or productId) and handlers
                  onIncrease={() =>
                    updateQuantity(item.id || item.productId, item.quantity + 1)
                  }
                  onDecrease={() =>
                    updateQuantity(item.id || item.productId, item.quantity - 1)
                  }
                  onRemove={() => removeFromCart(item.id || item.productId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUGGESTED PRODUCTS (CompletePurchase Component) */}
      {enrichedItems.length > 0 && !showCompletePurchase && (
        <div className="px-4 py-3 border-t">
          <button
            onClick={() => setShowCompletePurchase(true)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
          >
            Add recommended products →
          </button>
        </div>
      )}
      {showCompletePurchase && (
        <CompletePurchase
          onClose={() => setShowCompletePurchase(false)}
          onCartUpdate={(updatedCart) => {
            setCartItems(updatedCart);
            // Trigger update event after adding recommended items
            window.dispatchEvent(new CustomEvent("cartUpdated"));
          }}
        />
      )}

      {/* SUMMARY / FOOTER */}
      {enrichedItems.length > 0 && (
        <div className="px-4 py-3 border-t">
          <CartSummary subtotal={subtotal} />
        </div>
      )}
    </div>
  );
}
