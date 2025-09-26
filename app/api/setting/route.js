// app/api/settings/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Ayarlar getirilemedi" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const updated = await prisma.settings.update({
      where: { id: 1 },
      data: body, // hangi alanları gönderirsen onlar güncellenir
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenemedi" },
      { status: 500 }
    );
  }
}
