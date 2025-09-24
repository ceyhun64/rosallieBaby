import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// PATCH: Adresi güncelle
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    const body = await request.json();
    const {
      title,
      firstName,
      lastName,
      address,
      district,
      city,
      zip,
      phone,
      country,
    } = body;

    const existingAddress = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedAddress = await prisma.address.update({
      where: { id: parseInt(id) },
      data: {
        title,
        firstName,
        lastName,
        address,
        district,
        city,
        zip,
        phone,
        country,
      },
    });

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE: Adresi sil
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    const existingAddress = await prisma.address.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
