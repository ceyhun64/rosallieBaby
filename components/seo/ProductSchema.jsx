"use client";

import React from "react";

export default function ProductSchema({ product, reviews = [] }) {
  if (!product) return null;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.mainImage
      ? product.mainImage.startsWith("http")
        ? product.mainImage
        : `https://rosalliebaby.com${product.mainImage}`
      : undefined,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Rosallie Baby",
    },
    offers: {
      "@type": "Offer",
      url: `https://rosalliebaby.com/all_products/${product.category}/${product.id}`,
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2), // Assuming price is in cents
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Rosallie Baby",
      },
    },
  };

  // Add aggregateRating if reviews exist
  if (reviews.length > 0 && averageRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount: reviews.length,
      bestRating: "5",
      worstRating: "1",
    };
  }

  // Add individual reviews (up to 5)
  if (reviews.length > 0) {
    schema.review = reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.user?.name || "Customer",
      },
      datePublished: review.createdAt
        ? new Date(review.createdAt).toISOString().split("T")[0]
        : undefined,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: review.comment,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Category/Collection schema for category pages
export function CategorySchema({ categoryName, products = [] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryName,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://rosalliebaby.com/all_products/${product.category}/${product.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
