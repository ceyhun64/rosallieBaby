// Client-side helper to send events to both Pixel and CAPI
// Use this in checkout/purchase flows for better attribution

import {
  generateEventId,
  trackViewContent,
  trackMetaAddToCart,
  trackInitiateCheckout,
  trackMetaPurchase,
} from "@/components/seo/MetaPixel";

// Helper: Convert cents to dollars (handles string input)
const toDollars = (cents) => {
  const n = typeof cents === "string" ? Number(cents) : cents;
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return parseFloat((n / 100).toFixed(2));
};

// Send event to both Pixel (client) and CAPI (server)
async function sendDualEvent(eventName, eventId, customData, userData = {}) {
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        actionSource: "website",
        eventSourceUrl:
          typeof window !== "undefined" ? window.location.href : undefined,
        customData,
        userData,
      }),
    });
  } catch (error) {
    console.error("CAPI send failed:", error);
  }
}

// ViewContent - Product page view
export const trackProductView = async (product, userData = {}) => {
  const eventId = trackViewContent(product); // Pixel
  await sendDualEvent(
    "ViewContent",
    eventId,
    {
      content_ids: [String(product.id)],
      content_type: "product",
      contents: [
        {
          id: String(product.id),
          quantity: 1,
          item_price: toDollars(product.price),
        },
      ],
      content_name: product.name,
      value: toDollars(product.price),
      currency: "USD",
    },
    userData
  );
};

// AddToCart
export const trackCartAdd = async (product, quantity = 1, userData = {}) => {
  const eventId = trackMetaAddToCart(product, quantity); // Pixel
  await sendDualEvent(
    "AddToCart",
    eventId,
    {
      content_ids: [String(product.id)],
      content_type: "product",
      content_name: product.name,
      contents: [
        {
          id: String(product.id),
          quantity,
          item_price: toDollars(product.price),
        },
      ],
      value: toDollars(product.price) * quantity,
      currency: "USD",
    },
    userData
  );
};

// InitiateCheckout
export const trackCheckoutStart = async (
  cartItems,
  totalValueCents,
  userData = {}
) => {
  const eventId = trackInitiateCheckout(cartItems, totalValueCents); // Pixel
  await sendDualEvent(
    "InitiateCheckout",
    eventId,
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
    userData
  );
};

// Purchase - Most important event!
export const trackPurchaseComplete = async (
  orderId,
  totalValueCents,
  items,
  userData = {}
) => {
  const eventId = trackMetaPurchase(totalValueCents, items); // Pixel
  await sendDualEvent(
    "Purchase",
    eventId,
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
      order_id: orderId,
    },
    userData
  );
};
