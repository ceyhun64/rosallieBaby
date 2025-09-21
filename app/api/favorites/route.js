import { NextResponse } from "next/server";
import { prisma } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Tüm favorileri getir
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  return NextResponse.json(favorites);
}

// Yeni favori ekle
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();

  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });
    return NextResponse.json(favorite);
  } catch (e) {
    return NextResponse.json(
      { error: "Already exists or invalid product" },
      { status: 400 }
    );
  }
}
