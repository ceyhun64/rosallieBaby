"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { addToGuestCart } from "@/utils/cart";

export default function CompletePurchase({ onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adding, setAdding] = useState(false);

  // Kullanıcı oturum durumunu kontrol et
  useEffect(() => {
    async function checkSession() {
      try {
        const sessionRes = await fetch("/api/account/check");
        const sessionData = await sessionRes.json();
        setIsLoggedIn(!!sessionData?.user?.id);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, []);

  // Önerilen ürünleri getir
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Rastgele 1 Toy ve 1 Hospital Outfit Set
        const categories = ["toy", "hospital_outfit_set"];
        const selected = categories
          .map((category) => {
            const items = data.products.filter((p) => p.category === category);
            if (!items.length) return null;
            const randomIndex = Math.floor(Math.random() * items.length);
            return items[randomIndex];
          })
          .filter(Boolean);

        setProducts(selected);

        // Başlangıçta hiçbir ürün seçili değil
        const initialSelected = {};
        selected.forEach((p) => (initialSelected[p.id] = false));
        setSelectedProducts(initialSelected);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleSwitchChange = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
  };

  const handleAddAllToCart = async () => {
    const selected = products.filter((p) => selectedProducts[p.id]);

    if (!selected.length) {
      toast.error("No products selected!");
      return;
    }

    setAdding(true);

    try {
      if (isLoggedIn) {
        // 🔑 GİRİŞ YAPMIŞ KULLANICI: API üzerinden sepete ekle
        for (const product of selected) {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              productId: product.id,
              quantity: 1,
              customName: "none",
            }),
          });

          if (!res.ok) {
            throw new Error(
              `Failed to add ${product.name || product.description}`
            );
          }
        }

        toast.success(`${selected.length} product(s) added to cart!`);
      } else {
        // 👤 MİSAFİR KULLANICI: LocalStorage üzerinden sepete ekle
        for (const product of selected) {
          // addToGuestCart fonksiyonu için uygun format
          const guestProduct = {
            productId: product.id,
            title: product.name || product.description,
            description: product.description,
            price: product.price,
            oldPrice: product.oldPrice || 0,
            image: product.mainImage,
            category: product.category,
            customName: "none",
          };

          addToGuestCart(guestProduct, 1);
        }

        toast.success(`${selected.length} product(s) added to cart!`);
      }

      // 🔥 Sepet güncellendiğini bildir (Header'daki sayaç güncellenecek)
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      // Paneli kapat
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding products:", err);
      toast.error("Error adding products to cart!");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="border-t p-6 bg-white">
        <p className="text-center py-6 text-sm text-gray-500">
          Loading suggestions...
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="border-t p-6 bg-white">
        <p className="text-center py-6 text-sm text-gray-500">
          No suggestions available.
        </p>
      </div>
    );
  }

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  return (
    <div className="border-t p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">
            Complete Your Purchase
          </h3>
          {selectedCount > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
            </p>
          )}
        </div>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          onClick={onClose}
          disabled={adding}
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className={`flex items-center gap-3 p-3 border transition-all ${
              selectedProducts[product.id]
                ? "border-gray-900 bg-gray-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <img
              src={product.mainImage}
              alt={product.description}
              className="w-14 h-14 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm text-gray-900 truncate">
                {product.name || product.description}
              </h3>
              <span className="text-sm font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <Switch
              checked={selectedProducts[product.id]}
              onCheckedChange={() => handleSwitchChange(product)}
              disabled={adding}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={adding}
          className="px-6 py-2 text-sm"
        >
          Cancel
        </Button>
        <Button
          className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 text-sm"
          onClick={handleAddAllToCart}
          disabled={selectedCount === 0 || adding}
        >
          {adding ? "Adding..." : `Add to Cart (${selectedCount})`}
        </Button>
      </div>
    </div>
  );
}
