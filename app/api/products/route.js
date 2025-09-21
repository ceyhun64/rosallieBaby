import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { subImages: true },
    });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Prisma fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request) {
  try {
    const data = await request.json();
    const validCategories = ["hospital_outfit_set", "toy", "pillow"];
    if (!validCategories.includes(data.category)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kategori" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        mainImage: data.mainImage,
        description: data.description,
        oldPrice: data.oldPrice,
        price: data.price,
        discount: data.discount,
        category: data.category,
        subImages: data.subImages
          ? { create: data.subImages.map((url) => ({ url })) }
          : undefined,
      },
      include: { subImages: true },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Ürün oluştururken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
