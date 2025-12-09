"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import { X } from "lucide-react";
import { toast } from "sonner";

export default function UpdateProductDialog({ product, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(product);
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState({});
  const [removedImages, setRemovedImages] = useState(new Set());

  useEffect(() => {
    if (product) {
      setFormData(product);
      setNewFiles({});
      setRemovedImages(new Set());
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = (field) => {
    if (field === "mainImage") {
      setFormData({ ...formData, mainImage: "" });
      setNewFiles((prev) => {
        const updated = { ...prev };
        delete updated.mainImage;
        return updated;
      });
    } else {
      // Alt görsel index'ini bul
      const match = field.match(/subImage(\d+)/);
      if (match) {
        const index = parseInt(match[1]) - 1;
        setRemovedImages((prev) => new Set([...prev, index]));
        setNewFiles((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    }
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      if (field === "mainImage") {
        setFormData({ ...formData, mainImage: url });
      } else {
        // Alt görsel için index'i çıkar
        const match = field.match(/subImage(\d+)/);
        if (match) {
          const index = parseInt(match[1]) - 1;
          setRemovedImages((prev) => {
            const updated = new Set(prev);
            updated.delete(index);
            return updated;
          });
        }
      }

      setNewFiles((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();

      // Text alanları ekle
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price?.toString() || "0");
      data.append("oldPrice", formData.oldPrice?.toString() || "0");
      data.append("discount", formData.discount?.toString() || "0");

      // Ana görsel
      if (newFiles.mainImage) {
        data.append("mainImage", newFiles.mainImage);
      } else if (formData.mainImage) {
        data.append("mainImageUrl", formData.mainImage);
      }

      // Yeni alt görseller
      for (let i = 1; i <= 6; i++) {
        const fieldName = `subImage${i}`;
        if (newFiles[fieldName]) {
          data.append(fieldName, newFiles[fieldName]);
        }
      }

      // Silinmeyen eski alt görseller
      const existingSubImages = (formData.subImages || [])
        .filter((img, idx) => !removedImages.has(idx))
        .filter((img) => typeof img === "object" && img.url)
        .map((img) => img.url);

      if (existingSubImages.length > 0) {
        data.append("existingSubImages", JSON.stringify(existingSubImages));
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${product.id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Güncelleme başarısız");
        throw new Error(err.error || "Güncelleme başarısız");
      }

      const updated = await res.json();
      onUpdate(updated.product);

      toast.success("Ürün başarıyla güncellendi!");

      setOpen(false);
      setNewFiles({});
      setRemovedImages(new Set());
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getSubImagePreview = (index) => {
    const fieldName = `subImage${index + 1}`;

    // Yeni dosya seçildiyse onu göster
    if (newFiles[fieldName]) {
      return URL.createObjectURL(newFiles[fieldName]);
    }

    // Silinmediyse ve mevcut görsel varsa onu göster
    if (
      !removedImages.has(index) &&
      formData.subImages &&
      formData.subImages[index]
    ) {
      return formData.subImages[index].url;
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hover:bg-yellow-600">
          Güncelle
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ürünü Güncelle</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 mt-4 flex-col md:flex-row">
          {/* Sol taraf: Form */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Ürün Adı</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ürün Adı"
                className="bg-black border border-stone-700 text-white w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger className="bg-black border border-stone-700 text-white w-full">
                  <SelectValue placeholder="Kategori Seç" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border border-stone-700">
                  <SelectItem value="hospital_outfit_special_set">
                    Hospital Outfit Special Set
                  </SelectItem>
                  <SelectItem value="hospital_outfit_set">
                    Hospital Outfit Set
                  </SelectItem>
                  <SelectItem value="toy">Toy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1 col-span-2">
              <Label className="text-sm font-medium">Açıklama</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Açıklama"
                className="bg-black border border-stone-700 text-white p-2 rounded resize-none w-full"
              />
            </div>

            {["price", "oldPrice", "discount"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <Label className="text-sm font-medium">
                  {field === "oldPrice"
                    ? "Eski Fiyat"
                    : field === "discount"
                    ? "İndirim (%)"
                    : "Fiyat"}
                </Label>
                <Input
                  name={field}
                  type="number"
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="bg-black border border-stone-700 text-white w-full"
                />
              </div>
            ))}

            {/* Ana Görsel */}
            <div className="flex flex-col gap-1 col-span-2">
              <Label className="text-sm font-medium">Ana Görsel</Label>

              {formData.mainImage || newFiles.mainImage ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2 bg-stone-800 rounded text-sm truncate">
                    {newFiles.mainImage
                      ? "Yeni görsel seçildi"
                      : "Mevcut görsel"}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage("mainImage")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "mainImage")}
                  className="bg-black border border-stone-700 text-white p-2 rounded w-full"
                />
              )}
            </div>

            {/* Alt Görseller */}
            {[1, 2, 3, 4, 5, 6].map((i) => {
              const fieldName = `subImage${i}`;
              const hasImage = getSubImagePreview(i - 1);

              return (
                <div key={i} className="flex flex-col gap-1">
                  <Label className="text-sm font-medium">{`Alt Görsel ${i}`}</Label>

                  {hasImage ? (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 bg-stone-800 rounded text-sm truncate">
                        {newFiles[fieldName] ? "Yeni görsel" : "Mevcut görsel"}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveImage(fieldName)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, fieldName)}
                      className="bg-black border border-stone-700 text-white p-2 rounded w-full"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Sağ taraf: Önizleme */}
          <div className="hidden md:flex flex-1 border border-stone-700 p-4 rounded-xl bg-stone-900 flex-col">
            <h3 className="text-xl font-semibold mb-4">Önizleme</h3>

            <div className="flex gap-4 mb-4">
              {/* Ana Görsel */}
              <div className="flex-shrink-0">
                {formData.mainImage || newFiles.mainImage ? (
                  <img
                    src={
                      newFiles.mainImage
                        ? URL.createObjectURL(newFiles.mainImage)
                        : formData.mainImage
                    }
                    alt={formData.name}
                    className="w-40 h-64 object-cover rounded"
                  />
                ) : (
                  <div className="w-40 h-64 flex items-center justify-center bg-stone-800 rounded">
                    <span className="text-xs text-stone-400">Ana Görsel</span>
                  </div>
                )}
              </div>

              {/* Alt görseller */}
              <div className="grid grid-cols-3 grid-rows-2 gap-2 flex-1">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const preview = getSubImagePreview(idx);

                  return (
                    <div
                      key={idx}
                      className="w-20 h-32 bg-stone-800 rounded flex items-center justify-center overflow-hidden"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt={`Alt Görsel ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-stone-400">
                          Alt {idx + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <CardContent className="p-4 flex flex-col gap-2 bg-stone-900 border-t border-stone-700 rounded-b-xl">
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white">
                  {formData.name || "Ürün Adı"}
                </h3>
                <span className="text-sm text-stone-400">
                  {formData.category || "-"}
                </span>
              </div>
              <p className="text-sm text-stone-200">
                {formData.description || "Açıklama"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-white font-semibold text-lg">
                    ${formData.price || "-"}
                  </span>
                  {formData.oldPrice && (
                    <span className="line-through text-stone-400 text-sm">
                      ${formData.oldPrice}
                    </span>
                  )}
                </div>
                <span className="bg-green-600 text-black text-xs font-semibold px-2 py-1 rounded">
                  %{formData.discount || 0} İndirim
                </span>
              </div>
            </CardContent>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            className="bg-green-600 hover:bg-green-500"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Kaydediliyor..." : "Güncelle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
