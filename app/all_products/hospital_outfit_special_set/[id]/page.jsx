import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import ProductDetail from "@/components/products/productDetail";
import Footer from "@/components/layout/footer";
import prisma from "@/lib/db";

// Dinamik metadata - Her ürün için unique title ve description
export async function generateMetadata({ params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) },
      select: { name: true, description: true, mainImage: true, price: true },
    });

    if (!product) {
      return {
        title: "Product Not Found | Rosallie Baby",
        description: "The requested product could not be found.",
      };
    }

    const title = `${product.name} | Rosallie Baby`;
    const description = product.description
      ? product.description.slice(0, 160).trim() + (product.description.length > 160 ? "..." : "")
      : "Premium personalized hospital special set for newborns. Handcrafted with organic muslin.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: product.mainImage ? [{ url: product.mainImage, width: 800, height: 800, alt: product.name }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.mainImage ? [product.mainImage] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Personalized Hospital Special Sets | Rosallie Baby",
      description: "Shop our premium personalized hospital special sets for newborns.",
    };
  }
}

export default function ProductDetailPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <ProductDetail />
      <Footer />
    </div>
  );
}
