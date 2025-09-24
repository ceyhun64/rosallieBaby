import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Favori sil
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const productId = Number(params.id);

  if (!productId) {
    return NextResponse.json(
      { error: "ProductId is required" },
      { status: 400 }
    );
  }

  const deleted = await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      productId,
    },
  });

  return NextResponse.json({ deletedCount: deleted.count });
}
