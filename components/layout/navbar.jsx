"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  User,
  ShoppingBag,
  X,
  Menu,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Cart from "./cart"; // Cart componenti

export default function Header() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    fetch("/api/account/check")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) {
      setCartItemsCount(0);
      return;
    }
    async function fetchCartCount() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Sepet verileri alınamadı.");
        const data = await res.json();
        setCartItemsCount(data.length);
      } catch {
        setCartItemsCount(0);
      }
    }
    fetchCartCount();
  }, [user]);

  const handleUserClick = () =>
    router.push(user ? "/profile" : "/account/login");
  const handleSearchClick = () => router.push("/search");

  const menuItems = [
    { label: "All Products", href: "/all_products" },
    {
      label: "Hospital Outfit Special Set",
      href: "/all_products/hospital_outfit_special_set",
    },
    { label: "Hospital Outfit Set", href: "/all_products/hospital_outfit_set" },
    { label: "Toy", href: "/all_products/toy" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 relative">
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
            onClick={handleUserClick}
          >
            <User className="h-5 w-5" />
          </Button>

          {user && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-pink-600"
              onClick={() => router.push("/profile/favorites")}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-700 hover:text-blue-600"
            onClick={() => {
              if (!user) return router.push("/account/login");
              setCartOpen(true);
            }}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-full h-full">
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
                    className="text-black hover:text-gray-600 transition-colors text-xl"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-0">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-normal text-gray-800 py-3 px-6 hover:bg-gray-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Cart Sheet */}
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetContent
            side="right"
            className="w-full sm:w-[540px] lg:w-[700px] p-0 flex flex-col"
          >
            <SheetHeader className="!flex !items-center !justify-between p-4 border-b border-gray-200">
              <SheetTitle className="text-xl font-bold text-gray-800 truncate min-w-0">
                My Cart
              </SheetTitle>

              <SheetClose asChild>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </SheetClose>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              <Cart onCartUpdate={(count) => setCartItemsCount(count)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
