import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Truck,
  Package,
  Wallet,
  ArrowRight,
} from "lucide-react";

export default function OrderDetailDialog({ 
  order, 
  setSelectedOrder, 
  onUpdateStatus,
  getStatusBadge,
  getStatusInTurkish,
  getNextStatus 
}) {
  if (!order) return null;

  const nextStatus = getNextStatus(order.status);
  const canUpdateStatus = !!nextStatus;

  // Toplam ürün adedi hesaplama
  const totalProductCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // İndirim hesaplama
  const discount =
    parseInt(order.totalPrice.split(" ")[0]) -
    parseInt(order.paidPrice.split(" ")[0]);

  return (
    <DialogContent className="bg-stone-900 text-white max-w-[95vw] sm:max-w-[500px] md:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
      <DialogHeader className="border-b border-stone-700 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-white">
              Sipariş #{order.id}
            </DialogTitle>
            <DialogDescription className="text-stone-400 text-sm mt-1">
              {order.createdAt}
            </DialogDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        {/* Sol Kolon - Müşteri Bilgileri */}
        <div className="lg:col-span-1 space-y-6">
          {/* Müşteri Kartı */}
          <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-stone-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Müşteri Bilgileri
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-stone-400 min-w-[80px]">Ad Soyad:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-stone-400 min-w-[80px]">Email:</span>
                <span className="break-all">{order.email}</span>
              </div>
            </div>
          </div>

          {/* Kargo Adresi Kartı */}
          <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-stone-200">
              <Truck className="w-5 h-5" />
              Teslimat Adresi
            </h3>
            {order.address ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-stone-400">Adres Başlığı:</span>
                  <p className="font-medium mt-1">{order.address.title}</p>
                </div>
                <div>
                  <span className="text-stone-400">Alıcı:</span>
                  <p className="font-medium mt-1">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Telefon:</span>
                  <p className="font-medium mt-1">{order.address.phone}</p>
                </div>
                <div className="pt-2 border-t border-stone-700">
                  <p className="text-stone-300 leading-relaxed">
                    {order.address.address}
                  </p>
                  <p className="text-stone-300 mt-1">
                    {order.address.district}, {order.address.city}
                  </p>
                  <p className="text-stone-300">
                    {order.address.zip}, {order.address.country}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-400 text-sm">Kargo adresi bulunamadı.</p>
            )}
          </div>
        </div>

        {/* Sağ Kolon - Sipariş Detayları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ödeme Bilgileri Kartı */}
          <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-stone-200">
              <Wallet className="w-5 h-5" />
              Ödeme Detayları
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-stone-900/50 p-3 rounded-lg">
                <span className="text-stone-400 text-xs">Ödeme Yöntemi</span>
                <p className="font-semibold text-base mt-1">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="bg-stone-900/50 p-3 rounded-lg">
                <span className="text-stone-400 text-xs">İşlem ID</span>
                <p className="font-mono text-xs mt-1 break-all">
                  {order.transactionId || "Yok"}
                </p>
              </div>
              <div className="bg-stone-900/50 p-3 rounded-lg">
                <span className="text-stone-400 text-xs">Sepet Toplamı</span>
                <p className="font-semibold text-base mt-1">
                  {order.totalPrice}
                </p>
              </div>
              {discount > 0 && (
                <div className="bg-stone-900/50 p-3 rounded-lg">
                  <span className="text-stone-400 text-xs">İndirim</span>
                  <p className="font-semibold text-base mt-1 text-orange-400">
                    -{discount} {order.totalPrice.split(" ")[1]}
                  </p>
                </div>
              )}
              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700/50 sm:col-span-2">
                <span className="text-green-400 text-xs">Ödenen Tutar</span>
                <p className="font-bold text-2xl mt-1 text-green-400">
                  {order.paidPrice}
                </p>
              </div>
            </div>

            {/* Durum Güncelleme Butonu */}
            {canUpdateStatus && (
              <div className="mt-4 pt-4 border-t border-stone-700">
                <Button
                  onClick={() => onUpdateStatus(order.id, order.status)}
                  className="bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2 h-10"
                >
                  <ArrowRight className="w-4 h-4" />
                  Durumu İlerlet: {getStatusInTurkish(nextStatus)}
                </Button>
              </div>
            )}
            {!canUpdateStatus && order.status !== "cancelled" && (
              <p className="mt-4 pt-4 border-t border-stone-700 text-center text-stone-400 text-xs">
                Bu siparişin durumu ({getStatusInTurkish(order.status)}) daha
                fazla ilerletilemez.
              </p>
            )}
            {order.status === "cancelled" && (
              <p className="mt-4 pt-4 border-t border-stone-700 text-center text-red-400 text-xs">
                Bu sipariş iptal edilmiştir.
              </p>
            )}
          </div>

          {/* Ürünler Kartı */}
          <div className="bg-stone-800/50 rounded-xl p-4 border border-stone-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between text-stone-200">
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Sipariş Ürünleri
              </span>
              <span className="text-sm font-normal text-stone-400">
                {order.items.length} ürün, {totalProductCount} adet
              </span>
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 border border-stone-700 rounded-lg bg-stone-900/50 hover:bg-stone-900/70 transition-colors"
                >
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-stone-700"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base mb-1 text-white">
                      {item.name}
                    </h4>
                    {item.customName && (
                      <p className="text-xs text-purple-400 mb-2 bg-purple-900/20 px-2 py-1 rounded inline-block">
                        🏷️ Özel İsim: {item.customName}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-400 mt-2">
                      <div>
                        <span>Birim Fiyat:</span>
                        <p className="font-medium text-stone-300">
                          {item.unitPrice}
                        </p>
                      </div>
                      <div>
                        <span>Adet:</span>
                        <p className="font-medium text-stone-300">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-stone-400">Toplam</p>
                    <p className="font-bold text-lg text-white">
                      {item.totalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-stone-700 gap-2">
        <Button
          onClick={() => setSelectedOrder(null)}
          className="bg-stone-700 hover:bg-stone-600"
        >
          Kapat
        </Button>
      </div>
    </DialogContent>
  );
}