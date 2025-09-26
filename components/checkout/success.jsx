// app/odeme-tamamlandi/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();

  // İsteğe bağlı: sayfa açıldıktan sonra otomatik yönlendirme
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // ana sayfaya yönlendir
    }, 10000); // 10 saniye sonra
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Ödemeniz Başarıyla Tamamlandı!
        </h1>
        <p className="text-gray-700 mb-6">
          Siparişiniz alınmıştır ve işleme konulmuştur. Kargo bilgileri e-posta
          adresinize gönderilecektir.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
}
