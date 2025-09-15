import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Pillow from "@/components/products/pillow/productDetail";
import Footer from "@/components/layout/footer";

export default function PillowDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Pillow />
      <Footer />
    </div>
  );
}
