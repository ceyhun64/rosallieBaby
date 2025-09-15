// components/Categories.jsx
import React from "react";
import CategoryCard from "./categoryCard";

// Örnek kategori verileri
const categories = [
  {
    title: "Blankets",
    imageUrl: "/categories/category1.webp",
    href: "/blankets",
  },
  {
    title: "Rompers",
    imageUrl: "/categories/category2.webp",
    href: "/rompers",
  },
  {
    title: "Pillows",
    imageUrl: "/categories/category3.webp",
    href: "/pillows",
  },
];

export default function Categories() {
  return (
    <section className="container mx-auto py-12 px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            imageUrl={category.imageUrl}
            href={category.href}
          />
        ))}
      </div>
    </section>
  );
}
