"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Local Storage anahtarları
const CART_KEY = "guestCart";
const FAVORITES_KEY = "favorites";

// --- Local Storage Helper Fonksiyonları: Sepet ---

// Helper fonksiyon: Local Storage'dan sepeti güvenli bir şekilde çeker.
function getGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Local Storage cart parse error:", error);
    return [];
  }
}

// Helper fonksiyon: Local Storage sepetini günceller/yazar.
function setGuestCart(cartItems) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  // Sepet güncellendi olayını yayınla
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

// --- Local Storage Helper Fonksiyonları: Favoriler ---

// Helper fonksiyon: Local Storage'dan favorileri güvenli bir şekilde çeker.
function getGuestFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    // Favoriler sadece ID dizisi olarak tutuluyor: [6, 8]
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Local Storage favorites parse error:", error);
    return [];
  }
}

// Helper fonksiyon: Local Storage favorilerini günceller/yazar.
function setGuestFavorites(favoriteIds) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  // Favoriler güncellendi olayını yayınla
  window.dispatchEvent(new CustomEvent("favoritesUpdated"));
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 GÜNCELLENEN FONKSİYON: Başarısız öğeleri izler ve geri yazar
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    toast.loading("Oturum Açılıyor...", {
      id: "login",
    });

    // 1. Next-Auth ile Giriş Yap
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // Giriş başarısız
    if (result.error) {
      toast.error("Geçersiz e-posta veya şifre", { id: "login" });
      setIsLoading(false);
      return;
    }

    // Giriş başarılı
    if (result.ok) {
      let syncPromises = [];
      // BAŞARISIZ OLAN ÖĞELERİ İZLEMEK İÇİN YENİ DİZİLER
      let failedCartItems = [];
      let failedFavoriteIds = [];

      // ----------------------------------------------------
      // A. SEPET SENKRONİZASYONU
      // ----------------------------------------------------
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        toast.info("Sepetiniz senkronize ediliyor...", {
          id: "cart-sync",
          duration: 2000,
        });

        const cartSyncPromises = guestCart.map((item) => {
          const payload = {
            productId: item.productId,
            quantity: item.quantity,
            customName: item.customName || "",
          };

          return fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          })
            .then((res) => {
              if (!res.ok) {
                console.error(
                  `Sepet öğesi senkronize edilemedi ${item.productId}. Durum: ${res.status}`
                );
                failedCartItems.push(item); // BAŞARISIZ OLANI KAYDET
                return { success: false };
              }
              return { success: true };
            })
            .catch((e) => {
              console.error("Sepet senkronizasyonu hatası:", e);
              failedCartItems.push(item); // HATA ALANI KAYDET
              return { success: false };
            });
        });
        syncPromises.push(...cartSyncPromises);
      }

      // ----------------------------------------------------
      // B. FAVORİ SENKRONİZASYONU
      // ----------------------------------------------------
      const guestFavorites = getGuestFavorites();
      if (guestFavorites.length > 0) {
        toast.info("Favori öğeleriniz senkronize ediliyor...", {
          id: "favorites-sync",
          duration: 2000,
        });

        const favoriteSyncPromises = guestFavorites.map((productId) => {
          // Local Storage'daki favoriler sadece productId dizisi olduğu için
          // her ID için API'ye tek tek istek atıyoruz.
          const payload = { productId };

          return fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          })
            .then((res) => {
              // 200 (OK) veya 400 (Zaten ekli) durumlarında başarılı kabul ederiz.
              if (!res.ok && res.status !== 400) {
                console.error(
                  `Favori ID senkronize edilemedi ${productId}. Durum: ${res.status}`
                );
                failedFavoriteIds.push(productId); // BAŞARISIZ OLANI KAYDET
              }
              // Senkronizasyon başarılıysa veya zaten ekliyse (400), başarılı sayılır.
              return { success: res.ok || res.status === 400 };
            })
            .catch((e) => {
              console.error("Favori senkronizasyonu hatası:", e);
              failedFavoriteIds.push(productId); // HATA ALANI KAYDET
              return { success: false };
            });
        });
        syncPromises.push(...favoriteSyncPromises);
      }

      // ----------------------------------------------------
      // C. SONUÇLARI İŞLEME VE LOCAL STORAGE'I GÜNCELLEME
      // ----------------------------------------------------
      if (syncPromises.length > 0) {
        // Tüm senkronizasyonların bitmesini bekleriz
        await Promise.all(syncPromises);

        // Başarısız öğe olup olmadığını kontrol ederiz
        const allSyncsSuccessful =
          failedCartItems.length === 0 && failedFavoriteIds.length === 0;

        if (allSyncsSuccessful) {
          // Her şey başarılıysa Local Storage'ı tamamen temizle
          setGuestCart([]);
          setGuestFavorites([]);

          toast.success("Tüm misafir verileri başarıyla senkronize edildi!", {
            id: "sync-result",
            duration: 2500,
          });
          toast.dismiss("cart-sync");
          toast.dismiss("favorites-sync");
        } else {
          // Kısmi başarı/başarısızlık durumunda sadece başarısız olanları Local Storage'a geri yaz.
          // Başarılı olanlar Local Storage'dan temizlenmiş olur (çünkü sadece kalanları yazıyoruz).
          setGuestCart(failedCartItems);
          setGuestFavorites(failedFavoriteIds);

          // Hata mesajı, artık sadece gerçekten başarısız olanlar Local Storage'da kalır.
          toast.warning(
            `Giriş başarılı. ${
              failedCartItems.length + failedFavoriteIds.length
            } öğe senkronize edilemedi. Lütfen listelerinizi kontrol edin.`,
            { id: "sync-result", duration: 7000 }
          );
        }
      } else {
        // Hiç sepet veya favori yoksa senkronizasyon toast'larını kapat
        toast.dismiss("cart-sync");
        toast.dismiss("favorites-sync");
      }

      // 5. Başarı Toast ve Yönlendirme
      toast.success("Tekrar hoş geldiniz!", { id: "login" });
      setTimeout(() => router.push("/"), 800);
    }
    setIsLoading(false);
  };

  return (
    // 1. Ana Kapsayıcı: Tam ekran yüksekliği ve arka plan resmi
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 2. Arka Plan Resmi */}
      <div className="absolute inset-0 z-0">
        {/* Lütfen bu görseli projenizdeki /public/login/login.jpg yoluyla güncelleyin. */}
        <img
          src="https://placehold.co/1920x1080/1c1917/FFFFFF?text=Login+Background"
          alt="Elegant lifestyle background"
          className="w-full h-full object-cover"
          // Orijinal kodunuzda /login/login.jpg vardı, ancak güvenli olması için placeholder kullandım.
        />
        {/* Karartma (Overlay) katmanı: Formun okunurluğunu artırır */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
      </div>

      {/* 3. Form Kapsayıcısı - Dikeyde Ortalama */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-10">
        <div className="w-full max-w-md mx-auto">
          {/* 4. Glassmorphism Etkisi Verilen Form Kutusu */}
          <div
            className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-white/20 
            transform transition-all duration-500 hover:shadow-rose-500/30 ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px flex-1 bg-white/40" />
                <Sparkles className="h-6 w-6 text-rose-300" strokeWidth={1.5} />
                <div className="h-px flex-1 bg-white/40" />
              </div>

              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white text-center mb-2 drop-shadow-md">
                Tekrar Hoş Geldiniz
              </h1>

              <p className="text-center text-sm font-light text-white/80 tracking-wide drop-shadow-sm">
                Yolculuğunuza devam etmek için giriş yapın
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-xs font-light tracking-widest uppercase text-white/80 mb-2 drop-shadow-sm">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-light tracking-wide rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 
                              placeholder:text-white/60 placeholder:font-light"
                  placeholder="isim@eposta.com"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-xs font-light tracking-widest uppercase text-white/80 mb-2 drop-shadow-sm">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-light tracking-wide rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 
                              placeholder:text-white/60 placeholder:font-light pr-12"
                    placeholder="Şifrenizi girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-light text-white/70 hover:text-rose-300 tracking-wide transition-colors drop-shadow-sm"
                >
                  Şifremi unuttum?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full relative overflow-hidden bg-rose-500 text-white py-4 rounded-full 
                            hover:bg-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                            shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium tracking-widest uppercase">
                  {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  <ArrowRight
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                    strokeWidth={1.5}
                  />
                </span>
                <div
                  className="absolute inset-0 bg-white/10 
                              translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500"
                />
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm font-light text-white/70">
                Hesabınız yok mu?{" "}
                <button
                  onClick={() => router.push("/account/register")}
                  className="text-white hover:text-rose-300 font-normal transition-colors relative group"
                >
                  Bir hesap oluşturun
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-300 transition-all duration-300 group-hover:w-full" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
