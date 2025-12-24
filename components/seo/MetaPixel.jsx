"use client";

import Script from "next/script";

// Generate unique event ID for deduplication with CAPI
export const generateEventId = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

export default function MetaPixel({ pixelId }) {
  // Use environment variable if no pixelId provided
  const fbPixelId = pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;

  // Don't render if no ID is configured
  if (!fbPixelId || fbPixelId === "XXXXXXXXXXXXXXX") {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${fbPixelId}');
                    fbq('track', 'PageView');
                `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper: Convert cents to dollars (handles string input too)
const toDollars = (cents) => {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return parseFloat((n / 100).toFixed(2));
};

// Meta Pixel tracking events WITH eventID for CAPI deduplication
export const trackMetaEvent = (eventName, eventParams = {}, eventId = null) => {
  if (typeof window !== "undefined" && window.fbq) {
    const options = eventId ? { eventID: eventId } : {};
    window.fbq("track", eventName, eventParams, options);
  }
};

// Specific e-commerce events - PRICES NORMALIZED + contents array + content_type
export const trackViewContent = (product, eventId = null) => {
  const finalEventId = eventId || generateEventId();
  const priceInDollars = toDollars(product.price);
  trackMetaEvent(
    "ViewContent",
    {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      contents: [
        { id: String(product.id), quantity: 1, item_price: priceInDollars },
      ],
      value: priceInDollars,
      currency: "USD",
    },
    finalEventId
  );
  return finalEventId;
};

export const trackMetaAddToCart = (product, quantity = 1, eventId = null) => {
  const finalEventId = eventId || generateEventId();
  const priceInDollars = toDollars(product.price);
  trackMetaEvent(
    "AddToCart",
    {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      contents: [
        {
          id: String(product.id),
          quantity: quantity,
          item_price: priceInDollars,
        },
      ],
      value: priceInDollars * quantity,
      currency: "USD",
    },
    finalEventId
  );
  return finalEventId;
};

export const trackInitiateCheckout = (
  cartItems,
  totalValueCents,
  eventId = null
) => {
  const finalEventId = eventId || generateEventId();
  trackMetaEvent(
    "InitiateCheckout",
    {
      content_ids: cartItems.map((item) => String(item.productId)),
      content_type: "product",
      contents: cartItems.map((item) => ({
        id: String(item.productId),
        quantity: item.quantity,
        item_price: toDollars(item.product?.price || 0),
      })),
      num_items: cartItems.length,
      value: toDollars(totalValueCents),
      currency: "USD",
    },
    finalEventId
  );
  return finalEventId;
};

export const trackMetaPurchase = (totalValueCents, items, eventId = null) => {
  const finalEventId = eventId || generateEventId();
  trackMetaEvent(
    "Purchase",
    {
      content_ids: items.map((item) => String(item.productId)),
      content_type: "product",
      contents: items.map((item) => ({
        id: String(item.productId),
        quantity: item.quantity,
        item_price: toDollars(item.price || 0),
      })),
      num_items: items.length,
      value: toDollars(totalValueCents),
      currency: "USD",
    },
    finalEventId
  );
  return finalEventId;
};

export const trackLead = (email, eventId = null) => {
  const finalEventId = eventId || generateEventId();
  trackMetaEvent(
    "Lead",
    {
      content_name: "Newsletter Signup",
      content_category: "Email",
      content_type: "product",
    },
    finalEventId
  );
  return finalEventId;
};
