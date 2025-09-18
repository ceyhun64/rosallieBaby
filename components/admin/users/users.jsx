"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";

// örnek başlangıç verisi
const initialUsers = [
  {
    id: 1,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    phone: "05001234567",
    email: "ahmet@example.com",
    addresses: [
      "İstanbul, Kadıköy, Moda Mah. No:12",
      "Ankara, Çankaya, Kızılay Cad. No:45",
    ],
  },
  {
    id: 2,
    firstName: "Ayşe",
    lastName: "Demir",
    phone: "05007654321",
    email: "ayse@example.com",
    addresses: ["İzmir, Konak, Alsancak Mah. No:33"],
  },
  {
    id: 3,
    firstName: "Mehmet",
    lastName: "Kaya",
    phone: "05009876543",
    email: "mehmet@example.com",
    addresses: ["Bursa, Nilüfer, FSM Bulvarı No:20"],
  },
];

export default function Users() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUsers.map((u) => u.id));
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
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      <Sidebar />

      <main
        className={`flex-1 p-4 md:p-8 ${
          isMobile ? "ml-0" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
            Kullanıcılar
          </h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
            <Button
              variant="default"
              className={`w-full md:w-auto ${
                selectedIds.length > 0
                  ? "hover:bg-red-600 cursor-pointer"
                  : "bg-stone-700 text-stone-400 cursor-not-allowed"
              }`}
              disabled={selectedIds.length === 0}
              onClick={() =>
                setUsers(users.filter((u) => !selectedIds.includes(u.id)))
              }
            >
              Seçilenleri Sil ({selectedIds.length})
            </Button>
            <Input
              type="text"
              placeholder="Ad, soyad veya email ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Kullanıcı Tablosu */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-stone-800 rounded-xl">
            <thead>
              <tr className="bg-stone-900">
                <th className="px-2 py-2 border-b border-stone-800">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === paginatedUsers.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-2 py-2 border-b border-stone-800">ID</th>
                <th className="px-2 py-2 border-b border-stone-800">Ad</th>
                <th className="px-2 py-2 border-b border-stone-800">Soyad</th>
                <th className="px-2 py-2 border-b border-stone-800">Telefon</th>
                <th className="px-2 py-2 border-b border-stone-800">Email</th>
                <th className="px-2 py-2 border-b border-stone-800">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-800">
                  <td className="px-2 py-2 border-b border-stone-800">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                    />
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.id}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.firstName}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.lastName}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.phone}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.email}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800 flex flex-col sm:flex-row gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          className="hover:bg-amber-600 w-full sm:w-auto"
                          onClick={() => setSelectedUser(user)}
                        >
                          Detay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-stone-900 text-white">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedUser?.firstName} {selectedUser?.lastName} -
                            Adresleri
                          </DialogTitle>
                          <DialogDescription>
                            Kullanıcıya kayıtlı adres bilgileri
                          </DialogDescription>
                        </DialogHeader>
                        <ul className="mt-4 space-y-2">
                          {selectedUser?.addresses?.map((addr, idx) => (
                            <li
                              key={idx}
                              className="border-b border-stone-700 pb-2"
                            >
                              {addr}
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="hover:bg-red-600 w-full sm:w-auto"
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
        <div className="mt-4 flex justify-center">
          <DefaultPagination
            totalItems={filteredUsers.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
}
