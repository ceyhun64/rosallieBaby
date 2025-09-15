import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import AllProducts from "@/components/products/allProducts/allProducts";
import Footer from "@/components/layout/footer";

export default function AllProductsPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <AllProducts />
      <Footer />
    </div>
  );
}
