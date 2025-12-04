"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Columns4,
  Columns3,
  StretchHorizontal,
  StretchVertical,
  Search,
  Filter,
  ArrowDownUp,
  X,
} from "lucide-react";
import ProductCard from "@/components/products/productCard";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

// --- Yeni Bileşen: Skeleton Ürün Kartı ---
const ProductCardSkeleton = ({ view }) => {
  const isListView = view === "grid-1"; // Mobil tekli liste görünümü veya geniş tekli görünüm

  return (
    <div
      className={cn(
        "p-2 bg-white border border-slate-100 rounded-lg shadow-sm flex",
        isListView ? "flex-row gap-4" : "flex-col gap-2"
      )}
    >
      <Skeleton
        className={cn(
          "bg-slate-200/50",
          isListView ? "w-24 h-24 flex-shrink-0" : "w-full h-64" // Liste görünümünde daha küçük resim
        )}
      />
      <div
        className={cn(
          "flex flex-col gap-2",
          isListView ? "py-2 flex-grow" : "p-2"
        )}
      >
        <Skeleton className="h-4 w-3/4 bg-slate-200/50" />
        <Skeleton className="h-3 w-1/2 bg-slate-200/50" />
        <div className="flex justify-between items-center mt-auto">
          <Skeleton className="h-4 w-1/4 bg-slate-200/50" />
          <Skeleton className="h-8 w-1/4 bg-slate-200/50 rounded-full" />
        </div>
      </div>
    </div>
  );
};
// ----------------------------------------

const ToolbarItem = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-8 py-4 text-sm font-light tracking-wide transition-all duration-500 relative group",
      isActive
        ? "text-slate-900 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-rose-400 after:to-transparent"
        : "text-slate-500 hover:text-slate-800"
    )}
  >
    <span className="relative z-10">{label}</span>
    {!isActive && (
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )}
  </button>
);

export default function ProductToolbar({ products }) {
  const [activeSort, setActiveSort] = useState("Newest");
  const [desktopView, setDesktopView] = useState("grid-4");
  const [mobileView, setMobileView] = useState("grid-1");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isMobile = useIsMobile();

  const sortOptions = [
    "Price ascending",
    "Price descending",
    "Discount ascending",
    "Discount descending",
    "Oldest",
    "Newest",
  ];

  const staticCategories = [
    { name: "Hospital Outfit Set", value: "hospital_outfit_set" },
    { name: "Toys", value: "toy" },
    { name: "Special Set", value: "hospital_outfit_special_set" },
  ];

  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory(
      selectedCategory === categoryValue ? null : categoryValue
    );
  };

  const searchFilteredProducts = useMemo(() => {
    if (search.trim()) {
      return products.filter((p) =>
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return products;
  }, [products, search]);

  const categoriesWithCount = useMemo(() => {
    const allCount = searchFilteredProducts.length;

    const categoryCounts = staticCategories.map((category) => {
      const count = searchFilteredProducts.filter(
        (p) => p.category === category.value
      ).length;
      return {
        ...category,
        count: count,
      };
    });

    return [{ name: "All", value: null, count: allCount }, ...categoryCounts];
  }, [searchFilteredProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...searchFilteredProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
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
  }, [searchFilteredProducts, selectedCategory, activeSort]);

  const currentCategoryName = categoriesWithCount.find(
    (c) => c.value === selectedCategory
  )?.name;

  // --- Skeleton Logic ---
  // Ürün listesi boşsa ve arama yapılmıyorsa, iskeletleri göster
  const isLoading = products.length === 0 && search.length === 0;
  const currentView = isMobile ? mobileView : desktopView;
  const skeletonCount = isMobile ? (currentView === "grid-1" ? 4 : 6) : 8; // Görünüme göre iskelet sayısı
  const skeletonArray = Array.from({ length: skeletonCount }, (_, i) => i);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Desktop: Zarif Sol Panel */}
      {!isMobile && (
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-30 space-y-8">
            {/* Minimalist Arama */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 transition-all duration-300 group-hover:text-rose-500" />
              <Input
                type="text"
                placeholder="Search elegance..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-5 py-6 h-14 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-none focus:ring-0 focus:border-slate-300 transition-all duration-500 font-light text-slate-700 placeholder:text-slate-400 shadow-sm hover:shadow-md hover:bg-white"
              />
            </div>

            {/* Elegant Kategoriler */}
            <div className="bg-white/60 backdrop-blur-md rounded-none border border-slate-200/50 overflow-hidden">
              <Accordion
                type="single"
                collapsible
                defaultValue="sub-categories"
              >
                <AccordionItem value="sub-categories" className="border-none">
                  <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                    <div className="flex items-center gap-3">
                      <div className="w-px h-5 bg-gradient-to-b from-transparent via-rose-400 to-transparent" />
                      <span className="text-sm font-light tracking-widest uppercase text-slate-600 group-hover:text-slate-900 transition-colors">
                        Collections
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8">
                    <ul className="space-y-1">
                      {isLoading
                        ? // Yüklenirken iskelet kategoriler
                          Array.from({ length: 4 }).map((_, i) => (
                            <li key={i}>
                              <Skeleton className="h-10 w-full bg-slate-200/50 my-2" />
                            </li>
                          ))
                        : categoriesWithCount.map((category) => (
                            <li key={category.name}>
                              <button
                                onClick={() =>
                                  handleCategoryClick(category.value)
                                }
                                className={cn(
                                  "group flex justify-between items-center w-full text-left px-5 py-4 transition-all duration-300 border-l-2",
                                  selectedCategory === category.value
                                    ? "border-rose-400 bg-rose-50/30 translate-x-1"
                                    : "border-transparent hover:border-slate-200 hover:translate-x-1"
                                )}
                              >
                                <span
                                  className={cn(
                                    "font-light text-base tracking-wide transition-colors",
                                    selectedCategory === category.value
                                      ? "text-slate-900"
                                      : "text-slate-600 group-hover:text-slate-900"
                                  )}
                                >
                                  {category.name}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs font-light tracking-wider transition-colors",
                                    selectedCategory === category.value
                                      ? "text-rose-500"
                                      : "text-slate-400 group-hover:text-slate-600"
                                  )}
                                >
                                  {category.count}
                                </span>
                              </button>
                            </li>
                          ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      )}

      {/* Sağ taraf */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Mobile Minimalist Toolbar */}
        {isMobile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-none border border-slate-200/60 overflow-hidden">
            <div className="flex items-center divide-x divide-slate-200/40">
              <button
                onClick={() =>
                  setMobileView(mobileView === "grid-1" ? "grid-2" : "grid-1")
                }
                className="flex-1 flex items-center justify-center py-5 text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300"
              >
                {mobileView === "grid-1" ? (
                  <StretchHorizontal className="h-5 w-5" />
                ) : (
                  <StretchVertical className="h-5 w-5" />
                )}
              </button>

              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex-1 flex items-center justify-center gap-2 py-5 text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 font-light">
                    <Filter className="w-5 h-5" />
                    <span className="text-xs tracking-wide">Filter</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-white">
                  <div className="p-8 border-b border-slate-200/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-px h-5 bg-gradient-to-b from-transparent via-rose-400 to-transparent" />
                        <h3 className="text-sm font-light tracking-widest uppercase text-slate-700">
                          Collections
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <ul className="space-y-1">
                      {isLoading
                        ? // Yüklenirken iskelet kategoriler (Mobile Sheet)
                          Array.from({ length: 4 }).map((_, i) => (
                            <li key={i}>
                              <Skeleton className="h-10 w-full bg-slate-200/50 my-2" />
                            </li>
                          ))
                        : categoriesWithCount.map((category) => (
                            <li key={category.name}>
                              <SheetClose asChild>
                                <button
                                  onClick={() =>
                                    handleCategoryClick(category.value)
                                  }
                                  className={cn(
                                    "group flex justify-between items-center w-full text-left px-5 py-4 transition-all duration-300 border-l-2",
                                    selectedCategory === category.value
                                      ? "border-rose-400 bg-rose-50/30"
                                      : "border-transparent hover:border-slate-200"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "font-light tracking-wide",
                                      selectedCategory === category.value
                                        ? "text-slate-900"
                                        : "text-slate-600"
                                    )}
                                  >
                                    {category.name}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs font-light",
                                      selectedCategory === category.value
                                        ? "text-rose-500"
                                        : "text-slate-400"
                                    )}
                                  >
                                    {category.count}
                                  </span>
                                </button>
                              </SheetClose>
                            </li>
                          ))}
                    </ul>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex-1 flex items-center justify-center gap-2 py-5 text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 transition-all duration-300 font-light">
                    <ArrowDownUp className="w-5 h-5" />
                    <span className="text-xs tracking-wide">Sort</span>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="bg-white rounded-t-none border-t border-slate-200/60"
                >
                  <div className="p-8 border-b border-slate-200/40">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-light tracking-widest uppercase text-slate-700">
                        Sort By
                      </h4>
                      <SheetClose asChild>
                        <button className="p-2 hover:bg-slate-50 rounded-none transition-colors">
                          <X className="h-4 w-4 text-slate-600" />
                        </button>
                      </SheetClose>
                    </div>
                  </div>
                  <div className="p-8 max-h-96 overflow-y-auto">
                    <ul className="space-y-1">
                      {sortOptions.map((option) => (
                        <li key={option}>
                          <SheetClose asChild>
                            <button
                              onClick={() => setActiveSort(option)}
                              className={cn(
                                "w-full text-left px-5 py-4 transition-all duration-300 font-light tracking-wide border-l-2",
                                activeSort === option
                                  ? "border-rose-400 bg-rose-50/30 text-slate-900"
                                  : "border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-900"
                              )}
                            >
                              {option}
                            </button>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}

        {/* Mobile Minimalist Arama */}
        {isMobile && (
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 transition-all duration-300 group-hover:text-rose-500" />
            <Input
              type="text"
              placeholder="Search elegance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-6 h-14 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-none focus:ring-0 focus:border-slate-300 transition-all duration-500 font-light text-slate-700 placeholder:text-slate-400"
            />
          </div>
        )}

        {/* Desktop Minimalist Toolbar */}
        {!isMobile && (
          <div className="bg-white/60 backdrop-blur-md rounded-none border-y border-slate-200/40 overflow-hidden">
            <div className="flex items-center justify-between px-4">
              <div className="flex overflow-x-auto scrollbar-hide">
                {sortOptions.map((option) => (
                  <ToolbarItem
                    key={option}
                    label={option}
                    isActive={activeSort === option}
                    onClick={() => setActiveSort(option)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 px-4 border-l border-slate-200/40">
                <button
                  onClick={() => setDesktopView("grid-3")}
                  className={cn(
                    "p-3 transition-all duration-300",
                    desktopView === "grid-3"
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-700"
                  )}
                >
                  <Columns3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDesktopView("grid-4")}
                  className={cn(
                    "p-3 transition-all duration-300",
                    desktopView === "grid-4"
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-700"
                  )}
                >
                  <Columns4 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ürün Grid */}
        <div
          className={
            isMobile
              ? mobileView === "grid-1"
                ? "grid grid-cols-1 gap-2"
                : "grid grid-cols-2 gap-2"
              : desktopView === "grid-3"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1"
          }
        >
          {isLoading
            ? skeletonArray.map((i) => (
                <ProductCardSkeleton key={i} view={currentView} />
              ))
            : filteredProducts.map((product) => (
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
