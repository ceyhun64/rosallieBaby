"use client";
import React, { useState } from "react";

export default function ContactForm() {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const ad = formData.get("ad");
    const soyad = formData.get("soyad");
    const email = formData.get("email");
    const telefon = formData.get("telefon");
    const mesaj = formData.get("mesaj");

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: ["rosalliebabyofficial@gmail.com"], // mailin gideceği adres
          subject: `Yeni İletişim Formu - ${ad} ${soyad}`,
          message: `
Ad Soyad: ${ad} ${soyad}
E-posta: ${email}
Telefon: ${telefon}

Mesaj:
${mesaj}
          `,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        e.target.reset();
        setAgreed(false);
      } else {
        setStatus(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const buttonColor = "bg-stone-900 hover:bg-stone-800";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="text-center mb-8 mt-12 max-w-xl">
        <h1 className="text-3xl font-light text-gray-800 mb-2">Contact Us</h1>
        <p className="text-gray-600 leading-relaxed text-sm">
          If you would like to share your opinion, suggestion, or complaint, you
          can fill out the <span className="italic">"Contact Form"</span>. We
          will review it and get back to you as soon as possible.
        </p>
      </header>

      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="ad"
                className="block text-sm font-normal text-gray-700 mb-1"
              >
                <span className="text-red-500 mr-1">*</span>First Name
              </label>
              <input
                type="text"
                id="ad"
                name="ad"
                className="w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none pb-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="soyad"
                className="block text-sm font-normal text-gray-700 mb-1"
              >
                <span className="text-red-500 mr-1">*</span>Last Name
              </label>
              <input
                type="text"
                id="soyad"
                name="soyad"
                className="w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none pb-1"
                required
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal text-gray-700 mb-1"
              >
                <span className="text-red-500 mr-1">*</span>Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none pb-1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="telefon"
                className="block text-sm font-normal text-gray-700 mb-1"
              >
                <span className="text-red-500 mr-1">*</span>Phone
              </label>
              <div className="flex border-b border-gray-300 focus-within:border-gray-500">
                <div className="flex items-center text-sm text-gray-600 pr-2">
                  <span className="mr-1">🇹🇷</span>
                  <span>+90</span>
                </div>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  className="flex-grow focus:outline-none pb-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="mesaj"
              className="block text-sm font-normal text-gray-700 mb-1"
            >
              <span className="text-red-500 mr-1">*</span>Message
            </label>
            <textarea
              id="mesaj"
              name="mesaj"
              rows={5}
              className="w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none resize-y pb-1"
              required
            ></textarea>
          </div>

          {/* Consent */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="kvkk-onay"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-stone-600 border-gray-300 rounded focus:ring-stone-500 mr-2"
            />
            <label
              htmlFor="kvkk-onay"
              className="text-sm text-gray-700 select-none"
            >
              I have read and accept the Personal Data Protection Law Terms
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!agreed || loading}
            className={`w-full text-white font-medium py-3 rounded-md transition duration-150 ease-in-out ${buttonColor} ${
              !agreed || loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "SEND"}
          </button>
        </form>

        {/* Status Messages */}
        {status === "success" && (
          <p className="text-green-600 mt-4">
            Your message has been sent successfully ✅
          </p>
        )}
        {status && status !== "success" && (
          <p className="text-red-600 mt-4">Error: {status}</p>
        )}
      </div>
    </div>
  );
}
