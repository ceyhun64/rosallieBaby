"use client";

import React, { useState } from "react";
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
import initialProducts from "@/seed/products";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Products() {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [newProduct, setNewProduct] = useState({
    name: "",
    mainImage: "",
    subImage1: "",
    description: "",
    oldPrice: "",
    price: "",
    discount: "",
    category: "",
  });

  const filteredProducts = products
    .filter((p) => (filter === "all" ? true : p.category === filter))
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * 15,
    currentPage * 15
  );

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    setProducts([...products, { ...newProduct, id }]);
    setNewProduct({
      name: "",
      mainImage: "",
      subImage1: "",
      description: "",
      oldPrice: "",
      price: "",
      discount: "",
      category: "",
    });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    setSelectedIds(selectedIds.filter((sid) => sid !== id));
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

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      <main className={`flex-1 p-4 md:p-8 ${isMobile ? "ml-0" : "ml-64"}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 ms-12 mt-2">
          Product List
        </h1>

        {/* Filter & Add */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between">
          {/* Sol taraf: Toplu Silme ve Ekleme */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="default"
              className={`w-full sm:w-auto ${
                selectedIds.length > 0
                  ? "hover:bg-red-600 cursor-pointer"
                  : "bg-stone-700 text-stone-400 cursor-not-allowed"
              }`}
              disabled={selectedIds.length === 0}
              onClick={() =>
                setProducts(products.filter((p) => !selectedIds.includes(p.id)))
              }
            >
              Delete Selected ({selectedIds.length})
            </Button>

            <AddProductDialog
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleChange={handleChange}
              handleAddProduct={handleAddProduct}
              className="w-full sm:w-auto"
            />
          </div>

          {/* Sağ taraf: Filtre ve Arama */}
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
                  value="hospital-outfit-set"
                  className="hover:bg-stone-800"
                >
                  Hospital Outfit Set
                </SelectItem>
                <SelectItem value="toy" className="hover:bg-stone-800">
                  Toy
                </SelectItem>
                <SelectItem value="pillow" className="hover:bg-stone-800">
                  Pillow
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 bg-black border border-stone-700 text-white placeholder-stone-400"
            />
          </div>
        </div>

        {/* Table */}
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
                <th className="px-4 py-2 border-b border-stone-800">Name</th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Category
                </th>
                <th className="px-4 py-2 border-b border-stone-800">Price</th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Old Price
                </th>
                <th className="px-4 py-2 border-b border-stone-800">
                  Discount (%)
                </th>
                <th className="px-4 py-2 border-b border-stone-800">Actions</th>
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
                      Delete
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
