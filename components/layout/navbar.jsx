"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Heart } from "lucide-react"; // lucide-react simgeleri
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header() {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Sepet öğeleri için bir durum ekledik.

  const handleSearchClick = () => {
    router.push("/search");
  };
  const handleLoginClick = () => {
    router.push("/account/login");
  };
  const handleFavoritesClick = () => {
    router.push("/profile/favorites");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sol Taraf - Logo */}
        <Link className="text-xl text-teal-600 font-extrabold" href="/">
          RosallieBaby.Com
        </Link>

        {/* Orta - Navigasyon Menüsü */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            "all-products",
            "hospital-outfit-set",
            "romper",
            "blanket",
            "pillow",
          ].map((item) => {
            const href =
              item === "all-products" ? `/${item}` : `/all-products/${item}`;
            return (
              <Link
                key={item}
                href={href}
                className="relative text-md font-medium text-gray-700 group"
              >
                {item
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                <span className="absolute left-0 -bottom-0.5 h-0.25 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </nav>

        {/* Sağ Taraf - Simgeler */}
        <div className="flex items-center space-x-2 md:space-x-4 cursor-pointer">
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
            className="text-gray-700 hover:text-blue-600"
            onClick={handleFavoritesClick}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-700 hover:text-blue-600"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
              {cartItems.length}
            </span>
          </Button>
        </div>
      </div>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent position="right" size="sm">
          <SheetHeader>
            <div className="flex justify-between items-center w-full">
              {/* Title with Icon */}
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-[#829969]" />
                <SheetTitle className="text-[#829969] font-bold text-2xl">
                  My Cart ({cartItems.length})
                </SheetTitle>
              </div>

              {/* Close Button */}
              <SheetClose asChild></SheetClose>
            </div>
          </SheetHeader>

          {/* Separator */}
          <hr className="my-4 border-gray-300" />

          {/* Empty Cart */}
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
              {/* Cart Items */}
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
                        <p className="font-medium text-gray-700">{item.name}</p>
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

              {/* Separator */}
              <hr className="my-4 border-gray-300" />

              {/* Checkout Button */}
              <div className="flex flex-col items-center">
                <Button className="mt-2 w-full rounded-md bg-[#829969] hover:bg-[#6f855a] text-white py-3 font-medium transition-colors">
                  START SHOPPING
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
