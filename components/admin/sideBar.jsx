"use client";

import React, { useState } from "react";
import {
  Box,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Yönetici Paneli",
      icon: <Box size={20} />,
      href: "/admin/dashboard",
    },
    {
      id: "products",
      label: "Ürünler",
      icon: <Package size={20} />,
      href: "/admin/products",
    },
    {
      id: "blog",
      label: "Blog",
      icon: <FileText size={20} />,
      href: "/admin/blog",
    },
    {
      id: "orders",
      label: "Siparişler",
      icon: <ShoppingCart size={20} />,
      href: "/admin/orders",
    },
    {
      id: "subscribers",
      label: "Aboneler",
      icon: <CreditCard size={20} />,
      href: "/admin/subscribers",
    },
    {
      id: "users",
      label: "Kullanıcılar",
      icon: <Users size={20} />,
      href: "/admin/users",
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: <Settings size={20} />,
      href: "/admin/settings",
    },
  ];

  let active = "dashboard";
  for (const item of menuItems) {
    if (
      pathname === item.href ||
      pathname.startsWith(item.href + "/") ||
      pathname.startsWith(item.href)
    ) {
      active = item.id;
      break;
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Logout başarılı, yönlendir
        router.push("/admin"); // istediğin login sayfası
      } else {
        console.error("Logout başarısız");
      }
    } catch (err) {
      console.error("Logout hatası:", err);
    }
  };

  // Desktop sidebar
  const desktopSidebar = (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-stone-950 flex flex-col shadow-lg">
      <div className="px-6 py-6 border-b border-stone-800 flex flex-col items-start">
        <div className="text-teal-600 text-2xl">
          <Link className="font-bold" href={"/admin/dashboard"}>
            RosallieBaby
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${active === item.id ? "bg-stone-900" : "hover:bg-stone-700"
              }`}
            aria-current={active === item.id ? "page" : undefined}
          >
            {active === item.id && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></span>
            )}
            <span className="mr-3">
              {React.cloneElement(item.icon, { color: "white" })}
            </span>
            <span className="text-white">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-stone-800 flex items-center space-x-4">
        <Image
          src="/avatar/admin.png"
          alt="Avatar"
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold">Barış Beyazgül</span>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-400 text-sm hover:text-red-300 space-x-1"
          >
            <LogOut size={16} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </aside>
  );

  // Mobile menu overlay
  const mobileMenu = (
    <>
      {/* Menü Kapalıyken (Başlangıçta) sadece Menu ikonlu buton görünür.
        Menü Açıkken bu buton gizlenir, böylece içerideki X butonu kullanılır.
      */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-stone-950 text-white rounded-md md:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {isOpen && (
        // Menü Açık (Overlay)
        <div className="fixed inset-0 z-40 bg-stone-950 flex flex-col shadow-lg md:hidden">
          <div className="px-6 py-6 border-b border-stone-800 flex justify-between items-center">
            <Link
              className="text-teal-600 text-2xl font-bold"
              href={"/admin/dashboard"}
              onClick={() => setIsOpen(false)} // Menü başlığına tıklayınca menüyü kapat
            >
              RosallieBaby
            </Link>
            {/* Menü Açıkken, içerideki X butonu kapatmayı sağlar. */}
            <button onClick={() => setIsOpen(false)}>
              <X size={24} color="white" />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${active === item.id ? "bg-stone-900" : "hover:bg-stone-700"
                  }`}
                aria-current={active === item.id ? "page" : undefined}
                onClick={() => setIsOpen(false)} // Navigasyon öğesine tıklayınca menüyü kapat
              >
                {active === item.id && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></span>
                )}
                <span className="mr-3">
                  {React.cloneElement(item.icon, { color: "white" })}
                </span>
                <span className="text-white">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-6 py-4 border-t border-stone-800 flex items-center space-x-4">
            <Image
              src="/avatar/admin.png"
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-white font-semibold">Barış Beyazgül</span>
              <Link
                href="/logout"
                className="flex items-center text-red-400 text-sm hover:text-red-300 space-x-1"
                onClick={() => setIsOpen(false)} // Çıkış yap'a tıklayınca menüyü kapat
              >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Mobil veya Masaüstü görünümünü döndür
  // isMobile hook'u, AdminSidebar bileşeninizde tanımlanmadığı için
  // dışarıdan gelen bir prop olarak kullanmanız gerekmektedir, ancak
  // bileşen adı `AdminSidebar` iken `Sidebar` olarak dışa aktarmaktadır.
  // Bu kod, isMobile hook'unun mevcut dosya içinde doğru çalıştığını varsayarak yanıt vermektedir.
  return <>{isMobile ? mobileMenu : desktopSidebar}</>;
}
