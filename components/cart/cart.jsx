"use client";

import React, { useState, useEffect } from "react";
import CartItem from "./cartItem";
import CartSummary from "./cartSummary";
import Loading from "../layout/loading";
import { ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

// Guest cart utils
import {
  getCart,
  addToGuestCart,
  updateGuestCartQuantity,
  removeFromGuestCart,
} from "@/utils/cart";

export default function Cart() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [enrichedItems, setEnrichedItems] = useState([]);
  const [isEnriching, setIsEnriching] = useState(false);

  /* ------------------------------------
      🟦 1) SEPETİ YÜKLE (LOGIN / GUEST)
  ------------------------------------ */
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      if (!isLoggedIn) {
        // GUEST CART
        setCartItems(getCart());
        setLoading(false);
        return;
      }

      // API CART (GET /api/cart)
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        // API'den gelen veriler, ürün detaylarını (price, name) zaten içerir
        // çünkü API'de 'include: { product: true }' kullanılıyor.
        setCartItems(data || []);
      } catch {
        setCartItems([]);
      }

      setLoading(false);
    };

    loadCart();
  }, [isLoggedIn]);

  /* ------------------------------------
      🟦 2) GUEST CART EVENT LİSTENER
  ------------------------------------ */
  useEffect(() => {
    if (!isLoggedIn) {
      const listener = () => setCartItems(getCart());
      window.addEventListener("cartUpdated", listener);
      return () => window.removeEventListener("cartUpdated", listener);
    }
  }, [isLoggedIn]);

  /* ------------------------------------
      🟩 3) ÜRÜNLERİ ZENGİNLEŞTİR (API'den fiyat çek)
  ------------------------------------ */
  useEffect(() => {
    // Giriş yapan kullanıcılar için API zaten ürün verilerini (fiyat/isim)
    // getiriyor (include: { product: true } sayesinde).
    // Misafir kullanıcılar için, sepet öğelerinde yalnızca productId ve quantity
    // varsa zenginleştirme gereklidir.
    const enrichCartItems = async () => {
      if (cartItems.length === 0) {
        setEnrichedItems([]);
        return;
      }

      // Giriş yapan kullanıcıda sepet öğeleri zaten zenginleştirilmiş olmalıdır.
      // Kontrol: İlk öğede ürün bilgisi var mı? (Giriş yapan kullanıcı için)
      // Misafir kullanıcılar için zenginleştirme hala çalışmalıdır.
      const needsEnrichment = cartItems.some(
        (item) => !item.product?.price || !item.product?.name
      );

      if (!needsEnrichment && isLoggedIn) {
        setEnrichedItems(cartItems);
        return;
      }

      setIsEnriching(true);

      const enriched = await Promise.all(
        cartItems.map(async (item) => {
          // Ürün bilgisi eksikse API'den çek
          if (!item.product?.price || !item.product?.name) {
            try {
              const res = await fetch(`/api/products/${item.productId}`);
              if (res.ok) {
                const data = await res.json();
                return { ...item, product: data.product };
              }
            } catch {}
          }
          return item;
        })
      );

      setEnrichedItems(enriched);
      setIsEnriching(false);
    };

    enrichCartItems();
  }, [cartItems, isLoggedIn]); // isLoggedIn bağımlılığını ekledik

  /* ------------------------------------
      🟧 4) MİKTAR ARTTIRMA / AZALTMA
      (productId yerine cartItemId kullanıyoruz)
  ------------------------------------ */
  const updateQuantity = async (cartItemId, newQuantity) => {
    // cartItemId aslında Misafir sepetinde productId'ye karşılık gelir.
    if (!isLoggedIn) {
      updateGuestCartQuantity(cartItemId, newQuantity);
      return;
    }

    // API CART (PATCH /api/cart/[id])
    // `id` burada cartItem'ın benzersiz kimliğidir.
    try {
      await fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      // Sepeti yeniden yükle
      const refreshed = await fetch("/api/cart").then((r) => r.json());
      setCartItems(refreshed || []);
    } catch (error) {
      console.error("Miktar güncelleme hatası:", error);
    }
  };

  /* ------------------------------------
      🟥 5) ÜRÜN SİLME
      (productId yerine cartItemId kullanıyoruz)
  ------------------------------------ */
  const removeFromCart = async (cartItemId) => {
    // cartItemId aslında Misafir sepetinde productId'ye karşılık gelir.
    if (!isLoggedIn) {
      removeFromGuestCart(cartItemId);
      return;
    }

    // API CART (DELETE /api/cart/[id])
    // `id` burada cartItem'ın benzersiz kimliğidir.
    try {
      await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });

      // Sepeti yeniden yükle
      const refreshed = await fetch("/api/cart").then((r) => r.json());
      setCartItems(refreshed || []);
    } catch (error) {
      console.error("Ürün silme hatası:", error);
    }
  };

  /* ------------------------------------
      🧮 6) SUBTOTAL HESABI
  ------------------------------------ */
  const subtotal = enrichedItems.reduce((acc, item) => {
    // Giriş yapan kullanıcılar için fiyat bilgisi `item.product.price`'da olmalıdır.
    // Misafirler için (zenginleştirme öncesi/sonrası) `item.price` veya `item.product.price` kontrol edilir.
    const price = item.product?.price || item.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  if (loading || isEnriching) return <Loading />;

  console.log("enrichedItems", enrichedItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-medium text-gray-900 mb-2 tracking-wide">
            Shopping Cart
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">
            {enrichedItems.length}{" "}
            {enrichedItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {enrichedItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              enrichedItems.map((item) => (
                <CartItem
                  // Giriş yapan kullanıcı için key olarak item.id (cartItemId) kullanıldı.
                  // Misafir kullanıcılar için item.id (productId) ve customName kombinasyonu kullanıldı.
                  key={
                    isLoggedIn
                      ? item.id
                      : `${item.productId}-${item.customName || "none"}`
                  }
                  item={item}
                  onIncrease={() =>
                    // API'ye cartItemId gönderilecek. Misafir için ise productId.
                    updateQuantity(
                      isLoggedIn ? item.id : item.productId,
                      item.quantity + 1
                    )
                  }
                  onDecrease={() =>
                    item.quantity > 1 &&
                    updateQuantity(
                      isLoggedIn ? item.id : item.productId,
                      item.quantity - 1
                    )
                  }
                  onRemove={() =>
                    // API'ye cartItemId gönderilecek. Misafir için ise productId.
                    removeFromCart(isLoggedIn ? item.id : item.productId)
                  }
                />
              ))
            )}
          </div>

          <div className="lg:w-96">
            <CartSummary subtotal={subtotal} itemCount={enrichedItems.length} />
          </div>
        </div>
      </div>
    </div>
  );
}
