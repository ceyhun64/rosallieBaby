"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";

export default function Subscribers() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dinamik veri çek
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/subscribe");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p className="text-white p-4">Loading...</p>;

  // Filtreleme
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  // Tek kullanıcı silme
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Silme başarısız");

      setUsers(users.filter((u) => u.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Abone silinirken bir hata oluştu.");
    }
  };

  // Toplu silme
  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedIds) {
        const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Silme başarısız");
      }

      setUsers(users.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("Bulk delete failed:", err);
      alert("Seçilen aboneler silinirken bir hata oluştu.");
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

  const handleSendMail = async () => {
    const recipients =
      selectedIds.length > 0
        ? users.filter((u) => selectedIds.includes(u.id)).map((u) => u.email)
        : users.map((u) => u.email);

    if (!mailSubject || !mailMessage) {
      alert("Lütfen konu ve mesaj alanlarını doldurun.");
      return;
    }

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: mailSubject,
          message: mailMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Mail gönderilemedi.");
        return;
      }

      alert(`Mail başarıyla gönderildi! (${recipients.length} kişi)`);
      setMailSubject("");
      setMailMessage("");
    } catch (err) {
      console.error(err);
      alert("Mail gönderilirken bir hata oluştu.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Mobil sidebar toggler */}
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
          Aboneler
        </h1>

        {/* Mail Gönderme Alanı */}
        <div className="mb-8 p-6 bg-stone-900 rounded-xl shadow-lg w-full md:w-auto">
          <h2 className="text-xl font-semibold mb-4">Abonelere Mail Gönder</h2>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Konu"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400 w-full"
            />
            <Textarea
              placeholder="Mesajınızı yazın..."
              value={mailMessage}
              onChange={(e) => setMailMessage(e.target.value)}
              className="bg-black border border-stone-700 text-white placeholder-stone-400 min-h-[120px] w-full"
            />
            <Button
              onClick={handleSendMail}
              className="bg-amber-600 hover:bg-amber-500 text-white w-full md:w-1/8"
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

        {/* Arama ve Silme */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Button
            className={`w-full md:w-auto ${
              selectedIds.length > 0
                ? "hover:bg-red-600 cursor-pointer"
                : "bg-stone-700 text-stone-400 cursor-not-allowed"
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleDeleteSelected}
          >
            Seçilenleri Sil ({selectedIds.length})
          </Button>
          <Input
            type="text"
            placeholder="Email ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
          />
        </div>

        {/* Mobil kart görünümü */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-stone-900 p-4 rounded-xl shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {user.email} (#{user.id})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDelete(user.id)}
                      className="hover:bg-red-600"
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Masaüstü tablo */
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
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border-b border-stone-800 flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
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
        )}

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
