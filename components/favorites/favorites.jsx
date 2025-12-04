"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/products/productCard";
import { Heart, ShoppingBag } from "lucide-react";
import { useFavorite } from "@/contexts/favoriteContext";

export default function Favorites() {
  const { favorites, removeFavorite, loading: favLoading } = useFavorite();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favLoading) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productData = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error(`Product ${id} not found`);
            const data = await res.json();
            return data.product;
          })
        );
        setProducts(productData);
      } catch (err) {
        console.error("Error fetching favorite products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [favorites, favLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/30">

      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
              My Favorites
            </h1>
            <p className="text-sm text-slate-500">
              Your curated collection of favorite products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                No favorites yet
              </h3>
              <p className="text-slate-600 mb-6 text-center max-w-md">
                Start adding products to your favorites to create your
                personalized collection
              </p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <ShoppingBag className="h-4 w-4" />
                <span>Browse our collection to find products you love</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-600">
                  {products.length} {products.length === 1 ? "item" : "items"}{" "}
                  in your collection
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRemove={() => removeFavorite(product.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
