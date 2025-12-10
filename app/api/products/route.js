import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Cloudinary'ye resim yükleme fonksiyonu (api/upload kullanarak)
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

  //aynne kardeşim

  const data = await response.json();
  return data.path;
}

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
    const formData = await request.formData();

    // Dosyalar
    const mainImageFile = formData.get("mainImage");
    const subImageFiles = [];

    for (let i = 0; i < 6; i++) {
      const subFile = formData.get(`subImage${i}`);
      if (subFile && subFile instanceof File && subFile.size > 0) {
        subImageFiles.push(subFile);
      }
    }

    // Form alanları
    const name = formData.get("name");
    const description = formData.get("description");
    const oldPrice = parseFloat(formData.get("oldPrice"));
    const price = parseFloat(formData.get("price"));
    const discount = parseFloat(formData.get("discount"));
    const category = formData.get("category");

    // ✔️ CUSTOMNAME EKLENDİ
    const customNameString = formData.get("customName");
    const customName = customNameString === "true" ? true : false;

    // Validasyon
    const validCategories = [
      "hospital_outfit_special_set",
      "hospital_outfit_set",
      "toy",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kategori" },
        { status: 400 }
      );
    }

    if (
      !mainImageFile ||
      !(mainImageFile instanceof File) ||
      mainImageFile.size === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Ana görsel zorunludur" },
        { status: 400 }
      );
    }

    // Ana görseli yükle
    const mainImageUrl = await uploadToCloudinary(mainImageFile, category);

    // Alt görselleri yükle
    const subImageUrls = [];
    for (const subFile of subImageFiles) {
      const url = await uploadToCloudinary(subFile, category);
      subImageUrls.push(url);
    }

    // Ürün oluştur
    const product = await prisma.product.create({
      data: {
        name,
        mainImage: mainImageUrl,
        description,
        oldPrice,
        price,
        discount,
        category,

        // ✔️ CUSTOMNAME BURAYA EKLENDİ
        customName,

        subImages:
          subImageUrls.length > 0
            ? { create: subImageUrls.map((url) => ({ url })) }
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
