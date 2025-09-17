"use client";

import React, { useState } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultPagination from "@/components/layout/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default function Subscribers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // mail form state
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");

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

  const handleSendMail = () => {
    const recipients =
      selectedIds.length > 0
        ? users.filter((u) => selectedIds.includes(u.id)).map((u) => u.email)
        : users.map((u) => u.email);

    console.log("Kime:", recipients);
    console.log("Konu:", mailSubject);
    console.log("Mesaj:", mailMessage);

    alert(
      `Mail gönderildi!\nKime: ${recipients.join(
        ", "
      )}\nKonu: ${mailSubject}\nMesaj: ${mailMessage}`
    );

    // reset
    setMailSubject("");
    setMailMessage("");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kullanıcılar Listesi</h1>
        </div>

        {/* Abonelere Mail Atma Alanı */}
        <div className="mb-8 p-6 bg-stone-900 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Abonelere Mail Gönder</h2>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Konu"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400"
            />
            <Textarea
              placeholder="Mesajınızı yazın..."
              value={mailMessage}
              onChange={(e) => setMailMessage(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400 min-h-[120px]"
            />
            <Button
              onClick={handleSendMail}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Mail Gönder
            </Button>
          </div>
          <p className="mt-2 text-sm text-stone-400">
            {selectedIds.length > 0
              ? `Seçilen ${selectedIds.length} kullanıcıya gönderilecek.`
              : "Tüm abonelere gönderilecek."}
          </p>
        </div>

        {/* Arama */}
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
                setUsers(users.filter((u) => !selectedIds.includes(u.id)))
              }
            >
              Seçilenleri Sil ({selectedIds.length})
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <Input
              type="text"
              placeholder="Ad, soyad veya email ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Kullanıcı Tablosu */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-stone-800 rounded-xl">
            <thead>
              <tr className="bg-stone-900">
                <th className="px-4 py-2 border-b border-stone-800">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === paginatedUsers.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 border-b border-stone-800">ID</th>
                <th className="px-4 py-2 border-b border-stone-800">Ad</th>
                <th className="px-4 py-2 border-b border-stone-800">Soyad</th>
                <th className="px-4 py-2 border-b border-stone-800">Telefon</th>
                <th className="px-4 py-2 border-b border-stone-800">Email</th>
                <th className="px-4 py-2 border-b border-stone-800">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-800">
                  <td className="px-4 py-2 border-b border-stone-800">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {user.phone}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800 flex gap-2">
                    {/* Detay Butonu */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          className=" hover:bg-amber-600"
                          onClick={() => setSelectedUser(user)}
                        >
                          Detay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-stone-900 text-white">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedUser?.firstName} {selectedUser?.lastName} -{" "}
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

                    {/* Sil Butonu */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
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
