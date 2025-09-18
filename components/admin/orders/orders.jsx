"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Truck, CheckCircle, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Örnek sipariş verisi
const initialOrders = [
  {
    id: 101,
    customer: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    products: ["Bebek Bezi", "Oyuncak Ayı"],
    total: "450₺",
    status: "Hazırlanıyor",
    date: "2025-09-15",
    address: "İstanbul, Kadıköy, Moda Mah. No:12",
  },
  {
    id: 102,
    customer: "Ayşe Demir",
    email: "ayse@example.com",
    products: ["Bebek Arabası"],
    total: "2500₺",
    status: "Kargoda",
    date: "2025-09-16",
    address: "İzmir, Konak, Alsancak Mah. No:33",
  },
  {
    id: 103,
    customer: "Mehmet Kaya",
    email: "mehmet@example.com",
    products: ["Biberon Seti", "Mama Sandalyesi"],
    total: "850₺",
    status: "Teslim Edildi",
    date: "2025-09-17",
    address: "Bursa, Nilüfer, FSM Bulvarı No:20",
  },
];

export default function Orders() {
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredOrders = orders
    .filter(
      (o) =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(paginatedOrders.map((o) => o.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar mobil açma butonu */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-stone-900 rounded-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
      )}

      <Sidebar
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64">
        <h1 className="text-3xl font-bold mb-6 ms-12 mt-2">Siparişler</h1>

        {/* Arama ve toplu silme */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button
            className={`w-full md:w-auto ${
              selectedIds.length > 0
                ? "hover:bg-red-600 cursor-pointer"
                : "bg-stone-700 text-stone-400 cursor-not-allowed"
            }`}
            disabled={selectedIds.length === 0}
            onClick={() =>
              setOrders(orders.filter((o) => !selectedIds.includes(o.id)))
            }
          >
            Seçilenleri Sil ({selectedIds.length})
          </Button>

          <Input
            type="text"
            placeholder="Müşteri adı veya email ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
          />
        </div>

        {/* Mobil kart görünümü */}
        {isMobile && (
          <div className="flex flex-col gap-4">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-stone-900 p-4 rounded-xl shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">#{order.id}</span>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Detay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-stone-900 text-white">
                        <DialogHeader>
                          <DialogTitle>Sipariş #{order.id} Detayı</DialogTitle>
                          <DialogDescription>
                            {order.customer} - {order.email}
                          </DialogDescription>
                        </DialogHeader>
                        <p>
                          <strong>Adres:</strong> {selectedOrder?.address}
                        </p>
                        <p>
                          <strong>Ürünler:</strong>{" "}
                          {selectedOrder?.products?.join(", ")}
                        </p>
                        <p>
                          <strong>Durum:</strong> {selectedOrder?.status}
                        </p>
                        <p>
                          <strong>Tarih:</strong> {selectedOrder?.date}
                        </p>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDelete(order.id)}
                      className="hover:bg-red-600"
                    >
                      Sil
                    </Button>
                  </div>
                </div>
                <p>
                  <strong>Müşteri:</strong> {order.customer}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Ürünler:</strong> {order.products.join(", ")}
                </p>
                <p>
                  <strong>Toplam:</strong> {order.total}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Durum:</strong>
                  {order.status === "Hazırlanıyor" && (
                    <Badge className="bg-yellow-500 flex items-center gap-1">
                      <Loader className="w-4 h-4 animate-spin" />
                      Hazırlanıyor
                    </Badge>
                  )}
                  {order.status === "Kargoda" && (
                    <Badge className="bg-amber-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Kargoda
                    </Badge>
                  )}
                  {order.status === "Teslim Edildi" && (
                    <Badge className="bg-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Teslim Edildi
                    </Badge>
                  )}
                </p>
                <p>
                  <strong>Tarih:</strong> {order.date}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Masaüstü tablo */}
        {!isMobile && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-stone-800 rounded-xl">
              <thead>
                <tr className="bg-stone-900">
                  <th className="px-4 py-2 border-b border-stone-800">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === paginatedOrders.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">ID</th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    Müşteri
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">Email</th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    Ürünler
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    Toplam
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">Durum</th>
                  <th className="px-4 py-2 border-b border-stone-800">Tarih</th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-800">
                    <td className="px-4 py-2 border-b border-stone-800">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => handleSelectOne(order.id)}
                      />
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.customer}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.email}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.products.join(", ")}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.total}
                    </td>
                    <td className="px-4 py-2 border-stone-800 flex items-center gap-2">
                      {order.status === "Hazırlanıyor" && (
                        <Badge className="bg-yellow-500 flex items-center gap-2">
                          Hazırlanıyor
                        </Badge>
                      )}
                      {order.status === "Kargoda" && (
                        <Badge className="bg-amber-600 flex items-center gap-2">
                          Kargoda
                        </Badge>
                      )}
                      {order.status === "Teslim Edildi" && (
                        <Badge className="bg-green-600 flex items-center gap-2">
                          Teslim Edildi
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800">
                      {order.date}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Detay
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-stone-900 text-white">
                          <DialogHeader>
                            <DialogTitle>
                              Sipariş #{order.id} Detayı
                            </DialogTitle>
                            <DialogDescription>
                              {order.customer} - {order.email}
                            </DialogDescription>
                          </DialogHeader>
                          <p>
                            <strong>Adres:</strong> {selectedOrder?.address}
                          </p>
                          <p>
                            <strong>Ürünler:</strong>{" "}
                            {selectedOrder?.products?.join(", ")}
                          </p>
                          <p>
                            <strong>Durum:</strong> {selectedOrder?.status}
                          </p>
                          <p>
                            <strong>Tarih:</strong> {selectedOrder?.date}
                          </p>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        className="hover:bg-red-600"
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sayfalama */}
        <div className="mt-4">
          <DefaultPagination
            totalItems={filteredOrders.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
}
