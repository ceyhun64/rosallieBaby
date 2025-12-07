"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/account/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white  px-4">
      <div className=" rounded-2xl p-12 max-w-md w-full text-center flex flex-col items-center">
        {/* Tatlı bir resim */}
        <img
          src="/unauthorized/unauthorized.webp" // public/illustrations klasörüne ekle
          alt="Access Denied Illustration"
          className="w-64 h-64 mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please login to
          continue.
        </p>
        <Button
          onClick={handleLoginRedirect}
          className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded-lg"
        >
          Login
        </Button>
      </div>
    </div>
  );
}
