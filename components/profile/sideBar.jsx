"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Sidebar({ username = "Ceyhun Türkmen" }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const menuItems = {
    "Personal Information": [
      { name: "Personal Info", path: "/profile" },
      { name: "Addresses", path: "/profile/addresses" },
      { name: "Favorites", path: "/profile/favorites" },
    ],
    "Order Information": [{ name: "Orders", path: "/profile/orders" }],
  };

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/account/login",
    });
  };

  return (
    <div
      className={`
        w-full md:w-110 
        ${isMobile ? "h-auto" : "h-screen"} 
        bg-gray-50 p-6 font-sans flex flex-col justify-between
      `}
    >
      {/* User Info and Logout */}
      <div className={`${isMobile ? "ms-0 mt-4" : "ms-10 mt-20"}`}>
        <div className="flex flex-col mb-8">
          <h1 className="text-xl mb-1">{username}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="w-full">
          {Object.entries(menuItems).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-bold text-black mb-2">{category}</h3>
              <ul
                className={`
                  ${isMobile ? "grid grid-cols-2 gap-2" : "flex flex-col"}
                `}
              >
                {items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`block ${
                        pathname === item.path
                          ? "text-black font-semibold"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
