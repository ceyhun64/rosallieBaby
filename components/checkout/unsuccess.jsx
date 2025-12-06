"use client";
import {
  XCircle,
  AlertCircle,
  CreditCard,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailedPage() {
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

  const commonReasons = [
    {
      icon: CreditCard,
      title: "Card Information",
      description: "Card number, expiration date, or CVV code may be incorrect",
    },
    {
      icon: AlertCircle,
      title: "Insufficient Balance",
      description: "Your card may have insufficient balance",
    },
    {
      icon: XCircle,
      title: "Bank Rejection",
      description:
        "Transaction may have been rejected by your bank for security reasons",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="inline-block p-4 bg-white rounded-full mb-4 animate-pulse">
                <XCircle className="w-16 h-16 text-red-600" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Payment Failed
              </h1>
              <p className="text-red-50 text-lg">
                Transaction could not be completed
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Transaction Error
                  </p>
                  <p className="text-sm text-red-800">
                    Your payment could not be completed. Please check your
                    information and try again. If the problem persists, contact
                    your bank or our customer service.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Possible Reasons
              </h2>
              <div className="space-y-3">
                {commonReasons.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                        <Icon className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {reason.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Solutions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What Should I Do?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700 pt-0.5">
                    <span className="font-semibold">
                      Check your card information:
                    </span>{" "}
                    Make sure you entered the card number, expiration date, and
                    CVV code correctly.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700 pt-0.5">
                    <span className="font-semibold">Try a different card:</span>{" "}
                    You can try again with another credit or debit card.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700 pt-0.5">
                    <span className="font-semibold">Contact your bank:</span>{" "}
                    The transaction may have been blocked by your bank. Check 3D
                    Secure verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => (window.location.href = "/checkout")}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
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
