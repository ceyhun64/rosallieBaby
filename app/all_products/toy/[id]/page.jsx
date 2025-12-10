import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Toy from "@/components/products/productDetail";
import Footer from "@/components/layout/footer";

export default function ToyDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Toy />
      <Footer />
    </div>
  );
}
