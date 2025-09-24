// app/api/address/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // tek prisma instance
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET: Kullanıcının adreslerini getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// POST: Yeni adres ekleme
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    console.log("POST body:", body);

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

    if (!firstName || !lastName || !address || !district || !city || !country) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: Number(session.user.id),
        title: title || "Home",
        firstName,
        lastName,
        address,
        district,
        city,
        zip: zip || "",
        phone: phone || "",
        country,
      },
    });

    console.log("Yeni adres eklendi:", newAddress);

    return NextResponse.json({ address: newAddress }, { status: 201 });
  } catch (error) {
    console.error("Failed to create address:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
