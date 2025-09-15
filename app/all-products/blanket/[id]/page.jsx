import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Blanket from "@/components/products/blanket/productDetail";
import Footer from "@/components/layout/footer";

export default function BlanketDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Blanket />
      <Footer />
    </div>
  );
}
