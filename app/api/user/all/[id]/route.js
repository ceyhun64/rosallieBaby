import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const user = await prisma.user.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
