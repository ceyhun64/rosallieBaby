"use client";

import Link from "next/link";
import { LogIn, UserPlus, User, MapPin, Package, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

export default function UserMegaMenu({
  user,
  userMenuOpen,
  setUserMenuOpen,
  pathname,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClick = (e) => {
      const isUserButton = e.target.closest('[data-id="user-button"]');
      if (!isUserButton && menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userMenuOpen, setUserMenuOpen]);

  const mainItems = user
    ? [
        { label: "Profile", href: "/profile", icon: User },
        { label: "Orders", href: "/profile/orders", icon: Package },
        { label: "Addresses", href: "/profile/addresses", icon: MapPin },
      ]
    : [];

  return (
    <AnimatePresence>
      {userMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0   z-30"
            onClick={() => setUserMenuOpen(false)}
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-4 md:right-20 top-24 z-40 w-[calc(100%-2rem)] md:w-96
            bg-white/95 backdrop-blur-2xl shadow-2xl rounded-xs overflow-hidden"
          >
            {/* Close Button - Floating */}
            <button
              onClick={() => setUserMenuOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 
              transition-colors duration-200 z-10"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-8">
              {user ? (
                /* Authenticated User */
                <div className="space-y-8">
                  {/* User Info */}
                  <div className="pr-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-1">
                      {user.name || "Guest"}
                    </h3>
                    {user.email && (
                      <p className="text-sm text-gray-500 font-light">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-transparent" />

                  {/* Menu Items */}
                  <nav className="space-y-1">
                    {mainItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="group flex items-center gap-4 px-4 py-3.5 rounded-xl
                        hover:bg-gray-50 transition-all duration-200"
                      >
                        <item.icon className="w-4 h-4 text-gray-400 group-hover:text-[#7B0323] 
                        transition-colors duration-200" />
                        <span className="text-gray-700 font-light tracking-wide
                        group-hover:text-gray-900 transition-colors duration-200">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              ) : (
                /* Guest */
                <div className="space-y-6">
                  <div className="pr-8">
                    <h3 className="text-2xl font-light text-gray-900 mb-2">
                      Welcome
                    </h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">
                      Sign in to access your account and enjoy personalized experience
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Link
                      href="/account/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5
                      bg-[#7B0323] text-white rounded-full font-light tracking-wide
                      hover:bg-[#8B0329] transition-all duration-300 shadow-sm
                      hover:shadow-md"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>

                    <Link
                      href="/account/register"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5
                      border border-gray-200 rounded-full text-gray-700 font-light tracking-wide
                      hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}