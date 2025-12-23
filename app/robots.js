export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/account/",
          "/checkout/",
          "/cart/",
          "/profile/",
        ],
      },
    ],
    sitemap: "https://rosalliebaby.com/sitemap.xml",
  };
}
