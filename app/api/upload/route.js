// /api/upload/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary yapılandırması (.env dosyanda olmalı)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folderNameInput = formData.get("folderName");

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı. Lütfen bir dosya yükleyin." },
        { status: 400 }
      );
    }

    const folderName =
      (folderNameInput || "genel")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") || "genel";

    // Dosyayı ArrayBuffer -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Cloudinary upload - TİP TANIMLAMA KALDIRILDI (Promise yerine Promise)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `products/${folderName}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({ path: uploadResult.secure_url });
  } catch (err) {
    console.error("Dosya yükleme hatası:", err);
    return NextResponse.json(
      { error: err.message || "Yükleme başarısız" },
      { status: 500 }
    );
  }
}