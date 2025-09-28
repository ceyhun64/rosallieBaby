// app/payment-failed/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react"; // lucide-react icon

export default function Failed() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // redirect to home page
    }, 10000); // after 10 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        {/* Large Lucide icon */}
        <XCircle className="text-red-600 w-24 h-24 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="text-gray-700 mb-6">
          Unfortunately, your payment could not be processed. Please try again
          or contact customer support if the problem persists.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
