"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, MapPin, Heart, ShoppingBag, LogOut, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  const menuItems = [
    {
      category: "Personal Information",
      items: [
        { name: "Personal Info", path: "/profile", icon: User },
        { name: "Addresses", path: "/profile/addresses", icon: MapPin },
      ],
    },
    {
      category: "Order Information",
      items: [{ name: "Orders", path: "/profile/orders", icon: ShoppingBag }],
    },
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div
      className={`w-full md:w-80 ${
        isMobile ? "h-auto" : "h-screen"
      } bg-white border-r border-slate-100 flex flex-col`}
    >
      {/* Header Section */}
      <div className={`${isMobile ? "p-6" : "p-8 pt-16"}`}>
        {/* User Profile Card */}
        <div className="p-6 mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                <span className="text-slate-700 font-semibold text-lg tracking-tight">
                  {user ? `${user.name[0]}${user.surname[0]}` : "..."}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">
                {user ? `${user.name} ${user.surname}` : "Loading..."}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium"> Member</p>
            </div>
          </div>
          
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg transition-all duration-200 group bg-white hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-[-2px]" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-8">
          {menuItems.map(({ category, items }) => (
            <div key={category}>
              <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4 px-3 letterspacing-[0.1em]">
                {category}
              </h3>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`group flex items-center justify-between px-4 py-3 transition-all duration-200 relative ${
                          isActive
                            ? "text-slate-900 bg-slate-50"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-slate-900 rounded-r-full"></div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`h-[18px] w-[18px] transition-colors ${
                              isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <span className="font-medium text-[13px] tracking-tight">{item.name}</span>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-all ${
                            isActive
                              ? "text-slate-400 opacity-100"
                              : "text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Section - Elegant Badge */}
     
    </div>
  );
}