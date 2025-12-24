import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import HospitalOutfitSet from "@/components/products/hospitalOutfitSet/hospitalOutfitSet";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Coming Home Outfits | Rosallie Baby",
  description:
    "Shop our beautiful collection of personalized coming home outfits for newborns. Handcrafted with love, perfect for baby's first journey home.",
  openGraph: {
    title: "Coming Home Outfits | Rosallie Baby",
    description:
      "Premium handcrafted coming home outfits with custom embroidery for your newborn.",
  },
};

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
