"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const handleLoginClick = () => router.push("/account/login");
  const handleSearchClick = () => router.push("/search");

  const menuItems = [
    { label: "All Products", href: "/all-products" },
    { label: "Hospital Outfit Set", href: "/all-products/hospital-outfit-set" },
    { label: "Toy", href: "/all-products/toy" },
    { label: "Pillow", href: "/all-products/pillow" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Sol - Hamburger Menü (Mobil) / Logo (Desktop) */}
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        ) : (
          <Link className="text-xl text-teal-600 font-extrabold" href="/">
            RosallieBaby.Com
          </Link>
        )}
        {/* Ortada Logo (Mobil) */}
        {isMobile && (
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-md text-teal-600 font-extrabold"
          >
            RosallieBaby.Com
          </Link>
        )}
        {/* Masaüstü Navigasyon */}
        {!isMobile && (
          <nav className="flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-md font-medium text-gray-700 group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-0.5 h-0.25 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        )}
        {/* Sağ - Arama, Kullanıcı, Sepet */}
        <div className="flex items-center md:space-x-4 cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-blue-600"
            onClick={handleSearchClick}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:text-blue-600"
            onClick={handleLoginClick}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-700 hover:text-blue-600"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </Button>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent
            side="left"
            className="w-full h-full"
            aria-describedby={undefined} // Erişilebilirlik hatasını önlemek için eklenebilir
          >
            {/* Üst Kısım: Kapatma İkonu, Giriş/Kayıt ve Sepet */}
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {/* Kapatma İkonu */}
                <SheetClose asChild>
                  <X className="h-6 w-6 text-gray-700 cursor-pointer" />
                </SheetClose>
                {/* Üye Girişi ve Kayıt Ol */}
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Link
                    href="/account/login"
                    className="text-[#829969] hover:bg-[#6f855a] transition-colors text-xl"
                  >
                    Login
                  </Link>
                  <span>|</span>
                  <Link
                    href="/account/register"
                    className="text-black hover:text-gray-600 transition-colors text-xl "
                  >
                    Register
                  </Link>
                </div>
              </div>
              {/* Sepet İkonu */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:text-gray-900"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-10 w-10" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Menü Öğeleri */}
            <div className="mt-4 flex flex-col gap-0">
              <Link
                href="/all-products"
                className="text-lg font-normal text-gray-800 py-3 px-6 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/all-products/hospital-outfit-set"
                className="text-lg font-normal text-gray-800 py-3 px-6 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Hospital Outfit Set
              </Link>

              <Link
                href="/all-products/toy"
                className="text-lg font-normal text-gray-800 py-3 px-6 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Toys
              </Link>
              <Link
                href="/all-products/pillow"
                className="text-lg font-normal text-gray-800 py-3 px-6 hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Pillows
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        {/* Cart Sheet */}
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent
            position="right"
            className={isMobile ? "w-full h-full" : "sm"} // Mobilde tam ekran, desktop küçük
          >
            <SheetHeader>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-[#829969]" />
                  <SheetTitle className="text-[#829969] font-bold text-2xl">
                    My Cart ({cartItems.length})
                  </SheetTitle>
                </div>
                <SheetClose asChild>
                  <X className="h-6 w-6 text-gray-700 cursor-pointer" />
                </SheetClose>
              </div>
            </SheetHeader>

            <hr className="my-4 border-gray-300" />

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] text-center gap-4">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Button
                  onClick={() => router.push("/all-products")}
                  className="mt-4 w-full max-w-[90%] mx-auto rounded-none py-7 bg-[#829969] hover:bg-[#6f855a] text-white font-bold text-lg transition-colors"
                >
                  START SHOPPING
                </Button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-700">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x ${item.price}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-700">
                        ${item.quantity * item.price}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="flex flex-col items-center">
                  <Button className="mt-2 w-full rounded-md bg-[#829969] hover:bg-[#6f855a] text-white py-3 font-medium transition-colors">
                    START SHOPPING
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
