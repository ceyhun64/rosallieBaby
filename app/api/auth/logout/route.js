// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession, signOut } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Zaten çıkış yapmışsınız" },
      { status: 200 }
    );
  }

  // NextAuth session logout
  // Eğer client-side signOut kullanırsan buraya gerek kalmaz
  return NextResponse.json({ message: "Çıkış başarılı" }, { status: 200 });
}
