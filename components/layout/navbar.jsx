"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, User, ShoppingBag, X, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartItem } from "./cartItem";

// Örnek sepet öğesi verisi
const mockCartItem = {
  id: "1",
  name: "Sun Müslin Hastane Çıkışı 6'lı Set",
  image: "/allProducts/product3main.webp", // Buraya görselin yolunu ekleyin
  price: 2047.99,
  oldPrice: 2347.99,
  productCode: "4693",
  quantity: 1,
  options: [
    { label: "Enter Name", value: "why", extraPrice: 0 },
    {
      label: "Hat & Blanket Option",
      value: "Ruffled",
      extraPrice: 149.0,
    },
  ],
};

export default function Header() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([mockCartItem]); // Örnek veri ile dolduruldu

  const handleLoginClick = () => router.push("/account/login");
  const handleSearchClick = () => router.push("/search");

  const menuItems = [
    { label: "All Products", href: "/all-products" },
    { label: "Hospital Outfit Set", href: "/all-products/hospital-outfit-set" },
    { label: "Toy", href: "/all-products/toy" },
    { label: "Pillow", href: "/all-products/pillow" },
  ];

  // Sepetteki toplam tutarı hesaplama
  const totalAmount = cartItems.reduce((acc, item) => {
    const itemPrice =
      item.price +
      item.options.reduce((optAcc, opt) => optAcc + (opt.extraPrice || 0), 0);
    return acc + itemPrice;
  }, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/*... (mevcut Header kodları) ...*/}
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)}>
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        ) : (
          <Link className="text-xl text-teal-600 font-extrabold" href="/">
            RosallieBaby
          </Link>
        )}
        {isMobile && (
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-md text-teal-600 font-extrabold"
          >
            RosallieBaby
          </Link>
        )}
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
            aria-describedby={undefined}
          >
            <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <SheetClose asChild>
                  <X className="h-6 w-6 text-gray-700 cursor-pointer" />
                </SheetClose>
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

        {/* Görselle uyumlu yeni Cart Sheet */}
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent
            side="right"
            className="w-full sm:w-[540px] lg:w-[700px] p-0 flex flex-col"
          >
            {/* Header */}
            <SheetHeader className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-xl font-bold text-gray-800">
                  My Cart ({cartItems.length})
                </SheetTitle>
                <SheetClose asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </SheetClose>
              </div>
            </SheetHeader>

            {/* Ürün Listesi */}
            <div className="flex-1 overflow-y-auto px-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <p>Sepetiniz boş.</p>
                </div>
              ) : (
                cartItems.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Alt Kısım */}
            <div className="sticky bottom-0   shadow-top">
              <div className="flex justify-between items-center font-bold text-xl"></div>
              <Button
                asChild
                className="w-full rounded-none bg-gray-100 hover:bg-gray-200 text-white font-semibold py-3 h-auto"
              >
                <Link href="/payment">
                  <span className="mr-2 text-black">GO TO PAYMENT STEP</span>
                  <ShoppingBag className="h-5 w-5 text-black" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none bg-[#829969] hover:bg-[#6f855a] text-white hover:text-gray-50 font-semibold py-3 h-auto"
              >
                <Link href="/cart" className="flex  w-full px-0">
                  {/* Left side: Total and Price */}
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Total</span>
                    <span className="text-lg font-bold">
                      ₺{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Right side: Go to Cart */}
                  <div className="flex items-center gap-2">
                    <span className="uppercase text-sm ms-30">Go to Cart</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
