"use client";

import Script from "next/script";

export default function GoogleAnalytics({ measurementId }) {
  // Use environment variable if no measurementId provided
  const gaId = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if no ID is configured
  if (!gaId || gaId === "G-XXXXXXXXXX") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                        page_path: window.location.pathname,
                    });
                `}
      </Script>
    </>
  );
}

// E-commerce tracking events
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Helper: Convert cents to dollars
const toDollars = (cents) => {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return parseFloat((n / 100).toFixed(2));
};

// Specific e-commerce events - PRICES NORMALIZED TO DOLLARS
export const trackViewItem = (product) => {
  const priceInDollars = toDollars(product.price);
  trackEvent("view_item", {
    currency: "USD",
    value: priceInDollars,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: priceInDollars,
        quantity: 1,
      },
    ],
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  const priceInDollars = toDollars(product.price);
  trackEvent("add_to_cart", {
    currency: "USD",
    value: priceInDollars * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: priceInDollars,
        quantity: quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (cartItems, totalValueCents) => {
  const totalInDollars = toDollars(totalValueCents);
  trackEvent("begin_checkout", {
    currency: "USD",
    value: totalInDollars,
    items: cartItems.map((item) => ({
      item_id: item.productId,
      item_name: item.product?.name,
      price: toDollars(item.product?.price || 0),
      quantity: item.quantity,
    })),
  });
};

export const trackPurchase = (transactionId, totalValueCents, items) => {
  const totalInDollars = toDollars(totalValueCents);
  trackEvent("purchase", {
    transaction_id: transactionId,
    currency: "USD",
    value: totalInDollars,
    items: items.map((item) => ({
      item_id: item.productId,
      item_name: item.name,
      price: toDollars(item.price || 0),
      quantity: item.quantity,
    })),
  });
};
