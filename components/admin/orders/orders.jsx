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
import { Loader, Truck, CheckCircle } from "lucide-react";

// Örnek başlangıç sipariş verisi
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
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtreleme
  const filteredOrders = orders
    .filter(
      (o) =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // en yeni üstte

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  // Silme işlemi
  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  // Çoklu seçim
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedOrders.map((o) => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Siparişler</h1>
        </div>

        {/* Arama ve Silme */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Button
              variant="default"
              className={`${
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
          </div>

          <div className="flex gap-4 items-center">
            <Input
              type="text"
              placeholder="Müşteri adı veya email ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Sipariş Tablosu */}
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
                <th className="px-4 py-2 border-b border-stone-800">Müşteri</th>
                <th className="px-4 py-2 border-b border-stone-800">Email</th>
                <th className="px-4 py-2 border-b border-stone-800">Ürünler</th>
                <th className="px-4 py-2 border-b border-stone-800">Toplam</th>
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
                  <td className="px-4 py-2  border-stone-800 flex items-center gap-2">
                    {order.status === "Hazırlanıyor" && (
                      <Badge
                        className={"bg-yellow-500 flex items-center gap-2"}
                        variant="warning"
                      >
                        <Loader className="w-5 h-5 animate-spin" />
                        Hazırlanıyor
                      </Badge>
                    )}
                    {order.status === "Kargoda" && (
                      <Badge
                        className={"bg-amber-600 flex items-center gap-2"}
                        variant="warning"
                      >
                        <Truck className="w-5 h-5" />
                        Kargoda
                      </Badge>
                    )}
                    {order.status === "Teslim Edildi" && (
                      <Badge
                        className={"bg-green-600 flex items-center gap-2"}
                        variant="success"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Teslim Edildi
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {order.date}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800 flex gap-2">
                    {/* Detay Dialogu */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          className="hover:bg-amber-600"
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

                    {/* Sil Butonu */}
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

        {/* Pagination */}
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
