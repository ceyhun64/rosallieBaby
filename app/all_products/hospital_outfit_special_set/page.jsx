import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import HospitalOutfitSpecialSet from "@/components/products/hospitalOutfitSpecialSet/hospitalOutfitSpecialSet";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Personalized Hospital Sets | Rosallie Baby",
  description:
    "Shop our premium personalized hospital sets for newborns. Complete set with romper, blanket, pillow, and more. Handcrafted with organic muslin.",
  openGraph: {
    title: "Personalized Hospital Sets | Rosallie Baby",
    description:
      "Premium handcrafted newborn hospital sets with custom embroidery.",
  },
};

export default function HospitalOutfitSpecialSetDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <HospitalOutfitSpecialSet />
      <Footer />
    </div>
  );
}
