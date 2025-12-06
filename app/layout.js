import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL("https://rosalliebaby.com"), // Site URL'inizi buraya ekleyin
  title: {
    default:
      "Rosallie Baby | Premium Baby Hospital Outfits & Toys | Newborn Coming Home Sets",
    template: "%s | Rosallie Baby",
  },
  description:
    "Shop adorable baby hospital discharge outfits, newborn coming home sets, and premium baby toys. Perfect for your little one's first day home. Free shipping on orders over $50. ✓ Organic materials ✓ Safe for newborns ✓ Fast delivery",
  keywords: [
    "baby hospital outfits",
    "newborn coming home outfit",
    "baby discharge outfit",
    "hospital going home outfit",
    "newborn hospital set",
    "baby toys",
    "organic baby clothes",
    "premium baby gifts",
    "newborn essentials",
    "baby shower gifts",
    "cute baby outfits",
    "infant clothing",
    "baby boy coming home outfit",
    "baby girl coming home outfit",
  ],
  authors: [{ name: "Rosallie Baby" }],
  creator: "Rosallie Baby",
  publisher: "Rosallie Baby",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rosalliebaby.com",
    siteName: "Rosallie Baby",
    title: "Rosallie Baby | Premium Baby Hospital Outfits & Toys",
    description:
      "Adorable baby hospital discharge outfits and premium toys for your newborn's special day. Organic, safe, and stylish.",
    images: [
      {
        url: "/og-image.jpg", // 1200x630 boyutunda bir görsel ekleyin
        width: 1200,
        height: 630,
        alt: "Rosallie Baby - Premium Baby Outfits and Toys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosallie Baby | Premium Baby Hospital Outfits & Toys",
    description:
      "Adorable baby hospital discharge outfits and premium toys for your newborn's special day.",
    images: ["/og-image.jpg"],
    creator: "@rosalliebaby", // Twitter hesabınızı ekleyin
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Google Search Console'dan alın
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://rosalliebaby.com",
  },
  category: "Baby & Kids",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Rosallie Baby",
              url: "https://rosalliebaby.com",
              description: "Premium baby hospital outfits and toys",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://rosalliebaby.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Rosallie Baby",
              url: "https://rosalliebaby.com",
              logo: "https://rosalliebaby.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "support@rosalliebaby.com",
              },
              sameAs: [
                "https://www.facebook.com/rosalliebaby",
                "https://www.instagram.com/rosalliebaby",
                "https://www.pinterest.com/rosalliebaby",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            style: { zIndex: 9999 },
          }}
        />
      </body>
    </html>
  );
}
