"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";


export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
    }
  }, [countdown, router]);

  const nextSteps = [
    {
      icon: Mail,
      title: "Email Confirmation",
      description: "Order details have been sent to your email address",
      status: "completed",
    },
    {
      icon: Package,
      title: "Order Processing",
      description: "Your products are being packaged",
      status: "in-progress",
    },
    {
      icon: Truck,
      title: "Shipping Soon",
      description: "Tracking number will be sent via email",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="inline-block p-4 bg-white rounded-full mb-4 animate-bounce">
                <CheckCircle
                  className="w-16 h-16 text-green-600"
                  strokeWidth={2.5}
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-green-50 text-lg">
                Your order has been received
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600 leading-relaxed">
                Your order has been successfully received and is being processed. Order details
                and tracking information will be sent to your email address.
              </p>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>Next Steps</span>
              </h2>
              <div className="space-y-4">
                {nextSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        step.status === "completed"
                          ? "bg-green-50 border border-green-200"
                          : step.status === "in-progress"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "in-progress"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                      {step.status === "completed" && (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      {step.status === "in-progress" && (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Important Information
                  </p>
                  <p className="text-sm text-blue-800">
                    You can track your order status from the "My Orders" page. If you experience
                    any issues, please contact our customer service.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (window.location.href = "/profile/orders")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/30"
              >
                <Package className="w-5 h-5" />
                View My Orders
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </button>
            </div>

            {/* Auto Redirect */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {countdown > 0 ? (
                  <>
                    Redirecting to homepage...{" "}
                    <span className="font-semibold text-gray-700">
                      {countdown}s
                    </span>
                  </>
                ) : (
                  "Redirecting..."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}