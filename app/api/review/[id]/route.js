import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params; // productId

  try {
    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(id) },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not fetch reviews" },
      { status: 500 }
    );
  }
}
