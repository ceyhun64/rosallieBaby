// app/api/order/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      basketItems,
      shippingAddress,
      billingAddress,
      totalPrice,
      paidPrice,
      currency,
      paymentMethod,
      transactionId,
      firstName,
      lastName,
      email, // kullanıcı email
    } = body;

    if (!userId || !basketItems || basketItems.length === 0) {
      return NextResponse.json(
        { status: "failure", error: "Geçerli kullanıcı veya ürün yok" },
        { status: 400 }
      );
    }

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        status: "paid",
        totalPrice: parseInt(totalPrice),
        paidPrice: parseInt(paidPrice),
        currency: currency || "TRY",
        paymentMethod: paymentMethod || "iyzipay",
        transactionId: transactionId || null,
        items: {
          create: basketItems.map((item) => ({
            productId: parseInt(item.id),
            quantity: parseInt(item.quantity || 1),
            unitPrice: parseInt(item.price),
            totalPrice: parseInt(item.price) * parseInt(item.quantity || 1),
          })),
        },
        addresses: {
          create: [
            {
              type: "shipping",
              firstName: shippingAddress.firstName || firstName,
              lastName: shippingAddress.lastName || lastName,
              address: shippingAddress.address,
              district: shippingAddress.district,
              city: shippingAddress.city,
              zip: shippingAddress.zipCode || shippingAddress.zip,
              phone: shippingAddress.phone,
              country: shippingAddress.country,
            },
            {
              type: "billing",
              firstName: billingAddress.firstName || firstName,
              lastName: billingAddress.lastName || lastName,
              address: billingAddress.address,
              district: billingAddress.district,
              city: billingAddress.city,
              zip: billingAddress.zipCode || billingAddress.zip,
              phone: billingAddress.phone,
              country: billingAddress.country,
            },
          ],
        },
      },
      include: {
        items: true,
        addresses: true,
      },
    });

    // Mail gönder (hazır send-mail API'sini kullan)
    // Mail gönder (hazır send-mail API'sini kullan)
    const sendMail = async (recipients, subject, message) => {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject, message }),
      });
    };

    // Kullanıcı maili
    if (email) {
      const userMessage = `
Hello ${firstName || ""},

Thank you for your order! Here are your order details:

Order ID: ${order.id}
Status: ${order.status}
Payment Method: ${order.paymentMethod || "—"}
Transaction ID: ${transactionId || "—"}
Total Paid: ${order.paidPrice} ${order.currency}

Shipping Address:
${shippingAddress.firstName || firstName} ${
        shippingAddress.lastName || lastName
      }
${shippingAddress.address}, ${shippingAddress.district}, ${
        shippingAddress.city
      } ${shippingAddress.zipCode || shippingAddress.zip}
${shippingAddress.country}
Phone: ${shippingAddress.phone}

Billing Address:
${billingAddress.firstName || firstName} ${billingAddress.lastName || lastName}
${billingAddress.address}, ${billingAddress.district}, ${billingAddress.city} ${
        billingAddress.zipCode || billingAddress.zip
      }
${billingAddress.country}
Phone: ${billingAddress.phone}

Order Items:
${basketItems
  .map(
    (item) =>
      `- ${item.name} x ${item.quantity || 1}: ${
        item.price * (item.quantity || 1)
      } ${currency || "TRY"}`
  )
  .join("\n")}

We will notify you when your order is shipped.

Thank you for shopping with us!
`;

      await sendMail([email], `Order Confirmation - ${order.id}`, userMessage);
    }

    // Admin maili
    const adminMessage = `
New order placed:

Order ID: ${order.id}
User: ${firstName || ""} ${lastName || ""} (ID: ${userId})
Email: ${email || "—"}
Status: ${order.status}
Payment Method: ${paymentMethod || "—"}
Transaction ID: ${transactionId || "—"}
Total Paid: ${paidPrice} ${currency || "TRY"}

Shipping Address:
${shippingAddress.firstName || firstName} ${
      shippingAddress.lastName || lastName
    }
${shippingAddress.address}, ${shippingAddress.district}, ${
      shippingAddress.city
    } ${shippingAddress.zipCode || shippingAddress.zip}
${shippingAddress.country}
Phone: ${shippingAddress.phone}

Billing Address:
${billingAddress.firstName || firstName} ${billingAddress.lastName || lastName}
${billingAddress.address}, ${billingAddress.district}, ${billingAddress.city} ${
      billingAddress.zipCode || billingAddress.zip
    }
${billingAddress.country}
Phone: ${billingAddress.phone}

Order Items:
${basketItems
  .map(
    (item) =>
      `- Product ID: ${item.id}, Name: ${item.name}, Qty: ${
        item.quantity || 1
      }, Unit Price: ${item.price}, Total: ${item.price * (item.quantity || 1)}`
  )
  .join("\n")}
`;

    await sendMail(
      ["ceyhunturkmen4@gmail.com"],
      `New Order Placed - ${order.id}`,
      adminMessage
    );

    return NextResponse.json({ status: "success", order });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Tüm siparişleri getirme
export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true, // Ürün detaylarını almak için
          },
        },
        addresses: true,
        user: true, // Kullanıcı bilgilerini de almak istersen
      },
      orderBy: { createdAt: "desc" }, // Yeni siparişler önde
    });

    return NextResponse.json({ status: "success", orders });
  } catch (error) {
    console.error("Order GET Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Sipariş durumunu güncelleme
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { status: "failure", error: "orderId ve status gerekli" },
        { status: 400 }
      );
    }

    // Geçerli status değerlerini kontrol et (prisma enum'una göre)
    const validStatuses = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { status: "failure", error: "Geçersiz sipariş durumu" },
        { status: 400 }
      );
    }

    // Siparişi güncelle
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        items: { include: { product: true } },
        addresses: true,
        user: true,
      },
    });

    // Mail gönderimi için helper
    const sendMail = async (recipients, subject, message) => {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject, message }),
      });
    };

    // Kullanıcıya bilgilendirme maili
    if (updatedOrder.user?.email) {
      const userMessage = `
Hello ${updatedOrder.user.name || ""},

Your order (ID: ${
        updatedOrder.id
      }) status has been updated to: ${updatedOrder.status.toUpperCase()}.

Order Items:
${updatedOrder.items
  .map(
    (item) =>
      `- ${item.product.name} x ${item.quantity}: ${item.totalPrice} ${updatedOrder.currency}`
  )
  .join("\n")}

Shipping Address:
${updatedOrder.addresses
  .filter((a) => a.type === "shipping")
  .map((a) => `${a.firstName} ${a.lastName}, ${a.address}, ${a.city}, ${a.zip}`)
  .join("\n")}

Billing Address:
${updatedOrder.addresses
  .filter((a) => a.type === "billing")
  .map((a) => `${a.firstName} ${a.lastName}, ${a.address}, ${a.city}, ${a.zip}`)
  .join("\n")}

Thank you for shopping with us!
`;
      await sendMail(
        [updatedOrder.user.email],
        `Order Update - ${updatedOrder.id}`,
        userMessage
      );
    }

    // Admin bilgilendirme maili
    const adminMessage = `
Order ID: ${
      updatedOrder.id
    } status has been updated to ${updatedOrder.status.toUpperCase()}.
User: ${updatedOrder.user?.name || ""} (ID: ${updatedOrder.userId})
Email: ${updatedOrder.user?.email || "—"}

Order Items:
${updatedOrder.items
  .map(
    (item) =>
      `- Product ID: ${item.productId}, Name: ${item.product.name}, Qty: ${item.quantity}, Total: ${item.totalPrice} ${updatedOrder.currency}`
  )
  .join("\n")}
`;

    await sendMail(
      ["ceyhunturkmen4@gmail.com"],
      `Order Status Update - ${updatedOrder.id}`,
      adminMessage
    );

    return NextResponse.json({ status: "success", order: updatedOrder });
  } catch (error) {
    console.error("Order PATCH Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}
