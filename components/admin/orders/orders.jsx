"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader,
  Truck,
  CheckCircle,
  Menu,
  XCircle,
  Package,
  Wallet,
  ArrowRight, // Yeni ikon
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Loading from "@/components/layout/loading";

export default function Orders() {
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 15; // Sayfa başına öğe sayısı

  // Sipariş durumlarının ilerleme sırası (Prisma enum'una uygun)
  const statusOrder = ["pending", "paid", "shipped", "delivered"];

  // Prisma Enum değerlerini okunabilir hale getiren yardımcı fonksiyon
  const getStatusInTurkish = (status) => {
    switch (status) {
      case "pending":
        return "Ödeme Bekleniyor";
      case "paid":
        return "Ödeme Başarılı";
      case "shipped":
        return "Kargoya Verildi"; // Enum'a uygun güncellendi
      case "delivered":
        return "Teslim Edildi";
      case "cancelled":
        return "İptal Edildi"; // Enum'a uygun güncellendi
      default:
        return "Bilinmiyor";
    }
  };

  // Sipariş Durumu Rozeti (Badge) için yardımcı fonksiyon
  const getStatusBadge = (status) => {
    const turkishStatus = getStatusInTurkish(status);
    switch (turkishStatus) {
      case "Ödeme Bekleniyor":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-500/80 flex items-center gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            {turkishStatus}
          </Badge>
        );
      case "Ödeme Başarılı":
        return (
          <Badge className="bg-blue-600 hover:bg-blue-600/80 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {turkishStatus}
          </Badge>
        );
      case "Kargoya Verildi":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-600/80 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            {turkishStatus}
          </Badge>
        );
      case "Teslim Edildi":
        return (
          <Badge className="bg-green-600 hover:bg-green-600/80 flex items-center gap-1">
            <Package className="w-3 h-3" />
            {turkishStatus}
          </Badge>
        );
      case "İptal Edildi":
        return (
          <Badge className="bg-red-700 hover:bg-red-700/80 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            {turkishStatus}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-stone-500 hover:bg-stone-500/80">
            {turkishStatus}
          </Badge>
        );
    }
  };

  // Durum ilerlemesi için yardımcı fonksiyon
  const getNextStatus = (currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    // Paid'den sonraki durum 'shipped' veya 'delivered'
    if (currentIndex >= 0 && currentIndex < statusOrder.length - 1) {
      return statusOrder[currentIndex + 1];
    }
    return null; // İlerleme yok (delivered veya cancelled gibi)
  };

  // Yeni durum setini ve API çağrısını yapan fonksiyon
  const handleUpdateStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);

    if (!nextStatus) {
      alert("Bu siparişin durumu daha fazla güncellenemez.");
      // toast.info('Bu siparişin durumu daha fazla güncellenemez.');
      return;
    }

    if (
      !confirm(
        `Sipariş #${orderId} durumunu '${getStatusInTurkish(
          currentStatus
        )}' -> '${getStatusInTurkish(
          nextStatus
        )}' olarak güncellemek istiyor musunuz?`
      )
    ) {
      return;
    }

    try {
      // API rota adının '/api/order' olduğunu varsayıyoruz
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        throw new Error(`Durum güncelleme HTTP hatası: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "success") {
        // State'i güncelleyerek anlık değişiklik göster
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, status: nextStatus } : o
          )
        );
        // toast.success(`Sipariş #${orderId} durumu güncellendi: ${getStatusInTurkish(nextStatus)}`);
        alert(
          `Sipariş #${orderId} durumu güncellendi: ${getStatusInTurkish(
            nextStatus
          )}`
        );
      } else {
        console.error("Durum güncelleme API hatası:", data.error);
        // toast.error(`Sipariş durumu güncellenirken hata oluştu: ${data.error}`);
        alert(`Sipariş durumu güncellenirken hata oluştu: ${data.error}`);
      }
    } catch (err) {
      console.error("Durum güncelleme sırasında hata:", err);
      // toast.error('Sipariş durumu güncellenirken bir ağ hatası oluştu.');
      alert("Sipariş durumu güncellenirken bir ağ hatası oluştu.");
    }
  };

  // API'den siparişleri çekme ve formatlama
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // API rota adının '/api/order' olduğunu varsayıyoruz
        const res = await fetch("/api/order");

        if (!res.ok) {
          throw new Error(`HTTP hata kodu: ${res.status}`);
        }

        const data = await res.json();

        if (data.status === "success") {
          // API'den gelen veriyi uygun hale getir
          const formattedOrders = data.orders.map((o) => {
            // Sadece 'shipping' tipindeki adresi bul (veya ilk adresi kullan)
            const shippingAddress =
              o.addresses.find((a) => a.type === "shipping") || o.addresses[0];

            return {
              id: o.id,
              customer: `${o.user.name} ${o.user.surname}`,
              email: o.user.email,

              // Ürün isimlerini dizi olarak al
              products: o.items.map(
                (i) => `${i.product.name} (x${i.quantity})`
              ),

              totalPrice: `${o.totalPrice} ${o.currency}`, // Direkt değer
              paidPrice: `${o.paidPrice} ${o.currency}`, // Direkt değer

              paymentMethod: o.paymentMethod || "Belirtilmemiş",
              transactionId: o.transactionId || "Yok",
              status: o.status,

              date: new Date(o.createdAt).toLocaleDateString("tr-TR"),
              createdAt: new Date(o.createdAt).toLocaleString("tr-TR"),

              address: o.addresses.find((a) => a.type === "shipping"), // Adres nesnesi

              items: o.items.map((i) => ({
                name: i.product.name,
                quantity: i.quantity,
                unitPrice: `${i.unitPrice} ${o.currency}`, // Direkt değer
                totalPrice: `${i.totalPrice} ${o.currency}`, // Direkt değer
                mainImage: i.product.mainImage,
                customName: i.customName,
              })),
            };
          });
          setOrders(formattedOrders);
        } else {
          console.error("Sipariş API hatası:", data.error);
        }
      } catch (err) {
        console.error("Siparişleri çekerken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Arama ve sıralama işlemlerini useMemo ile optimize et
  const filteredOrders = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.customer.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase()) ||
          String(o.id).includes(search) // ID araması için String'e çevrildi
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Oluşturulma tarihine göre sıralama
  }, [orders, search]);

  // Sayfalamayı useMemo ile optimize et
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const handleDelete = (id) => {
    // Toplu silme butonu kullanıldığı için bu fonksiyon sadece tekli silme için
    // Gerçek uygulamada buraya API çağrısı eklenmelidir.
    if (confirm(`Sipariş #${id} silinecektir. Emin misiniz?`)) {
      setOrders(orders.filter((o) => o.id !== id));
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
      // Başarılı bildirim eklenmeli
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(paginatedOrders.map((o) => o.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // Detay dialogu için ortak bileşen
  // Detay dialogu için ortak bileşen
  const OrderDetailDialog = ({ order, setSelectedOrder, onUpdateStatus }) => {
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
                        <p className="text-xs text-purple-400 mb-1">
                          Özel İsim: {item.customName}
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
  };

  if (loading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar mobil açma butonu */}
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
        <h1 className="text-3xl font-bold mb-6 ms-12 mt-2">Siparişler</h1>

        {/* Arama ve toplu silme */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button
            className={`w-full md:w-auto ${
              selectedIds.length > 0
                ? "hover:bg-red-600 cursor-pointer bg-red-500"
                : "bg-stone-700 text-stone-400 cursor-not-allowed"
            }`}
            disabled={selectedIds.length === 0}
            onClick={() => {
              // Toplu silme işlemi (Gerçek API çağrısı buraya eklenmeli)
              if (
                confirm(
                  `${selectedIds.length} adet sipariş silinecektir. Emin misiniz?`
                )
              ) {
                setOrders(orders.filter((o) => !selectedIds.includes(o.id)));
                setSelectedIds([]);
              }
            }}
          >
            Seçilenleri Sil ({selectedIds.length})
          </Button>

          <Input
            type="text"
            placeholder="Müşteri adı, email veya ID ara..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Yeni arama yapıldığında ilk sayfaya dön
            }}
            className="w-full md:w-96 bg-black border border-stone-700 text-white placeholder-stone-400"
          />
        </div>

        {/* Mobil kart görünümü - GÜNCELLENMİŞ VERSİYON */}
        {isMobile && (
          <div className="flex flex-col gap-4">
            {paginatedOrders.length === 0 ? (
              <p className="text-center text-stone-400">
                Gösterilecek sipariş bulunamadı.
              </p>
            ) : (
              paginatedOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const canUpdateStatus = !!nextStatus;

                return (
                  <div
                    key={order.id}
                    className="bg-stone-900 p-4 rounded-xl shadow-md border border-stone-800"
                  >
                    {/* Üst Bölüm: Başlık, Durum, Checkbox */}
                    <div className="flex justify-between items-start mb-3 border-b border-stone-800 pb-3">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1 form-checkbox h-4 w-4 text-stone-600 transition duration-150 ease-in-out bg-black border-stone-700 rounded flex-shrink-0"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => handleSelectOne(order.id)}
                        />
                        <div>
                          <span className="font-bold text-lg text-stone-300 block">
                            Sipariş #{order.id}
                          </span>
                          <span className="text-xs text-stone-400">
                            {order.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Orta Bölüm: Özet Bilgiler */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <strong className="text-stone-400">Müşteri:</strong>
                        <p className="truncate text-white">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <strong className="text-stone-400">
                          Ödenen Tutar:
                        </strong>
                        <p className="font-bold text-green-400">
                          {order.paidPrice}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <strong className="text-stone-400">Email:</strong>
                        <p className="text-stone-300 truncate">{order.email}</p>
                      </div>
                      <div className="col-span-2">
                        <strong className="text-stone-400">Ürünler:</strong>
                        <p className="text-stone-300 line-clamp-1">
                          {order.products.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Alt Bölüm: İşlemler */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-800">
                      {/* Durum Güncelleme Butonu */}
                      {canUpdateStatus && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(order.id, order.status)
                          }
                          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1 h-8 text-xs font-semibold"
                        >
                          <ArrowRight className="w-3 h-3" />
                          {getStatusInTurkish(nextStatus)}
                        </Button>
                      )}

                      {/* Detay ve Silme Butonları */}
                      <Dialog
                        open={selectedOrder?.id === order.id}
                        onOpenChange={(isOpen) =>
                          !isOpen && setSelectedOrder(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-stone-700 hover:bg-stone-600 h-8 text-xs font-semibold"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Detay
                          </Button>
                        </DialogTrigger>
                        <OrderDetailDialog
                          order={selectedOrder}
                          setSelectedOrder={setSelectedOrder}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      </Dialog>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500 hover:bg-red-600 h-8 text-xs font-semibold"
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Masaüstü tablo */}
        {!isMobile && (
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-stone-900/70 border-b border-stone-800">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-stone-600 transition duration-150 ease-in-out bg-black border-stone-700 rounded"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === paginatedOrders.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Ürünler
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Ödenen Tutar
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Ödeme Yöntemi
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-4 text-center text-stone-400"
                    >
                      Aranan kriterlere uygun sipariş bulunamadı.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const nextStatus = getNextStatus(order.status);
                    const canUpdateStatus = !!nextStatus;

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-stone-800/50 transition duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-stone-600 transition duration-150 ease-in-out bg-black border-stone-700 rounded"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => handleSelectOne(order.id)}
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-300">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {order.customer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {order.email}
                        </td>
                        <td className="px-4 py-3 text-sm max-w-xs whitespace-normal break-words">
                          {order.products.join(", ")}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-400">
                          {order.paidPrice}
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {order.paymentMethod}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-400">
                          {order.date}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <Dialog
                              open={selectedOrder?.id === order.id}
                              onOpenChange={(isOpen) =>
                                !isOpen && setSelectedOrder(null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-stone-700 hover:bg-stone-600"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  Detay
                                </Button>
                              </DialogTrigger>
                              <OrderDetailDialog
                                order={selectedOrder}
                                setSelectedOrder={setSelectedOrder}
                                onUpdateStatus={handleUpdateStatus}
                              />
                            </Dialog>

                            {canUpdateStatus && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(order.id, order.status)
                                }
                                className="bg-purple-600 hover:bg-purple-700 h-7 px-2 text-xs flex items-center gap-1"
                              >
                                <ArrowRight className="w-3 h-3" />
                                {getStatusInTurkish(nextStatus)}
                              </Button>
                            )}

                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleDelete(order.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Sil
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Sayfalama */}
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
}
