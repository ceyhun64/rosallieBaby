import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // custom path, schema generate ettiysen

export async function GET(request, { params }) {
  try {
    const { category } = params;

    const products = await prisma.product.findMany({
      where: { category: category }, // enum değerini kullan
      include: { subImages: true },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "Bu kategoride ürün yok" },
        { status: 404 }
      );
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Kategoriye göre ürünler alınamadı:", error);
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}
