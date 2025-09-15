"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Columns4, Columns3 } from "lucide-react";
import ProductCard from "./productCard";

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
  const [view, setView] = useState("grid-4");

  const sortOptions = [
    "Price ascending",
    "Price descending",
    "Discount ascending",
    "Discount descending",
    "Oldest",
    "Newest",
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex justify-between items-center py-3 bg-white pr-4 mb-6">
        
        {/* Sorting options */}
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide">
          {sortOptions.map((option) => (
            <ToolbarItem
              key={option}
              label={option}
              isActive={activeSort === option}
              onClick={() => setActiveSort(option)}
            />
          ))}
        </div>

        {/* View switcher */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setView("grid-3")}
            className={cn(
              "px-3 py-1 text-sm border rounded",
              view === "grid-3"
                ? "bg-gray-200 text-black"
                : "bg-white text-gray-500"
            )}
          >
            <Columns3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("grid-4")}
            className={cn(
              "px-3 py-1 text-sm border rounded",
              view === "grid-4"
                ? "bg-gray-200 text-black"
                : "bg-white text-gray-500"
            )}
          >
            <Columns4 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={
          view === "grid-3"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            : view === "grid-4"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            : "flex flex-col gap-6"
        }
      >
        {products.map((product) => (
          <ProductCard product={product} key={product.id} view={view} />
        ))}
      </div>
    </div>
  );
}
