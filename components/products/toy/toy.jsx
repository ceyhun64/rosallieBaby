"use client";

import ProductToolbar from "./productToolBar";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/layout/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/category/toy`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      // 404 → ürün yok
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default function Toy() {
  const [products, setProducts] = useState([]);
  const isMobile = useIsMobile();

  // client-side fetch (SSR’de 404 sonucu crash olmaz)
  useEffect(() => {
    getProducts().then((data) => setProducts(data));
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Başlık */}
      <div className="flex items-center gap-2 mb-4">
        <Label className={`text-3xl font-semibold`}>Toy</Label>
        <span className="text-gray-600 text-lg">
          ({products.length} products)
        </span>
      </div>

      {/* Ürün listesi */}
      <ProductToolbar products={products} />
    </div>
  );
}
