import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Romper from "@/components/products/romper/romper";
import Footer from "@/components/layout/footer";

export default function RomperPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Romper />
      <Footer />
    </div>
  );
}
