import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Blanket from "@/components/products/blanket/blanket";
import Footer from "@/components/layout/footer";

export default function BlanketPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Blanket />
      <Footer />
    </div>
  );
}
