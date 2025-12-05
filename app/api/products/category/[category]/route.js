//api/products/category/[category]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, context) {
  try {
    // ✅ DOĞRU: params'ı da await edin
    const params = await context.params;
    const { category } = params;

    const products = await prisma.product.findMany({
      where: { category },
      include: { subImages: true },
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: "Bu kategoride ürün bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Kategoriye göre ürünler alınamadı:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
