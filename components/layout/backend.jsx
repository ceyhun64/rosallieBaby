"use client";

import { useRouter } from "next/navigation";

export default function Backend() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        Backendde yapılacak
      </h1>
      <p className="text-gray-600 mb-6">Stay tuned, it's coming soon.</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
      >
        Geri Dön
      </button>
    </div>
  );
}
