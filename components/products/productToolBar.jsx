"use client";

import React, { useState, useMemo } from "react";
import {
  Columns4,
  Columns3,
  StretchHorizontal,
  StretchVertical,
  Search,
  ArrowDownUp,
  X,
} from "lucide-react";
import ProductCard from "./productCard";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Skeleton } from "../ui/skeleton";

const ToolbarItem = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm transition-all duration-300 focus:outline-none relative font-light tracking-wide ${
      isActive
        ? "text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
        : "text-gray-500 hover:text-black"
    }`}
  >
    {label}
  </button>
);

// 🆕 Product Card Skeleton
const ProductCardSkeleton = ({ view }) => {
  const isGridOne = view === "grid-1";

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <Skeleton className={`w-full ${isGridOne ? "h-64" : "h-48"}`} />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default function ProductToolbar({ products, loading = false }) {
  const [activeSort, setActiveSort] = useState("Newest");
  const [desktopView, setDesktopView] = useState("grid-4");
  const [mobileView, setMobileView] = useState("grid-1");
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  const sortOptions = [
    "Price ascending",
    "Price descending",
    "Discount ascending",
    "Discount descending",
    "Oldest",
    "Newest",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((p) =>
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (activeSort) {
      case "Price ascending":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price descending":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Discount ascending":
        result.sort((a, b) => a.discount - b.discount);
        break;
      case "Discount descending":
        result.sort((a, b) => b.discount - a.discount);
        break;
      case "Oldest":
        result.sort((a, b) => a.id - b.id);
        break;
      case "Newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [products, search, activeSort]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        {/* Mobile Toolbar - Premium */}
        {isMobile && (
          <div className="flex items-center bg-white rounded-xs overflow-hidden">
            <button
              onClick={() =>
                setMobileView(mobileView === "grid-1" ? "grid-2" : "grid-1")
              }
              className="flex-1 flex items-center justify-center py-3 text-black font-light hover:bg-gray-50 transition-colors"
            >
              {mobileView === "grid-1" ? (
                <StretchHorizontal className="h-5 w-5" />
              ) : (
                <StretchVertical className="h-5 w-5" />
              )}
            </button>

            <div className="w-px bg-gray-200 h-8" />

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex-1 flex items-center justify-center py-3 text-black font-light hover:bg-gray-50 transition-colors">
                  <ArrowDownUp className="w-5 h-5 mr-2" /> Sort
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="p-6 bg-white shadow-2xl rounded-t-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-light text-gray-800">
                    Sort Options
                  </h4>
                  <SheetClose asChild>
                    <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                      <X className="h-6 w-6 text-gray-700" />
                    </button>
                  </SheetClose>
                </div>
                <ul className="space-y-1">
                  {sortOptions.map((option) => (
                    <li key={option}>
                      <button
                        onClick={() => setActiveSort(option)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                          activeSort === option
                            ? "font-semibold text-black bg-gray-100"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Mobile Search - Premium */}
        {isMobile && (
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 h-12 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-black shadow-sm"
            />
          </div>
        )}

        {/* Desktop Toolbar - Premium */}
        {!isMobile && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 px-6 flex items-center justify-between gap-6 shadow-sm">
            <div className="relative w-80 flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2 h-11 bg-gray-50 border border-gray-200 rounded-lg focus:border-black focus:ring-black"
              />
            </div>

            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide flex-1 justify-center">
              {sortOptions.map((option) => (
                <ToolbarItem
                  key={option}
                  label={option}
                  isActive={activeSort === option}
                  onClick={() => setActiveSort(option)}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDesktopView("grid-3")}
                className={`px-3 py-3 border rounded-full transition-all ${
                  desktopView === "grid-3"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                <Columns3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDesktopView("grid-4")}
                className={`px-3 py-3 border rounded-full transition-all ${
                  desktopView === "grid-4"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                <Columns4 className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div
          className={
            isMobile
              ? mobileView === "grid-1"
                ? "grid grid-cols-1 gap-1"
                : "grid grid-cols-2 gap-1"
              : desktopView === "grid-3"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1"
          }
        >
          {loading ? (
            // 🆕 Skeleton Loading State
            Array.from({
              length: isMobile ? 4 : desktopView === "grid-3" ? 6 : 8,
            }).map((_, index) => (
              <ProductCardSkeleton
                key={index}
                view={isMobile ? mobileView : desktopView}
              />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
                view={isMobile ? mobileView : desktopView}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
