"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Plus, Minus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const footerSections = [
  {
    title: "Agreements",
    links: [
      { label: "Distance Sales Agreement", href: "/contract/distance_selling" },
      { label: "Privacy Policy", href: "/contract/privacy_policy" },
      { label: "Cancellation & Refund Policy", href: "/contract/cancellation" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "Sign In", href: "/account/login" },
      { label: "Register", href: "/account/register" },
    ],
  },
  {
    title: "About Us",
    links: [{ label: "Contact", href: "/contact" }],
  },
];

export default function Footer() {
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <footer
        className={`bg-white text-black py-12 ${isMobile ? "px-0" : "px-5"}`}
      >
        <div className="container mx-auto px-4">
          {/* Link Columns */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            } gap-8 md:gap-16`}
          >
            {footerSections.map((section, index) => (
              <div key={index}>
                {isMobile ? (
                  // Mobile Accordion
                  <div>
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex justify-between items-center text-lg font-bold mb-2"
                    >
                      {section.title}
                      {openIndex === index ? (
                        <Minus size={20} />
                      ) : (
                        <Plus size={20} />
                      )}
                    </button>
                    {openIndex === index && (
                      <ul className="space-y-2 text-gray-400 mb-4">
                        {section.links.map((link, i) => (
                          <li key={i}>
                            <Link
                              href={link.href}
                              className="hover:text-black transition-colors"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Desktop Grid
                  <div>
                    <h4 className="text-xl font-bold mb-4">{section.title}</h4>
                    <ul className="space-y-2 text-gray-400">
                      {section.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="hover:text-black transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Section: Social Media and Payment Icons */}
          <div className="border-t mt-12 pt-8 flex flex-row items-center justify-between">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook
                  className="text-black hover:text-gray-500 transition-colors"
                  size={24}
                />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram
                  className="text-black hover:text-gray-500 transition-colors"
                  size={24}
                />
              </Link>
            </div>

            {/* Payment Icons */}
            <div className="relative w-50 md:w-100 h-12">
              <Image
                src="/iyzico/logo_band_colored@3x.webp"
                alt="iyzico"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="w-full bg-[#96a978] py-4 px-4 md:px-10">
        <p className="text-white text-sm font-medium text-center md:text-left">
          <span className="block md:inline">
            ©2025 RosallieBaby.com All rights reserved
            <span className="hidden md:inline"> | </span>
          </span>
          <span className="block md:inline">
            Developed by{" "}
            <a
              href="https://wa.me/905541496377"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 underline font-bold"
            >
              .jhun
            </a>
          </span>
        </p>
      </div>
    </>
  );
}
