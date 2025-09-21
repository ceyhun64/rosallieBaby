import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Pillow from "@/components/products/pillow/pillow";
import Footer from "@/components/layout/footer";

export default function PillowPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Pillow />
      <Footer />
    </div>
  );
}
