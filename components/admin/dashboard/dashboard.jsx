"use client";

import React from "react";
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
import { Line } from "react-chartjs-2";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Separator } from "@/components/ui/separator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  // ===== Sahte veriler =====
  const kpiData = [
    {
      id: "products",
      title: "Ürünler",
      stat: "128",
      description: "Toplam ürünleri görüntüle ve yönet",
      icon: <Package size={24} color="#60A5FA" />,
      href: "/admin/products",
    },
    {
      id: "orders",
      title: "Siparişler",
      stat: "53",
      description: "Siparişleri takip et ve yönet",
      icon: <ShoppingCart size={24} color="#34D399" />,
      href: "/admin/orders",
    },
    {
      id: "subscribers",
      title: "Aboneler",
      stat: "432",
      description: "Abone listelerini görüntüle",
      icon: <CreditCard size={24} color="#FBBF24" />,
      href: "/admin/subscribers",
    },
    {
      id: "users",
      title: "Kullanıcılar",
      stat: "87",
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
  ];

  const chartFakeData = {
    labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
    datasets: [
      {
        label: "Satışlar",
        data: [12, 19, 14, 20, 18, 24],
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96,165,250,0.2)",
        tension: 0.4,
      },
      {
        label: "Yeni Kullanıcılar",
        data: [5, 10, 8, 12, 9, 14],
        borderColor: "#34D399",
        backgroundColor: "rgba(52,211,153,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#2c2c2c" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#2c2c2c" },
      },
    },
  };

  const recentOrders = [
    { id: "1024", total: 120 },
    { id: "1025", total: 89 },
    { id: "1026", total: 45 },
    { id: "1027", total: 200 },
  ];

  // =========================

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* KPI Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((card) => (
            <Link key={card.id} href={card.href}>
              <Card className="bg-stone-900 hover:bg-stone-800 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer">
                <CardHeader className="flex items-center space-x-4">
                  <div>{card.icon}</div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {card.title}
                    </CardTitle>
                    {card.stat && (
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

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-stone-900 rounded-xl shadow-lg p-4">
            <CardHeader>
              <CardTitle className={"text-white"}>
                Satış ve Kullanıcı Grafiği
              </CardTitle>
              <Separator className={"mt-2 "} />
            </CardHeader>
            <CardContent>
              <Line data={chartFakeData} options={chartOptions} />
            </CardContent>
          </Card>

          <Card className="bg-stone-900 rounded-xl shadow-lg p-4">
            <CardHeader>
              <CardTitle className={"text-white"}>Son Siparişler</CardTitle>
              <Separator className={"mt-2 "} />
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {recentOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex justify-between text-stone-200 border-b border-stone-800 pb-2"
                  >
                    <span>Order #{order.id}</span>
                    <span className="text-teal-400">${order.total}</span>
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
