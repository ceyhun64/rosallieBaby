// app/payment-success/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react"; // lucide-react icon

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // redirect to home page
    }, 10000); // after 10 seconds
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-md">
        {/* Large Lucide icon */}
        <CheckCircle className="text-green-600 w-24 h-24 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Your Payment Was Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your order has been received and is being processed. Shipping details
          will be sent to your email address.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
