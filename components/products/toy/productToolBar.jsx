"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
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

const ToolbarItem = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-3 text-sm transition-colors focus:outline-none relative",
      isActive
        ? "text-black font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black bg-gray-100"
        : "text-gray-500 hover:text-black hover:bg-gray-50"
    )}
  >
    {label}
  </button>
);

export default function ProductToolbar({ products }) {
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

  // Filtreleme + arama + sıralama
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Arama
    if (search.trim()) {
      result = result.filter((p) =>
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sıralama
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
      <div className="flex-1 flex flex-col gap-4">
        {/* Mobil Toolbar */}
        {isMobile && (
          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
            {/* Grid toggle */}
            <button
              onClick={() =>
                setMobileView(mobileView === "grid-1" ? "grid-2" : "grid-1")
              }
              className="flex-1 flex items-center justify-center py-2 text-black font-semibold"
            >
              {mobileView === "grid-1" ? (
                <StretchHorizontal className="h-4 w-4" />
              ) : (
                <StretchVertical className="h-4 w-4" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px bg-gray-300 h-6" />

            {/* Sırala */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex-1 flex items-center justify-center py-2 text-gray-900 hover:text-black">
                  <ArrowDownUp className="w-4 h-4 mr-1" /> Sort
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-4 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold mb-3">Sort</h4>
                  <SheetClose asChild>
                    <button>
                      <X className="h-6 w-6 text-gray-700 cursor-pointer" />
                    </button>
                  </SheetClose>
                </div>
                <ul className="space-y-2">
                  {sortOptions.map((option) => (
                    <li key={option}>
                      <button
                        onClick={() => setActiveSort(option)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded hover:bg-gray-100",
                          activeSort === option
                            ? "font-semibold text-black"
                            : "text-gray-700"
                        )}
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

        {/* Mobilde Arama */}
        {isMobile && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 h-10 "
            />
          </div>
        )}

        {/* Masaüstü Toolbar */}
        {!isMobile && (
          <div className="bg-gray-100 rounded-none p-2 px-6 flex items-center justify-between gap-4">
            {/* Search input (sol tarafa eklendi, bg toolbar'dan bağımsız) */}
            <div className="relative w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 h-9 bg-white border border-gray-300"
              />
            </div>

            {/* Sıralama butonları */}
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

            {/* Grid toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDesktopView("grid-3")}
                className={cn(
                  "px-3 py-1 text-sm border rounded",
                  desktopView === "grid-3"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-500"
                )}
              >
                <Columns3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDesktopView("grid-4")}
                className={cn(
                  "px-3 py-1 text-sm border rounded",
                  desktopView === "grid-4"
                    ? "bg-gray-300 text-black"
                    : "bg-white text-gray-500"
                )}
              >
                <Columns4 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Ürün Grid */}
        <div
          className={
            isMobile
              ? mobileView === "grid-1"
                ? "grid grid-cols-1 gap-6"
                : "grid grid-cols-2 gap-6"
              : desktopView === "grid-3"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              view={isMobile ? mobileView : desktopView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
