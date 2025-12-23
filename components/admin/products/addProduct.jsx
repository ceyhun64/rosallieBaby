"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AddProductDialog({
  newProduct,
  setNewProduct,
  handleAddProduct,
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState({
    mainImage: null,
    subImages: Array(6).fill(null),
  });
  const isMobile = useIsMobile();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e, index = null, isMain = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (isMain) {
      setFiles({ ...files, mainImage: file });
      setNewProduct({ ...newProduct, mainImage: previewUrl });
    } else if (index !== null) {
      const updatedFiles = [...files.subImages];
      updatedFiles[index] = file;
      setFiles({ ...files, subImages: updatedFiles });

      const updatedPreviews = [...newProduct.subImages];
      updatedPreviews[index] = previewUrl;
      setNewProduct({ ...newProduct, subImages: updatedPreviews });
    }
  };

  const handleSubmit = async () => {
    if (!files.mainImage) {
      alert("Ana görsel zorunludur!");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Form alanları
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("oldPrice", newProduct.oldPrice);
      formData.append("price", newProduct.price);
      formData.append("discount", newProduct.discount);
      formData.append("category", newProduct.category);

      // ✔️ CUSTOMNAME EKLENDİ
      formData.append("customName", newProduct.customName ? "true" : "false");

      // Ana görsel
      formData.append("mainImage", files.mainImage);

      // Alt görseller
      files.subImages.forEach((file, index) => {
        if (file) {
          formData.append(`subImage${index}`, file);
        }
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ürün eklenirken hata oluştu");
      }

      const data = await res.json();

      handleAddProduct(data.product);

      setNewProduct({
        name: "",
        mainImage: "",
        description: "",
        oldPrice: "",
        price: "",
        discount: "",
        category: "",
        customName: false, // ✔️ reset
        subImages: Array(6).fill(""),
      });

      setFiles({
        mainImage: null,
        subImages: Array(6).fill(null),
      });

      setOpen(false);
      alert("Ürün başarıyla eklendi!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button
        className={"hover:bg-amber-600"}
        variant="default"
        onClick={() => setOpen(true)}
      >
        Yeni Ürün Ekle
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
          </DialogHeader>

          <div className="flex gap-6 mt-4 flex-col md:flex-row">
            {/* Form */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Ürün Adı */}
              <div className="flex flex-col gap-1">
                <Label>Ürün Adı</Label>
                <Input
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  placeholder="Ürün Adı"
                  className="bg-black border border-stone-700 text-white"
                />
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-1">
                <Label>Kategori</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(v) =>
                    setNewProduct({ ...newProduct, category: v })
                  }
                >
                  <SelectTrigger className="bg-black border border-stone-700 text-white w-full">
                    <SelectValue placeholder="Kategori Seç" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-stone-700 text-white">
                    <SelectItem value="hospital_outfit_special_set">
                      Hospital Outfit Special Set
                    </SelectItem>
                    <SelectItem value="hospital_outfit_set">
                      Hospital Outfit Set
                    </SelectItem>
                    <SelectItem value="toy">Toy</SelectItem>
                    <SelectItem value="blanket">Blanket</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Açıklama */}
              <div className="flex flex-col gap-1 col-span-2">
                <Label>Açıklama</Label>
                <Input
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  placeholder="Açıklama"
                  className="bg-black border border-stone-700 text-white"
                />
              </div>

              {/* ✔️ CUSTOMNAME (True / False) */}
              <div className="flex flex-col gap-1">
                <Label>İsim Özelleştirme</Label>
                <Select
                  value={newProduct.customName ? "true" : "false"}
                  onValueChange={(v) =>
                    setNewProduct({ ...newProduct, customName: v === "true" })
                  }
                >
                  <SelectTrigger className="bg-black border border-stone-700 text-white w-full">
                    <SelectValue placeholder="Seç" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-stone-700 text-white">
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ana Görsel */}
              <div className="flex flex-col gap-1">
                <Label>Ana Görsel *</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, null, true)}
                  disabled={uploading}
                  className="bg-black border border-stone-700 p-2 rounded"
                />
              </div>

              {/* Alt Görseller */}
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <Label>Alt Görsel {idx + 1}</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, idx)}
                    disabled={uploading}
                    className="bg-black border border-stone-700 p-2 rounded"
                  />
                </div>
              ))}

              {/* Fiyat */}
              <div className="flex flex-col gap-1">
                <Label>Fiyat</Label>
                <Input
                  name="price"
                  type="text"
                  value={newProduct.price}
                  onChange={handleChange}
                  className="bg-black border border-stone-700 text-white"
                />
              </div>

              {/* Eski Fiyat */}
              <div className="flex flex-col gap-1">
                <Label>Eski Fiyat</Label>
                <Input
                  name="oldPrice"
                  type="text"
                  value={newProduct.oldPrice}
                  onChange={handleChange}
                  className="bg-black border border-stone-700 text-white"
                />
              </div>

              {/* İndirim */}
              <div className="flex flex-col gap-1">
                <Label>İndirim (%)</Label>
                <Input
                  name="discount"
                  type="text"
                  value={newProduct.discount}
                  onChange={handleChange}
                  className="bg-black border border-stone-700 text-white"
                />
              </div>
            </div>

            {/* Sağ Önizleme */}
            <div className="hidden md:flex flex-1 border border-stone-700 p-4 rounded-xl bg-stone-900 flex-col">
              <h3 className="text-xl font-semibold mb-4">Önizleme</h3>

              {uploading && (
                <div className="mb-4 p-2 bg-amber-600 text-black rounded text-sm">
                  Ürün ekleniyor, lütfen bekleyin...
                </div>
              )}

              <div className="flex gap-4 mb-4">
                {/* Ana görsel */}
                <div className="flex-shrink-0">
                  {newProduct.mainImage ? (
                    <img
                      src={newProduct.mainImage}
                      className="w-40 h-64 object-cover rounded"
                    />
                  ) : (
                    <div className="w-40 h-64 bg-stone-800 rounded flex items-center justify-center">
                      Ana Görsel
                    </div>
                  )}
                </div>

                {/* Alt görseller */}
                <div className="grid grid-cols-3 grid-rows-2 gap-2 flex-1">
                  {newProduct.subImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-32 bg-stone-800 rounded flex items-center justify-center overflow-hidden"
                    >
                      {img ? (
                        <img src={img} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-stone-400">
                          Alt Görsel
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <CardContent className="p-4 bg-stone-900 border-t border-stone-700 rounded-b-xl">
                <h3 className="text-lg font-bold">
                  {newProduct.name || "Ürün Adı"}
                </h3>
                <span className="text-sm text-stone-400">
                  {newProduct.category || "-"}
                </span>

                <p className="text-sm mt-2">
                  {newProduct.description || "Açıklama"}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-semibold text-lg">
                      ${newProduct.price || "-"}
                    </span>
                    {newProduct.oldPrice && (
                      <span className="line-through text-stone-400 text-sm">
                        ${newProduct.oldPrice}
                      </span>
                    )}
                  </div>
                  <span className="bg-green-600 text-black text-xs font-semibold px-2 py-1 rounded">
                    %{newProduct.discount || 0} İndirim
                  </span>
                </div>
              </CardContent>

              {/* ✔️ CUSTOMNAME ÖNİZLEME */}
              <div className="mt-4 text-sm">
                İsim Özelleştirme:{" "}
                <span className="font-bold">
                  {newProduct.customName ? "Aktif" : "Pasif"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-orange-400 text-white"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? "Ekleniyor..." : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
