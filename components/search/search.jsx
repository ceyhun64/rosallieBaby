"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Search, Sparkles, Package } from "lucide-react";
import ProductCard from "./productCard";
import Image from "next/image";

export default function DefaultSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex items-center gap-4">
            {/* Desktop Logo */}
            {!isMobile && (
              <Link
                href="/"
                className="text-[16px] md:text-[26px] tracking-[0.04em] text-gray-900 font-serif font-extralight hover:opacity-80 transition-all"
              >
                <Image
                  src="/logo/logo2.webp"
                  alt="Logo"
                  width={84}
                  height={80}
                />
              </Link>
            )}

            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>

              <input
                type="text"
                placeholder="Search for premium products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-11 bg-slate-50/50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 transition-all"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0"
              aria-label="Go back"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Search Info */}
        {query && (
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 border border-slate-200/60 rounded-lg">
              <span className="text-sm text-slate-600">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "result" : "results"} for
              </span>
              <span className="text-sm font-semibold text-slate-900">
                "{query}"
              </span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-amber-400 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-slate-200/60 shadow-sm p-12">
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {query ? "No products found" : "Start your search"}
            </h3>
            <p className="text-sm text-slate-500 text-center max-w-sm">
              {query
                ? `We couldn't find any products matching "${query}". Try different keywords.`
                : "Enter a search term to discover our premium collection"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
