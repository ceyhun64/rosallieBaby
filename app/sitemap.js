import prisma from "@/lib/db";

export default async function sitemap() {
  const baseUrl = "https://rosalliebaby.com";

  // Get all products from database
  let products = [];
  try {
    products = await prisma.product.findMany({
      select: {
        id: true,
        category: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Category pages
  const categories = [
    "hospital_outfit_special_set",
    "hospital_outfit_set",
    "toy",
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/all_products/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/all_products/${product.category}/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Blog posts (static for now, can be dynamic from CMS)
  const blogPosts = [
    {
      url: `${baseUrl}/blog/how-to-choose-coming-home-outfit`,
      lastModified: new Date("2025-01-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/why-muslin-best-for-newborns`,
      lastModified: new Date("2025-01-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/personalized-baby-gift-ideas-2025`,
      lastModified: new Date("2025-01-05"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...blogPosts];
}
