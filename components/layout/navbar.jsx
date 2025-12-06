"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, X, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Cart from "./cart";
import { useFavorite } from "@/contexts/favoriteContext";
import UserMegaMenu from "./userMegaMenu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getCart as getGuestCartItems } from "@/utils/cart";

export default function Header() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const pathname = usePathname() || "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.length;
  const [cartLoading, setCartLoading] = useState(true);

  const { favorites, loading: favLoading } = useFavorite();

  const fetchCartData = useCallback(async (loggedInUser) => {
    setCartLoading(true);

    try {
      if (loggedInUser) {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          setCartItems(data || []);
        } else {
          setCartItems([]);
          console.error("Error loading cart from API.");
        }
      } else {
        const guestCart = getGuestCartItems();
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error("General error occurred while loading cart data:", error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadUserAndCart = async () => {
      let loggedInUser = null;
      try {
        const userRes = await fetch("/api/account/check");
        const data = await userRes.json();
        loggedInUser = data.user || null;
      } catch {
        loggedInUser = null;
      }
      setUser(loggedInUser);
      await fetchCartData(loggedInUser);
    };

    loadUserAndCart();

    const handleCartUpdate = () => {
      fetchCartData(user);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [fetchCartData, user]);

  const handleSearchClick = () => router.push("/search");

  const menuItems = [
    {
      label: "Hopital Special Sets",
      href: "/all_products/hospital_outfit_special_set",
    },
    {
      label: "Hospital Outfit Sets",
      href: "/all_products/hospital_outfit_set",
    },
    { label: "Toys", href: "/all_products/toy" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-white/40"
          : "bg-white/40 backdrop-blur-xl border-b border-white/20"
      }`}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 sm:px-8 lg:px-12 max-w-6xl">
        {/* Logo - Improved touch target */}
        <Link
          href="/"
          className="text-[16px] md:text-[26px] tracking-[0.04em] text-gray-900 font-serif font-extralight hover:opacity-80 transition-all min-h-[48px] flex items-center"
          aria-label="Rosallie Baby Home"
        >
          <Image
            src="/logo/logo2.png"
            alt="Rosallie Baby Logo"
            width={84}
            height={80}
            priority
          />
        </Link>

        {/* Desktop Navigation Menu */}
        {!isMobile && (
          <nav
            className="flex items-center justify-center flex-1"
            aria-label="Main navigation"
          >
            <div className="flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[14px] font-light text-gray-600 hover:text-gray-900 tracking-wider transition-all group min-h-[48px] flex items-center py-2"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* Icons/Action Buttons - Enhanced touch targets */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          {/* Search Button - Minimum 48x48px */}
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full min-w-[48px] min-h-[48px] w-12 h-12 p-0 flex items-center justify-center"
            onClick={handleSearchClick}
            aria-label="Search products"
          >
            <Search className="h-[22px] w-[22px]" strokeWidth={1.4} />
          </Button>

          {/* User/Account Button - Minimum 48x48px */}
          {!menuOpen && (
            <div className="relative">
              <Button
                variant="ghost"
                className={`text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full min-w-[48px] min-h-[48px] w-12 h-12 p-0 flex items-center justify-center ${
                  userMenuOpen ? "bg-white/50" : ""
                }`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label={user ? "User account menu" : "Login or register"}
                aria-expanded={userMenuOpen}
              >
                <User className="h-[22px] w-[22px]" strokeWidth={1.4} />
                {user && (
                  <span
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 border border-white"
                    aria-label="Logged in"
                  ></span>
                )}
              </Button>
            </div>
          )}

          {/* User Mega Menu */}
          <UserMegaMenu
            user={user}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            scrolled={scrolled}
            pathname={pathname}
          />

          {/* Favorites Button - Minimum 48x48px with proper spacing */}
          <Link
            href="/favorites"
            className="min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label={`Go to favorites page${
              favorites.length > 0 ? ` (${favorites.length} items)` : ""
            }`}
          >
            <Button
              variant="ghost"
              className="relative text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full w-12 h-12 p-0 flex items-center justify-center"
              asChild
            >
              <span>
                <Heart className="h-[22px] w-[22px]" strokeWidth={1.4} />
                {favorites.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex h-[20px] min-w-[20px] px-1 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white shadow"
                    aria-hidden="true"
                  >
                    {favorites.length}
                  </span>
                )}
              </span>
            </Button>
          </Link>

          {/* Cart Button - Minimum 48x48px with proper spacing */}
          <Button
            variant="ghost"
            className="relative text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full min-w-[48px] min-h-[48px] w-12 h-12 p-0 flex items-center justify-center"
            onClick={() => {
              setCartOpen(true);
              fetchCartData(user);
            }}
            aria-label={`Open shopping cart${
              cartCount > 0 ? ` (${cartCount} items)` : ""
            }`}
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.4} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 flex h-[20px] min-w-[20px] px-1 items-center justify-center rounded-full bg-gray-900 text-[11px] font-medium text-white shadow"
                aria-hidden="true"
              >
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu Button - Minimum 48x48px */}
          {isMobile && (
            <Button
              variant="ghost"
              onClick={() => setMenuOpen(true)}
              className="hover:bg-white/50 transition rounded-full min-w-[48px] min-h-[48px] w-12 h-12 p-0 flex items-center justify-center"
              aria-label="Open mobile menu"
              aria-expanded={menuOpen}
            >
              <Menu
                className="h-[22px] w-[22px] text-gray-700"
                strokeWidth={1.4}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-full h-full border-r border-gray-100 bg-white"
        >
          <SheetHeader className="py-6 px-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              {user ? (
                <button
                  onClick={async () => {
                    await fetch("/api/account/logout", { method: "POST" });
                    setUser(null);
                    await fetchCartData(null);
                    setMenuOpen(false);
                  }}
                  className="text-sm font-light text-gray-600 hover:text-gray-900 px-4 py-3 me-6 rounded-full hover:bg-gray-50 min-h-[48px]"
                  aria-label="Logout from account"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-3 text-sm font-light">
                  <Link
                    href="/account/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 px-4 py-3 rounded-full hover:bg-gray-50 min-h-[48px] flex items-center"
                  >
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/account/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 px-4 py-3 rounded-full hover:bg-gray-50 min-h-[48px] flex items-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <SheetDescription className="text-xs font-light text-gray-500 mt-2 tracking-wide">
              Navigate through our premium collections
            </SheetDescription>
          </SheetHeader>

          {/* Mobile Menu Links - Enhanced touch targets */}
          <nav
            className="mt-8 flex flex-col gap-1 px-2"
            aria-label="Mobile navigation"
          >
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-light text-gray-700 py-4 px-4 hover:bg-gray-50 rounded-xl transition-all hover:translate-x-1 min-h-[56px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart Sidebar Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[480px] lg:w-[600px] p-0 flex flex-col border-l border-gray-100 bg-white"
        >
          <Cart />
        </SheetContent>
      </Sheet>
    </header>
  );
}
