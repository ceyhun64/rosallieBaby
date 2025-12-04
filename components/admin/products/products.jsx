"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/admin/sideBar";
import AddProductDialog from "./addProduct";
import UpdateProductDialog from "./updateProduct";
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

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newProduct, setNewProduct] = useState({
    name: "",
    mainImage: "",
    subImages: Array(6).fill(""),
    description: "",
    oldPrice: "",
    price: "",
    discount: "",
    category: "",
  });
  const isMobile = useIsMobile();

  // Dinamik API fetch
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Ürünleri çekerken hata:", err);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) =>
      filter === "all" ? true : p.category.toLowerCase() === filter
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const handleAddProduct = (newProductData) => {
    // Yeni ürünü state'e ekle
    setProducts((prev) => [newProductData, ...prev]);

    // Formu sıfırla
    setNewProduct({
      name: "",
      mainImage: "",
      subImages: Array(6).fill(""),
      description: "",
      oldPrice: "",
      price: "",
      discount: "",
      category: "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Ürün silinirken hata oluştu");

      // Başarılıysa state'i güncelle
      setProducts(products.filter((p) => p.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } catch (err) {
      console.error(err);
      alert("Ürün silinirken bir hata oluştu.");
    }
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
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
    if (
      !confirm(
        `Seçilen ${selectedIds.length} ürünü silmek istediğinize emin misiniz?`
      )
    )
      return;

    try {
      // Her bir id için DELETE isteği gönder
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`, {
            method: "DELETE",
          }).then((res) => {
            if (!res.ok) throw new Error(`Ürün ${id} silinirken hata oluştu`);
          })
        )
      );

      // State güncelle
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      alert("Seçilen ürünler başarıyla silindi!");
    } catch (err) {
      console.error(err);
      alert("Seçilen ürünler silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      <Sidebar />

      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "ml-0" : "ml-64"}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
          Ürün Listesi
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

            <AddProductDialog
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleAddProduct={handleAddProduct}
              className="w-full sm:w-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Select
              onValueChange={(val) => setFilter(val)}
              defaultValue="all"
              className="w-full sm:w-48"
            >
              <SelectTrigger className="w-full bg-black border border-stone-700 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-stone-700">
                <SelectItem value="all" className="hover:bg-stone-800">
                  All Products
                </SelectItem>
                <SelectItem
                  value="hospital_outfit_special_set"
                  className="hover:bg-stone-800"
                >
                  Hospital Outfit Special Set
                </SelectItem>
                <SelectItem
                  value="hospital_outfit_set"
                  className="hover:bg-stone-800"
                >
                  Hospital Outfit Set
                </SelectItem>
                <SelectItem value="toy" className="hover:bg-stone-800">
                  Toy
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="İsme göre ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-stone-800 rounded-xl">
            <thead>
              <tr className="bg-stone-900">
                <th className="px-4 py-2 border-b border-stone-800">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === paginatedProducts.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 border-b border-stone-800">ID</th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Ürün Adı
                </th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Kategori
                </th>
                <th className="px-4 py-2 border-b border-stone-800">Fiyat</th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Eski Fiyat
                </th>
                <th className="px-4 py-2 border-b border-stone-800">
                  İndirim (%)
                </th>
                <th className="px-4 py-2 border-b border-stone-800">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-stone-800">
                  <td className="px-4 py-2 border-b border-stone-800">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => handleSelectOne(product.id)}
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {product.id}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {product.category}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    ${product.price}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    ${product.oldPrice}
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800">
                    {product.discount}%
                  </td>
                  <td className="px-4 py-2 border-b border-stone-800 flex flex-wrap gap-2">
                    <UpdateProductDialog
                      product={product}
                      onUpdate={handleUpdate}
                    />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
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

        <div className="mt-4">
          <DefaultPagination
            totalItems={filteredProducts.length}
            itemsPerPage={15}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
}
