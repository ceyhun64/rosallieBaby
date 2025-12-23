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
import { useIsMobile } from "@/hooks/use-mobile"; // Custom hook for mobile detection
import Cart from "./cart"; // Imported Cart component
import { useFavorite } from "@/contexts/favoriteContext"; // Context for favorites
import UserMegaMenu from "./userMegaMenu"; // Dropdown for user actions
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getCart as getGuestCartItems } from "@/utils/cart"; // Utility to get guest cart from local storage

export default function Header() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const pathname = usePathname() || "/";

  // State management for UI elements
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // State management for cart count and loading
  const [cartItems, setCartItems] = useState([]);
  const cartCount = cartItems.length;
  const [cartLoading, setCartLoading] = useState(true);

  // Favorites data from context
  const { favorites, loading: favLoading } = useFavorite();

  // Function to fetch cart data (for logged-in or guest users)
  const fetchCartData = useCallback(async (loggedInUser) => {
    setCartLoading(true);

    try {
      if (loggedInUser) {
        // Fetch cart from API for logged-in users
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          setCartItems(data || []);
        } else {
          setCartItems([]);
          console.error("Error loading cart from API."); // API'den sepet yüklenirken hata oluştu.
        }
      } else {
        // Load cart from local storage for guest users
        const guestCart = getGuestCartItems();
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error("General error occurred while loading cart data:", error); // Sepet verisi yüklenirken genel bir hata oluştu.
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Scroll tracking effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Set scrolled state if vertical scroll is more than 20px
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial load of user and cart information, and event listener setup
  useEffect(() => {
    const loadUserAndCart = async () => {
      let loggedInUser = null;
      try {
        // Check user login status
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

    // 🔥 IMPORTANT: Listen for the 'cartUpdated' event and reload the cart
    const handleCartUpdate = () => {
      // Use the current user state to determine which fetch method to use
      fetchCartData(user);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [fetchCartData, user]); // Dependency on user is crucial here for logic inside handleCartUpdate

  // Navigation handler for search button
  const handleSearchClick = () => router.push("/search");

  // Main navigation items
  const menuItems = [
    {
      label: "Personalized Hospital Sets",
      href: "/all_products/hospital_outfit_special_set",
    },
    {
      label: "Coming Home Outfits",
      href: "/all_products/hospital_outfit_set",
    },
    { label: "Personalized Blankets", href: "/all_products/blanket" },
    { label: "Baby Toys", href: "/all_products/toy" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
        ? "bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-b border-white/40"
        : "bg-white/40 backdrop-blur-xl border-b border-white/20"
        }`} // Dynamic styling based on scroll state
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="text-[16px] md:text-[26px] tracking-[0.04em] text-gray-900 font-serif font-extralight hover:opacity-80 transition-all"
        >
          <Image src="/logo/logo2.webp" alt="Logo" width={84} height={80} />
        </Link>

        {/* Desktop Navigation Menu */}
        {!isMobile && (
          <nav className="flex items-center justify-center flex-1">
            <div className="flex items-center space-x-10">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-[14px] font-light text-gray-600 hover:text-gray-900 tracking-wider transition-all group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* Icons/Action Buttons */}
        <div className="flex items-center gap-4 md:gap-5 lg:gap-6">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full"
            onClick={handleSearchClick}
          >
            <Search className="h-[20px] w-[20px]" strokeWidth={1.4} />
          </Button>

          {/* User/Account Button and Mega Menu Trigger */}
          {!menuOpen && ( // Prevents opening the user menu while mobile menu is open
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Profile"
                className={`text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full ${userMenuOpen ? "bg-white/50" : ""
                  }`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <User className="h-[20px] w-[20px]" strokeWidth={1.4} />
                {user && ( // Green dot for logged-in user
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 border border-white"></span>
                )}
              </Button>
            </div>
          )}

          {/* User Mega Menu (Dropdown) */}
          <UserMegaMenu
            user={user}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
            scrolled={scrolled}
            pathname={pathname}
          />

          {/* Favorites Button */}
          <Link aria-label="go favorites" href={"/favorites"}>
            <Button
              variant="ghost"
              aria-label="favorites"
              size="icon-sm"
              className="relative text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full"
            >
              <Heart className="h-[20px] w-[20px]" strokeWidth={1.4} />
              {favorites.length > 0 && ( // Favorites count badge
                <span className="absolute -top-3 -right-3 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white shadow">
                  {favorites.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="cart"
            className="relative text-gray-600 hover:text-gray-900 hover:bg-white/50 transition rounded-full"
            onClick={() => {
              setCartOpen(true);
              fetchCartData(user); // Force a cart data refresh on open
            }}
          >
            <ShoppingBag className="h-[20px] w-[20px]" strokeWidth={1.4} />
            {cartCount > 0 && ( // Cart count badge
              <span className="absolute -top-3 -right-3 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white shadow">
                {cartCount}
              </span>
            )}
          </Button>

          {/* Mobile Menu Button (Hamburger) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="menu"
              onClick={() => setMenuOpen(true)}
              className="hover:bg-white/50 transition rounded-full"
            >
              <Menu
                className="h-[20px] w-[20px] text-gray-700"
                strokeWidth={1.4}
              />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Sheet (Left Side) */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="left"
          className="w-full h-full border-r border-gray-100 bg-white"
        >
          <SheetHeader className="py-6 px-6 border-b border-gray-100">
            {/* Login/Logout/Register Links */}
            <div className="flex items-center justify-between">
              {user ? (
                <button
                  aria-label="logout"
                  onClick={async () => {
                    await fetch("/api/account/logout", { method: "POST" });
                    setUser(null);
                    await fetchCartData(null); // Load guest cart after logout
                    setMenuOpen(false);
                  }}
                  className="text-sm font-light text-gray-600 hover:text-gray-900 px-4 py-2 me-6 rounded-full hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-3 text-sm font-light">
                  <Link
                    href="/account/login"
                    onClick={() => setMenuOpen(false)}
                    aria-label="login "
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/account/register"
                    aria-label="register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-gray-50"
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

          {/* Mobile Menu Links */}
          <div className="mt-8 flex flex-col gap-1 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-light text-gray-700 py-4 px-4 hover:bg-gray-50 rounded-xl transition-all hover:translate-x-1"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Sidebar Sheet (Right Side) */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[480px] lg:w-[600px] p-0 flex flex-col border-l border-gray-100 bg-white"
        >
          {/* Cart Component is rendered inside the Sheet */}
          <Cart />
        </SheetContent>
      </Sheet>
    </header>
  );
}
