"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog/admin", { cache: "no-store" });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setBlogs(data.posts || []);
      } catch (err) {
        console.error("Blog çekerken hata:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs
    .filter((b) => {
      if (filter === "all") return true;
      if (filter === "published") return b.published;
      if (filter === "draft") return !b.published;
      return b.category?.toLowerCase() === filter;
    })
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handleDelete = async (id) => {
    if (!confirm("Bu blogu silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/blog/admin/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silme başarısız");
      setBlogs(blogs.filter((b) => b.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } catch (err) {
      console.error(err);
      alert("Blog silinirken hata oluştu.");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedBlogs.map((b) => b.id));
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

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Seçilen ${selectedIds.length} blogu silmek istiyor musunuz?`))
      return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/blog/admin/${id}`, { method: "DELETE" })
        )
      );
      setBlogs(blogs.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Seçilen bloglar silinirken hata oluştu.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      <Sidebar />

      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "ml-0" : "ml-64"}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
          Blog Yönetimi
        </h1>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="default"
              className={`w-full sm:w-auto ${
                selectedIds.length > 0
                  ? "hover:bg-red-600 cursor-pointer"
                  : "bg-stone-700 text-stone-400 cursor-not-allowed"
              }`}
              disabled={selectedIds.length === 0}
              onClick={handleDeleteSelected}
            >
              Seçilenleri Sil ({selectedIds.length})
            </Button>

            <Link href="/admin/blog/new">
              <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
                <Plus size={18} className="mr-2" />
                Yeni Blog Ekle
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Select onValueChange={(val) => setFilter(val)} defaultValue="all">
              <SelectTrigger className="w-full sm:w-48 bg-black border border-stone-700 text-white">
                <SelectValue placeholder="Filtrele" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-stone-700">
                <SelectItem value="all">Tüm Bloglar</SelectItem>
                <SelectItem value="published">Yayınlanmış</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Başlığa göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-stone-400">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-stone-800 rounded-xl">
              <thead>
                <tr className="bg-stone-900">
                  <th className="px-4 py-2 border-b border-stone-800">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === paginatedBlogs.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">ID</th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    Başlık
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    Kategori
                  </th>
                  <th className="px-4 py-2 border-b border-stone-800">Durum</th>
                  <th className="px-4 py-2 border-b border-stone-800">Tarih</th>
                  <th className="px-4 py-2 border-b border-stone-800">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-stone-500"
                    >
                      Henüz blog yazısı yok
                    </td>
                  </tr>
                ) : (
                  paginatedBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-stone-800">
                      <td className="px-4 py-2 border-b border-stone-800">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => handleSelectOne(blog.id)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800">
                        {blog.id}
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800 max-w-xs truncate">
                        {blog.title}
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800">
                        {blog.category}
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800">
                        {blog.published ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <Eye size={14} /> Yayında
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <EyeOff size={14} /> Taslak
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString(
                              "tr-TR"
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border-b border-stone-800">
                        <div className="flex gap-2">
                          <Link href={`/admin/blog/${blog.id}/edit`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-stone-600"
                            >
                              <Edit size={14} />
                            </Button>
                          </Link>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
                            className="hover:bg-red-600"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {filteredBlogs.length > 10 && (
          <div className="mt-4">
            <DefaultPagination
              totalItems={filteredBlogs.length}
              itemsPerPage={10}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
