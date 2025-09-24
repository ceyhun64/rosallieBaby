import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // prisma client yolu
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  // Burada session veya auth ile kullanıcıyı bul
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true }, // ürün detaylarını da al
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
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId, quantity, strollerCover, customName, hatToyOption } = body;

  try {
    // Eğer aynı kullanıcı + aynı ürün + aynı opsiyonlar varsa, quantity artır
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_strollerCover_customName_hatToyOption: {
          userId: session.user.id,
          productId,
          strollerCover: strollerCover ?? null,
          customName: customName ?? null,
          hatToyOption: hatToyOption ?? null,
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
        userId: session.user.id,
        productId,
        quantity: quantity || 1,
        strollerCover,
        customName,
        hatToyOption,
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
