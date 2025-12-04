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

  /** Close menu on ESC key or outside click */
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
        { label: "My Profile", href: "/profile", icon: User },
        { label: "My Orders", href: "/profile/orders", icon: Package },
        { label: "My Addresses", href: "/profile/addresses", icon: MapPin },
      ]
    : [];

  return (
    <AnimatePresence>
      {userMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed right-0 md:right-20 z-40 w-full md:w-100 
          backdrop-blur-xl bg-white/90 border border-gray-200 shadow-xl rounded-xs p-6 top-24`}
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {user ? "My Account" : "Welcome"}
            </h3>

            <button
              onClick={() => setUserMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* --- Authenticated User --- */}
          {user ? (
            <div className="mt-4 flex flex-col gap-4">
              {/* User Card */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="p-3 bg-[#7B0323]/10 rounded-full">
                  <User className="w-6 h-6 text-[#7B0323]" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {user.name || "Guest User"}
                  </p>
                  {user.email && (
                    <p className="text-sm text-gray-600">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-1">
                {mainItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <item.icon className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-800 font-medium">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* --- Guest --- */
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                Create an account to enjoy benefits or log in to manage your actions.
              </p>

              <Link
                href="/account/login"
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3
                bg-[#7B0323] text-white rounded-full shadow hover:bg-[#C70039] transition"
              >
                <LogIn className="w-5 h-5" />
                Log In
              </Link>

              <Link
                href="/account/register"
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3
                border border-gray-300 rounded-full text-gray-800 hover:bg-gray-50 transition font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Register Now
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
