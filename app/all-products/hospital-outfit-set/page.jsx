import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import HospitalOutfitSet from "@/components/products/hospitalOutfitSet/hospitalOutfitSet";
import Footer from "@/components/layout/footer";

export default function HospitalOutfitSetDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <HospitalOutfitSet />
      <Footer />
    </div>
  );
}
