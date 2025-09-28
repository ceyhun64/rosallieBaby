import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId, rating, title, comment } = body;

  // rating kontrolü
  if (rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
      },
    });
    return NextResponse.json(review);
  } catch (e) {
    if (e.code === "P2002") {
      // unique constraint violation
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json(
      { error: "Invalid product or other error." },
      { status: 400 }
    );
  }
}
