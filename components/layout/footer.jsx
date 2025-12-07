"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Plus,
  Minus,
  Heart,
  Sparkles,
  // Tiktok ve Pinterest lucide ikonları kaldırıldı.
} from "lucide-react";
import Image from "next/image";
import { GradientText } from "../ui/shadcn-io/gradient-text";

const footerSections = [
  {
    title: "Legal & Policies",
    links: [
      { label: "Distance Sales Agreement", href: "/contract/distance_selling" },
      { label: "Privacy Policy", href: "/contract/privacy_policy" },
      { label: "Cancellation & Refund", href: "/contract/cancellation" },
    ],
  },
  {
    title: "Your Account",
    links: [
      { label: "Sign In", href: "/account/login" },
      { label: "Create Account", href: "/account/register" },
    ],
  },
  {
    title: "Get in Touch",
    links: [{ label: "Contact Us", href: "/contact" }],
  },
];

export default function Footer() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Yeni SVG bazlı TikTok bileşeni/fonksiyonu (return eklendi)
  const TikTokIcon = ({ className, strokeWidth }) => {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        // strokeWidth SVG path'leri için genellikle kullanılmaz, ancak yine de geçilebilir
        style={{ strokeWidth: strokeWidth }}
      >
        <title>TikTok</title>
        <path
          fill="currentColor"
          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        />
      </svg>
    );
  };

  // Yeni SVG bazlı Pinterest bileşeni/fonksiyonu (return eklendi)
  const PinterestIcon = ({ className, strokeWidth }) => {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ strokeWidth: strokeWidth }}
      >
        <title>Pinterest</title>
        <path
          fill="currentColor"
          d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
        />
      </svg>
    );
  };

  return (
    <>
      <footer className="bg-white text-slate-800 py-16 md:py-24 border-t border-slate-200/60 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          {/* Brand Section */}
          <div className="text-center mb-16 pb-12 border-b border-slate-200/60">
            <div className="inline-flex items-center justify-center mb-4">
              <Link
                href="/"
                className="text-[16px] md:text-[26px] tracking-[0.04em] text-gray-900 font-serif font-extralight hover:opacity-80 transition-all"
              >
                <Image
                  src="/logo/logo2.png"
                  alt="Logo"
                  width={168}
                  height={160}
                />
              </Link>
            </div>
            <p className="text-sm font-light text-slate-500 tracking-[0.15em] uppercase max-w-md mx-auto mt-3">
              Premium Baby Essentials Crafted with Love
            </p>
            <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </div>

          {/* Link Columns - Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-16 mb-20 max-w-4xl mx-auto">
            {footerSections.map((section, index) => (
              <div key={index} className="text-center">
                <h2 className="text-sm font-semibold text-slate-900 mb-6 tracking-wider uppercase">
                  {section.title}
                </h2>
                <ul className="space-y-3.5 text-slate-600">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-sm font-light hover:text-slate-900 transition-all duration-300 inline-block hover:translate-y-[-2px] transform"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Link Columns - Mobile Accordion */}
          <div className="md:hidden space-y-4 mb-16">
            {footerSections.map((section, index) => (
              <div key={index} className="border-b border-slate-200/60 pb-4">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center text-base font-medium text-slate-900 py-3 hover:text-slate-600 transition-colors"
                >
                  <span className="tracking-wide uppercase text-xs">
                    {section.title}
                  </span>
                  <div className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                    {openIndex === index ? (
                      <Minus
                        className="h-3.5 w-3.5 text-slate-600"
                        strokeWidth={2}
                      />
                    ) : (
                      <Plus
                        className="h-3.5 w-3.5 text-slate-600"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-96 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-3 text-slate-600 pl-1">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link
                          href={link.href}
                          className="text-sm font-light hover:text-slate-900 transition-colors inline-block"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-200/60 pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Social Media */}
            <div className="flex items-center gap-5">
              <p className="text-xs font-medium text-slate-500 tracking-wider uppercase">
                Follow Us
              </p>
              <Link
                href="#"
                aria-label="Facebook"
                className="group relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook
                  className="h-4.5 w-4.5 text-slate-600 group-hover:text-white transition-colors"
                  strokeWidth={1.8}
                />
              </Link>
              <Link
                href="https://www.instagram.com/rosalliebaby/?utm_source=ig_web_button_share_sheet"
                aria-label="Instagram"
                className="group relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram
                  className="h-4.5 w-4.5 text-purple-600 group-hover:text-white transition-colors"
                  strokeWidth={1.8}
                />
              </Link>

              {/* SVG Bazlı TikTok İkonu */}
              <Link
                href="#"
                aria-label="TikTok"
                className="group relative w-10 h-10 rounded-full bg-slate-100 hover:bg-black flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <TikTokIcon
                  className="h-4.5 w-4.5 text-slate-600 group-hover:text-white transition-colors"
                  strokeWidth={0} // SVG path'i fill kullandığı için strokeWidth sıfır olarak bırakıldı/önemsizleştirildi
                />
              </Link>

              {/* SVG Bazlı Pinterest İkonu */}
              <Link
                href="#"
                aria-label="Pinterest"
                className="group relative w-10 h-10 rounded-full bg-slate-100 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <PinterestIcon
                  className="h-4.5 w-4.5 text-slate-600 group-hover:text-white transition-colors"
                  strokeWidth={0}
                />
              </Link>
            </div>

            {/* Payment Badge */}
            <div className="flex items-center gap-3 px-6 py-3">
              <Image
                src="/iyzico/logo_band_colored@3x.webp"
                alt="Payment Badge"
                width={400}
                height={100}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Copyright Section */}
      <div className="w-full bg-white py-6 px-6 md:px-12 border-t border-slate-200">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-700 font-light">
          <p className="text-center md:text-left flex items-center gap-2">
            <span>© 2025 RosallieBaby.</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="text-slate-400">All rights reserved.</span>
          </p>

          <p className="text-sm text-gray-500 text-center md:text-left">
            Developed By{" "}
            <a
              href="https://wa.me/905541496377"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 hover:underline"
            >
              <GradientText
                className="text-xl font-bold font-mono tracking-tighter"
                text=".jhun{}"
              />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
