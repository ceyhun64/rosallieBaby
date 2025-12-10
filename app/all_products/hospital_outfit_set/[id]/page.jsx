import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import ProductDetail from "@/components/products/productDetail";
import Footer from "@/components/layout/footer";

export default function ProductDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <ProductDetail />
      <Footer />
    </div>
  );
}
