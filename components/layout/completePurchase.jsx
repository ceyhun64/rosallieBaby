"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function CompletePurchase({ onClose,onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState({});

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
    try {
      const sessionRes = await fetch("/api/account/check");
      const sessionData = await sessionRes.json();

      if (!sessionData.user) {
        toast.error("You must log in before adding to cart!");
        window.location.href = "/account/login";
        return;
      }

      const selected = products.filter((p) => selectedProducts[p.id]);
      if (!selected.length) {
        toast.error("No products selected!");
        return;
      }

      for (const product of selected) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            strollerCover: false,
            customName: "none",
            hatToyOption: "none",
          }),
        });
      }

      // 🔹 Sepeti yeniden fetch edip ana component’e gönder
      const res = await fetch("/api/cart");
      const updatedCart = await res.json();
      if (onCartUpdate) onCartUpdate(updatedCart);

      toast.success("Selected products added to cart!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error adding products to cart!");
    }
  };
  if (loading) return <p className="text-center py-4">Loading products...</p>;
  if (!products.length)
    return <p className="text-center py-4">No suggested products available.</p>;

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Complete Your Purchase!
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex flex-row items-center rounded-md p-2"
          >
            <img
              src={product.mainImage}
              alt={product.description}
              className="w-16 h-16 object-cover rounded-sm"
            />
            <CardContent className="p-2 flex-1 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">{product.description}</h3>
                <span className="text-xs font-bold text-teal-600">
                  €{product.price.toFixed(2)}
                </span>
              </div>
              <Switch
                checked={selectedProducts[product.id]}
                onCheckedChange={() => handleSwitchChange(product)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          className="bg-black text-white hover:bg-gray-800 rounded-none"
          onClick={handleAddAllToCart}
        >
          Add Selected to Cart
        </Button>
      </div>
    </div>
  );
}
