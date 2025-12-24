//api/cart/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(session.user.id) }, // ✅ Number'a çevir
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 });

  const body = await req.json();
  const { productId, quantity, customName } = body;

  try {
    const fixedName = customName?.trim() || "";
    const userId = Number(session.user.id); // ✅ Number'a çevir

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_customName: {
          userId, // ✅ Number olarak kullan
          productId,
          customName: fixedName,
        },
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) },
      });
      return NextResponse.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId, // ✅ Number olarak kullan
        productId,
        quantity: quantity || 1,
        customName,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: Number(session.user.id) }, // ✅ Number'a çevir
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete cart items" },
      { status: 500 }
    );
  }
}
