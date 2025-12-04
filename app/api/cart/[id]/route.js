import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// -------------------- DELETE --------------------
export async function DELETE(req, context) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ✅ params async olduğu için await gerekiyor
  const { id } = await context.params;
  const cartItemId = Number(id);

  console.log("DELETE /cart/[id] cartItemId:", cartItemId);

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /cart/[id] error:", error);

    // Prisma: kayıt yoksa → P2025
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}

// -------------------- PATCH --------------------
export async function PATCH(req, context) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ✅ params async zorunlu
  const { id } = await context.params;
  const cartItemId = Number(id);

  const { quantity } = await req.json();

  if (!quantity || quantity < 1) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  try {
    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /cart/[id] error:", error);

    // Prisma: kayıt bulunamazsa
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}
