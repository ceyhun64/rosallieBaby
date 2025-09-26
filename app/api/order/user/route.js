// app/api/order/user/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET: Belirli kullanıcının siparişlerini getirme
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { product: true } },
        addresses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "success", orders });
  } catch (error) {
    console.error("User Orders GET Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Sipariş durumunu güncelleme
export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { orderId } = body;

    if (!orderId)
      return NextResponse.json(
        { status: "failure", error: "orderId gerekli" },
        { status: 400 }
      );

    // Kullanıcının kendi siparişi mi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        items: { include: { product: true } },
        addresses: true,
        user: true, // kullanıcının emailini almak için
      },
    });

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json(
        { status: "failure", error: "Sipariş bulunamadı veya erişim yok" },
        { status: 403 }
      );
    }

    // Eğer sipariş durumu delivered/shipped/cancelled ise iptal edilemez
    if (["delivered", "shipped", "cancelled"].includes(order.status)) {
      return NextResponse.json(
        { status: "failure", error: "Bu sipariş artık iptal edilemez." },
        { status: 400 }
      );
    }

    // Sadece cancelled olarak güncelle
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: "cancelled" },
      include: {
        items: { include: { product: true } },
        addresses: true,
        user: true,
      },
    });

    // Mail gönderme fonksiyonu
    const sendMail = async (recipients, subject, message) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipients, subject, message }),
        });
      } catch (err) {
        console.error("Mail gönderilemedi:", err);
      }
    };

    // Kullanıcıya mail
    const userMessage = `Hello ${
      order.user.name || order.user.email
    },\n\nYour order ${
      order.id
    } has been successfully cancelled.\n\nThank you.`;
    await sendMail(
      [order.user.email],
      `Order ${order.id} Cancelled`,
      userMessage
    );

    // Admin'e mail
    const adminMessage = `User ${order.user.email} has cancelled order ${order.id}.`;
    await sendMail(
      ["ceyhunturkmen4@gmail.com"],
      `Order ${order.id} Cancelled by User`,
      adminMessage
    );

    return NextResponse.json({ status: "success", order: updatedOrder });
  } catch (error) {
    console.error("User Orders PATCH Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}
