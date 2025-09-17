"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
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

export default function UpdateProductDialog({ product, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData({
        ...formData,
        [field]: url,
        [`${field}File`]: e.target.files[0],
      });
    }
  };

  const handleSave = () => {
    onUpdate(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="hover:bg-yellow-600">
          Güncelle
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-black text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle>Ürünü Güncelle</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 mt-4">
          {/* Sol taraf: Form */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Ürün Adı</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ürün Adı"
                className="bg-black border border-stone-700 text-white"
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
                  <SelectItem value="hospital-outfit-set">
                    Hospital Outfit Set
                  </SelectItem>
                  <SelectItem value="toy">Toy</SelectItem>
                  <SelectItem value="pillow">Pillow</SelectItem>
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
                className="bg-black border border-stone-700 text-white p-2 rounded resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Fiyat</Label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Fiyat"
                className="bg-black border border-stone-700 text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Eski Fiyat</Label>
              <Input
                name="oldPrice"
                type="number"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="Eski Fiyat"
                className="bg-black border border-stone-700 text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">İndirim (%)</Label>
              <Input
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                placeholder="İndirim (%)"
                className="bg-black border border-stone-700 text-white"
              />
            </div>

            {/* Ana Görsel */}
            <div className="flex flex-col gap-1 col-span-2">
              <Label className="text-sm font-medium">Ana Görsel</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "mainImage")}
                className="bg-black border border-stone-700 text-white p-2 rounded"
              />
            </div>

            {/* Alt Görseller */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-1">
                <Label className="text-sm font-medium">{`Alt Görsel ${i}`}</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, `subImage${i}`)}
                  className="bg-black border border-stone-700 text-white p-2 rounded"
                />
              </div>
            ))}
          </div>

          {/* Sağ taraf: Önizleme */}
          <div className="flex-1 border border-stone-700 p-4 rounded-xl bg-stone-900 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Önizleme</h3>

            <div className="flex gap-4 mb-4">
              {/* Ana Görsel */}
              <div className="flex-shrink-0">
                {formData.mainImage ? (
                  <img
                    src={formData.mainImage}
                    alt={formData.name}
                    className="w-40 h-64 object-cover rounded"
                  />
                ) : (
                  <div className="w-40 h-68 flex items-center justify-center bg-stone-800 rounded">
                    Ana Görsel
                  </div>
                )}
              </div>

              {/* Küçük görseller */}
              <div className="grid grid-cols-3 grid-rows-2 gap-2 flex-1">
                {[1, 2, 3, 4, 5, 6].map((i) => {
                  const img = formData[`subImage${i}`];
                  return (
                    <div
                      key={i}
                      className="w-20 h-32 bg-stone-800 rounded flex items-center justify-center overflow-hidden"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Alt Görsel ${i}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-stone-400">
                          Alt Görsel
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
          >
            Güncelle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
