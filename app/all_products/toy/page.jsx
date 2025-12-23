import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Toy from "@/components/products/toy/toy";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "Baby Toys | Rosallie Baby",
  description:
    "Discover our collection of premium baby toys. Safe, soft, and perfect for newborns. Handcrafted with love for your little one.",
  openGraph: {
    title: "Baby Toys | Rosallie Baby",
    description:
      "Premium handcrafted baby toys, safe and soft for your newborn.",
  },
};

export default function ToyPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Toy />
      <Footer />
    </div>
  );
}
