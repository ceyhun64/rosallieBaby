"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  Edit,
  ArrowRight,
  Lock,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

const CartItemComponent = ({ item, onIncrease, onDecrease, onRemove }) => {
  const finalPrice =
    item.price +
    item.options.reduce((acc, option) => acc + (option.extraPrice || 0), 0);
  const finalOldPrice =
    item.oldPrice +
    item.options.reduce((acc, option) => acc + (option.extraPrice || 0), 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200">
      <div className="flex-shrink-0 relative w-full sm:w-32 h-32">
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={128}
          sizes="(max-width: 640px) 100vw, 128px"
          className="object-cover "
        />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Ürün Adı, Fiyatı ve Çöp Kutusu */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600">
              Fiyat:{" "}
              <span className="text-lg font-semibold">
                ₺{item.price.toFixed(2)}
              </span>
            </p>
          </div>
          <button onClick={() => onRemove(item.id)}>
            <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Ürün Kodu */}
        <div className="text-sm text-gray-500 mb-4">
          <span>
            Ürün Kodu: <span className="font-medium">{item.productCode}</span>
          </span>
        </div>
        <Separator className="bg-gray-200 h-[0.5px]" />

        {/* Ürün Özellikleri */}
        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <h4 className="font-semibold text-base mb-1">Ürün Özellikleri</h4>
          {item.options.map((option, index) => (
            <p key={index} className="flex items-center">
              <span>
                {option.label} - {option.value}
              </span>
              {option.extraPrice && (
                <span className="text-gray-500 ml-2">
                  (+₺{option.extraPrice.toFixed(2)})
                </span>
              )}
            </p>
          ))}
        </div>
        <Separator className="bg-gray-200 h-[0.5px]" />

        <div className="flex justify-between items-center mt-auto">
          {/* Adet Kontrolü */}
          <div className="flex items-center space-x-2 border rounded-md">
            <Button
              onClick={() => onDecrease(item.id)}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center">{item.quantity}</span>
            <Button
              onClick={() => onIncrease(item.id)}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Fiyat ve Düzenle */}
          <div className="flex flex-col items-end">
            {item.oldPrice && (
              <span className="text-gray-400 text-sm line-through">
                ₺{finalOldPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-xl text-green-700">
              ₺{finalPrice.toFixed(2)}
            </span>
            <button className="flex items-center text-sm text-gray-500 hover:text-black mt-2">
              <span className="mr-1">Düzenle</span>
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sun Müslin Hastane Çıkışı 6'lı Set",
      price: 2047.99,
      oldPrice: 2347.99,
      quantity: 1,
      image: "/allProducts/product1main.webp",
      productCode: "BB0143",
      options: [
        { label: "İsim Yazınız", value: "neden" },
        {
          label: "Şapka & Battaniye Seçeneği",
          value: "Fırfırlı",
          extraPrice: 149.0,
        },
      ],
    },
    {
      id: 2,
      name: "Rabbit Müslin Yastık Kılıfı",
      price: 499.0,
      quantity: 1,
      image: "/allProducts/product2main.webp",
      productCode: "BB0143",
      options: [{ label: "İsim Yazınız", value: "neden" }],
    },
  ]);

  const handleIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const finalPrice =
      item.price +
      item.options.reduce(
        (optionAcc, option) => optionAcc + (option.extraPrice || 0),
        0
      );
    return acc + finalPrice * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto px-12 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        Sepetim ({cartItems.length})
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sepet İçeriği */}
        <div className="flex-1 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
          ) : (
            cartItems.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Sipariş Özeti */}
        <div className="w-full md:w-110 flex-shrink-0 p-6 bg-gray-50 h-80">
          <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="font-medium">₺{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
              <span>Toplam</span>
              <span>₺{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Kargo sonraki adımda hesaplanacaktır.
            </p>
          </div>
          <Button className="w-full mt-6 bg-[#809363] hover:bg-green-900 text-white font-semibold rounded-none flex items-center justify-center h-12">
            ALIŞVERİŞİ TAMAMLA <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="mt-6 space-y-3 text-sm text-gray-500 items-center justify-center ">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>256 Bit SSL ile güvende alışveriş</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>150 TL üzeri ücretsiz kargo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
