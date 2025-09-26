"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [kpiData, setKpiData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const [productsRes, usersRes, ordersRes, subsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/user/all"),
          fetch("/api/order"),
          fetch("/api/subscribe"),
        ]);

        const productsData = await productsRes.json();
        const usersData = await usersRes.json();
        const ordersData = await ordersRes.json();
        const subscribersData = await subsRes.json();

        console.log("ordersData:", ordersData);
        // KPI verilerini oluştur
        setKpiData([
          {
            id: "products",
            title: "Ürünler",
            stat: productsData.products?.length || 0,
            description: "Ürünleri görüntüle ve yönet",
            icon: <Package size={24} color="#60A5FA" />,
            href: "/admin/products",
          },
          {
            id: "orders",
            title: "Siparişler",
            stat: ordersData.orders?.length || 0,
            description: "Siparişleri takip et ve yönet",
            icon: <ShoppingCart size={24} color="#34D399" />,
            href: "/admin/orders",
          },
          {
            id: "subscribers",
            title: "Aboneler",
            stat: subscribersData.length || 0,
            description: "Abone listesini görüntüle",
            icon: <CreditCard size={24} color="#FBBF24" />,
            href: "/admin/subscribers",
          },
          {
            id: "users",
            title: "Kullanıcılar",
            stat: usersData.users?.length || 0,
            description: "Kullanıcıları yönet",
            icon: <Users size={24} color="#A78BFA" />,
            href: "/admin/users",
          },
          {
            id: "settings",
            title: "Ayarlar",
            stat: "",
            description: "Site ayarlarını yönet",
            icon: <Settings size={24} color="#F472B6" />,
            href: "/admin/settings",
          },
        ]);

        // Son siparişler: en yeni 5 sipariş (id büyükten küçüğe)
        const sortedOrders = (ordersData.orders || []).sort(
          (a, b) => b.id - a.id
        );
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        console.error("KPI fetch error:", error);
      }
    };

    fetchKPI();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "" : "ml-64"}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
          Yönetim Paneli
        </h1>

        {/* KPI Kartları */}
        <div
          className={`grid gap-4 ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          } mb-6`}
        >
          {kpiData.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer">
                <CardHeader className="flex items-center space-x-4">
                  <div>{card.icon}</div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {card.title}
                    </CardTitle>
                    {card.stat !== "" && (
                      <CardDescription className="text-white text-xl font-bold">
                        {card.stat}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-stone-400">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Son Siparişler */}
        {/* Son Siparişler */}
        <div
          className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1"}`}
        >
          <Card className="bg-stone-900 rounded-xl shadow-lg p-4">
            <CardHeader>
              <CardTitle className="text-white">Son Siparişler</CardTitle>
              <Separator className="mt-2" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="bg-stone-800 rounded-lg p-3 border border-stone-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">
                        Sipariş #{order.id}
                      </span>
                      <span className="text-teal-400 font-bold">
                        {order.currency || "TRY"} {order.totalPrice}
                      </span>
                    </div>

                    {/* Kullanıcı Bilgisi */}
                    <div className="text-stone-200 mb-2">
                      <p>
                        <span className="font-semibold">Müşteri:</span>{" "}
                        {order.user?.name} {order.user?.surname} (
                        {order.user?.email})
                      </p>
                      <p>
                        <span className="font-semibold">Telefon:</span>{" "}
                        {order.addresses?.[0]?.phone || "-"}
                      </p>
                    </div>

                    {/* Adresler */}
                    <div className="text-stone-300 mb-2">
                      {order.addresses?.map((addr, idx) => (
                        <p key={idx}>
                          <span className="font-semibold">
                            {addr.type} Adres:
                          </span>{" "}
                          {addr.address}, {addr.district}, {addr.city},{" "}
                          {addr.country} - {addr.zip}
                        </p>
                      ))}
                    </div>

                    {/* Sipariş Ürünleri */}
                    <div className="text-stone-300">
                      <span className="font-semibold">Ürünler:</span>
                      <ul className="ml-4 mt-1">
                        {order.items?.map((item) => (
                          <li key={item.id} className="flex justify-between">
                            <span>
                              {item.product?.name} x{item.quantity}
                            </span>
                            <span>
                              {item.totalPrice} {order.currency || "TRY"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
