import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Cloudinary'ye resim yükleme fonksiyonu
async function uploadToCloudinary(file, folderName = "products") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderName", folderName);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Resim yüklenemedi");
  }

  const data = await response.json();
  return data.path;
}

// GET /api/products/[id] - TEK ÜRÜN GETİR
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        subImages: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // URL'leri kontrol et
    const productWithFixedUrls = {
      ...product,
      mainImage: product.mainImage || "/placeholder.png",
      subImages: product.subImages.map((img) => ({
        ...img,
        url: img.url || "/placeholder.png",
      })),
    };

    return NextResponse.json(
      {
        success: true,
        product: productWithFixedUrls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ürün getirirken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - ÜRÜN SİL
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Önce ürünün var olup olmadığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { subImages: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Cascade delete ile subImages otomatik silinir (Prisma schema'da onDelete: Cascade varsa)
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    console.log(`Ürün silindi: ${id}`);

    return NextResponse.json(
      { success: true, message: "Ürün başarıyla silindi" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ürün silerken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - ÜRÜN GÜNCELLE
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();

    // Önce ürünün var olup olmadığını kontrol et
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { subImages: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    // Form alanlarını al
    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const category = formData.get("category")?.trim();
    const price = parseFloat(formData.get("price")) || 0;
    const oldPrice = parseFloat(formData.get("oldPrice")) || 0;
    const discount = parseFloat(formData.get("discount")) || 0;
    const customName = formData.get("customName") === "true";

    // Ana görsel kontrolü
    let mainImageUrl;
    const mainImageFile = formData.get("mainImage");

    if (
      mainImageFile &&
      mainImageFile instanceof File &&
      mainImageFile.size > 0
    ) {
      // Yeni dosya yüklendi
      console.log("Yeni ana görsel yükleniyor...");
      mainImageUrl = await uploadToCloudinary(mainImageFile, category);
      console.log("Yeni ana görsel yüklendi:", mainImageUrl);
    } else {
      // Mevcut URL'yi kullan
      mainImageUrl = formData.get("mainImageUrl") || existingProduct.mainImage;
    }

    // Alt görselleri topla
    const subImageUrls = [];

    // Yeni yüklenen dosyalar
    for (let i = 0; i < 6; i++) {
      const subFile = formData.get(`subImage${i}`);
      if (subFile && subFile instanceof File && subFile.size > 0) {
        console.log(`Yeni alt görsel ${i + 1} yükleniyor...`);
        const url = await uploadToCloudinary(subFile, category);
        console.log(`Yeni alt görsel ${i + 1} yüklendi:`, url);
        subImageUrls.push(url);
      }
    }

    // Mevcut URL'leri ekle (değişmeyen görseller)
    const existingSubImagesStr = formData.get("existingSubImages");
    if (existingSubImagesStr) {
      try {
        const existing = JSON.parse(existingSubImagesStr);
        if (Array.isArray(existing)) {
          subImageUrls.push(...existing.filter((url) => url)); // Boş URL'leri filtrele
        }
      } catch (e) {
        console.error("existingSubImages parse hatası:", e);
      }
    }

    // Önce mevcut subImages'ları sil
    await prisma.subImage.deleteMany({
      where: { productId: parseInt(id) },
    });

    // Ürünü güncelle
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        mainImage: mainImageUrl,
        description,
        oldPrice,
        price,
        customName,
        discount,
        category,
        subImages:
          subImageUrls.length > 0
            ? { create: subImageUrls.map((url) => ({ url })) }
            : undefined,
      },
      include: { subImages: true },
    });

    console.log("Ürün başarıyla güncellendi:", updatedProduct.id);

    return NextResponse.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ürün güncellerken hata:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
