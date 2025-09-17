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

export default function AddProductDialog({
  newProduct,
  setNewProduct,
  handleChange,
  handleAddProduct,
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    handleAddProduct();
    setOpen(false);
  };

  return (
    <>
      <Button className={"hover:bg-amber-600"} variant="default" onClick={() => setOpen(true)}>
        Yeni Ürün Ekle
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
          </DialogHeader>

          {/* İki sütunlu düzen */}
          <div className="flex gap-6 mt-4">
            {/* Sol taraf: Form */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Ürün Adı</Label>
                <Input
                  name="name"
                  value={newProduct.name}
                  onChange={handleChange}
                  placeholder="Ürün Adı"
                  className="bg-black border border-stone-700 text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Kategori</Label>
                <Select
                  name="category"
                  value={newProduct.category}
                  onValueChange={(val) =>
                    setNewProduct({ ...newProduct, category: val })
                  }
                  defaultValue="hospital-outfit-set"
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
                  value={newProduct.description}
                  onChange={handleChange}
                  placeholder="Açıklama"
                  className="bg-black border border-stone-700 text-white p-2 rounded resize-none "
                />
              </div>

              {/* Ana görsel */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Ana Görsel</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      mainImage: e.target.files
                        ? URL.createObjectURL(e.target.files[0])
                        : "",
                      mainFile: e.target.files ? e.target.files[0] : null,
                    })
                  }
                  className="bg-black border border-stone-700 text-white p-2 rounded"
                />
              </div>

              {/* Alt görseller için 6 dosya input */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Label className="text-sm font-medium">{`Alt Görsel ${i}`}</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        [`subImage${i}`]: e.target.files
                          ? URL.createObjectURL(e.target.files[0])
                          : "",
                        [`subFile${i}`]: e.target.files
                          ? e.target.files[0]
                          : null,
                      })
                    }
                    className="bg-black border border-stone-700 text-white p-2 rounded"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Fiyat</Label>
                <Input
                  name="price"
                  type="number"
                  value={newProduct.price}
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
                  value={newProduct.oldPrice}
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
                  value={newProduct.discount}
                  onChange={handleChange}
                  placeholder="İndirim (%)"
                  className="bg-black border border-stone-700 text-white"
                />
              </div>
            </div>

            {/* Sağ taraf: Ürün önizlemesi */}
            <div className="flex-1 border border-stone-700 p-4 rounded-xl bg-stone-900 flex flex-col">
              <h3 className="text-xl font-semibold mb-4">Önizleme</h3>

              {/* Üst kısım: Ana görsel ve küçük görseller */}
              <div className="flex gap-4 mb-4">
                {/* Ana görsel */}
                <div className="flex-shrink-0">
                  {newProduct.mainImage ? (
                    <img
                      src={newProduct.mainImage}
                      alt={newProduct.name}
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
                  {[
                    newProduct.subImage1,
                    newProduct.subImage2,
                    newProduct.subImage3,
                    newProduct.subImage4,
                    newProduct.subImage5,
                    newProduct.subImage6,
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-32 bg-stone-800 rounded flex items-center justify-center overflow-hidden"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={`Alt Görsel ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-stone-400">
                          Alt Görsel
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ürün bilgileri: Modern ve minimal */}
              <CardContent className="p-4 flex flex-col gap-2 bg-stone-900 border-t border-stone-700 rounded-b-xl">
                {/* Başlık ve kategori */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-white">
                    {newProduct.name || "Ürün Adı"}
                  </h3>
                  <span className="text-sm text-stone-400">
                    {newProduct.category || "-"}
                  </span>
                </div>

                {/* Açıklama */}
                <p className="text-sm text-stone-200">
                  {newProduct.description || "Açıklama"}
                </p>

                {/* Fiyat ve indirim */}
                <div className="flex items-center justify-between">
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
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              className={"bg-black border border-stone-700 text-white hover:bg-orange-400"}
              onClick={handleSubmit}
            >
              Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
