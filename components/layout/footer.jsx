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
                <h4 className="text-sm font-semibold text-slate-900 mb-6 tracking-wider uppercase">
                  {section.title}
                </h4>
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
                href="#"
                aria-label="Instagram"
                className="group relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram
                  className="h-4.5 w-4.5 text-purple-600 group-hover:text-white transition-colors"
                  strokeWidth={1.8}
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
      <div className="w-full bg-white py-6 px-6 md:px-12 border-t border-slate-700/50">
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
