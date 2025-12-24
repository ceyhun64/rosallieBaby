import prisma from "@/lib/db";

export default async function sitemap() {
  const baseUrl = "https://rosalliebaby.com";

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

  const categories = [
    "hospital_outfit_special_set",
    "hospital_outfit_set",
    "toy",
    "blanket",
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/all_products/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const productPages = products.map((product) => ({
    url: `${baseUrl}/all_products/${product.category}/${product.id}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Blog posts (dynamic from database)
  let blogPosts = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPosts];
}
