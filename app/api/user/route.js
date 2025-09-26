// app/api/account/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // tek prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// PATCH: Kullanıcı bilgilerini güncelle
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "firstName and lastName are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: firstName,
        surname: lastName,
        phone: phone || null, // opsiyonel
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user information" },
      { status: 500 }
    );
  }
}

// GET: Kullanıcı bilgilerini geri döndür
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: true, // tüm adres alanlarını getirir
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
