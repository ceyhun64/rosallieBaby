// components/Footer.jsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="bg-white text-black py-12 px-5">
        <div className="container mx-auto px-4">
          {/* Top Section: Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {/* AGREEMENTS */}
            <div>
              <h4 className="text-xl font-bold mb-4">Agreements</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/mesafeli-satis-sozlesmesi"
                    className="hover:text-black transition-colors"
                  >
                    Distance Sales Agreement
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gizlilik-sozlesmesi"
                    className="hover:text-black transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/iptal-iade-sartlari"
                    className="hover:text-black transition-colors"
                  >
                    Cancellation & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* MY ACCOUNT */}
            <div>
              <h4 className="text-xl font-bold mb-4">My Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/giris"
                    className="hover:text-black transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kayit-ol"
                    className="hover:text-black transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* ABOUT US */}
            <div>
              <h4 className="text-xl font-bold mb-4">About Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/iletisim"
                    className="hover:text-black transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section: Social Media and Payment Icons */}
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
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

            <div className="flex items-center space-x-1">
              <Image
                src="/footer/Visa.svg"
                alt="Visa logo"
                width={40}
                height={20}
              />
              <Image
                src="/footer/Maestro.svg"
                alt="Maestro logo"
                width={40}
                height={20}
              />
              <Image
                src="/footer/Mastercard.svg"
                alt="Mastercard logo"
                width={40}
                height={20}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="w-full bg-[#96a978] py-4 px-10">
        <p className="text-white text-sm font-medium">
          ©2025 All rights reserved | Developed by Ceyhun Türkmen
        </p>
      </div>
    </>
  );
}
