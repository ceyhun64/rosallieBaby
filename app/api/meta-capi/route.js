// Meta Conversions API (CAPI) Endpoint
// This endpoint sends server-side events to Meta for better attribution accuracy

import { NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID =
  process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = "v18.0";

// Hash function for user data (Meta requires SHA-256)
function hashData(data) {
  if (!data) return null;
  return crypto
    .createHash("sha256")
    .update(data.toLowerCase().trim())
    .digest("hex");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      eventName,
      eventId,
      eventTime,
      userData,
      customData,
      eventSourceUrl,
      actionSource = "website",
    } = body;

    // Validate required fields
    if (!eventName || !eventId) {
      return NextResponse.json(
        { error: "eventName and eventId are required" },
        { status: 400 }
      );
    }

    // Check if CAPI credentials are configured
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.warn("Meta CAPI not configured - skipping server event");
      return NextResponse.json({
        success: true,
        message: "CAPI not configured",
      });
    }

    // Build user data with hashing
    const hashedUserData = {};

    if (userData?.email) {
      hashedUserData.em = [hashData(userData.email)];
    }
    if (userData?.phone) {
      hashedUserData.ph = [hashData(userData.phone)];
    }
    if (userData?.firstName) {
      hashedUserData.fn = [hashData(userData.firstName)];
    }
    if (userData?.lastName) {
      hashedUserData.ln = [hashData(userData.lastName)];
    }
    if (userData?.city) {
      hashedUserData.ct = [hashData(userData.city)];
    }
    if (userData?.state) {
      hashedUserData.st = [hashData(userData.state)];
    }
    if (userData?.zipCode) {
      hashedUserData.zp = [hashData(userData.zipCode)];
    }
    if (userData?.country) {
      hashedUserData.country = [hashData(userData.country)];
    }

    // Client IP and User Agent from request
    const clientIpAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const clientUserAgent = request.headers.get("user-agent") || "";

    hashedUserData.client_ip_address = clientIpAddress;
    hashedUserData.client_user_agent = clientUserAgent;

    // Build event payload
    const testEventCode = process.env.META_TEST_EVENT_CODE;
    const eventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime || Math.floor(Date.now() / 1000),
          event_id: eventId, // Same as Pixel eventID for deduplication
          action_source: actionSource,
          event_source_url:
            eventSourceUrl || request.headers.get("referer") || undefined,
          user_data: hashedUserData,
          custom_data: customData || {},
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    // Send to Meta CAPI
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI Error:", result);
      return NextResponse.json(
        { error: "Failed to send event to Meta", details: result },
        { status: 500 }
      );
    }

    console.log(`CAPI Event sent: ${eventName} (ID: ${eventId})`);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("CAPI Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    configured: !!(PIXEL_ID && ACCESS_TOKEN),
    message:
      PIXEL_ID && ACCESS_TOKEN
        ? "Meta CAPI is configured"
        : "Missing PIXEL_ID or ACCESS_TOKEN in environment variables",
  });
}
