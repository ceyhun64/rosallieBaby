"use client";

import React, { useState, useEffect } from "react";
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

export default function Users() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dinamik olarak kullanıcıları fetch et
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user/all"); // yeni route: tüm kullanıcılar
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          console.error(data.error || "Kullanıcılar alınamadı");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;

  // Filtreleme
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.surname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/user/all/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silme başarısız");

      // Eğer başarılıysa state'i güncelle
      setUsers(users.filter((u) => u.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } catch (err) {
      console.error(err);
      alert("Kullanıcı silinirken bir hata oluştu");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Seçilen kullanıcıları sırayla sil
      for (const id of selectedIds) {
        const res = await fetch(`/api/user/all/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Silme başarısız");
      }

      // State'i güncelle
      setUsers(users.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Seçilen kullanıcılar silinirken bir hata oluştu");
    }
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
              onClick={() => handleDeleteSelected()}
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
                  Adresler
                </th>
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
                    {user.name}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.surname}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.phone || "-"}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    {user.email}
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="default"
                          className="hover:bg-amber-600"
                          onClick={() => setSelectedUser(user)}
                        >
                          Adresleri Gör
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-stone-900 text-white">
                        <DialogHeader>
                          <DialogTitle>
                            {user.name} {user.surname} - Adresleri
                          </DialogTitle>
                          <DialogDescription>
                            Kullanıcıya kayıtlı adresler
                          </DialogDescription>
                        </DialogHeader>
                        <ul className="mt-4 space-y-2">
                          {user.addresses?.map((addr) => (
                            <li
                              key={addr.id}
                              className="border-b border-stone-700 pb-2"
                            >
                              {addr.title}: {addr.address}, {addr.city}
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="px-2 py-2 border-b border-stone-800 flex flex-col sm:flex-row gap-2">
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
