import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(params.id) },
      include: { subImages: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Ürünleri getirirken hata:", error);
    return NextResponse.json({ error: "Ürünler alınamadı" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const product = await prisma.product.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    console.error(error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name: data.name,
        mainImage: data.mainImage,
        description: data.description,
        oldPrice: Number(data.oldPrice) || 0,
        price: Number(data.price) || 0,
        discount: Number(data.discount) || 0,
        category: data.category, // Prisma Category enum olmalı
        subImages: data.subImages
          ? {
              deleteMany: {}, // önce mevcutları sil
              create: data.subImages.map((url) => ({ url })),
            }
          : undefined,
      },
      include: { subImages: true },
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}
