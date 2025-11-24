// app/payment/page.jsx (veya orijinal dosyanızın adı)
"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
// Yeni Bileşenleri Import Edin
import PaymentStepper from "@/components/checkout/paymentStepper";
import StepAddress from "@/components/checkout/stepAddress";
import StepCargo from "@/components/checkout/stepCargo";
import StepPaymentCard from "@/components/checkout/stepPayment";
import BasketSummaryCard from "@/components/checkout/cartSummary"; // Sepet özet bileşeni
import Loading from "@/components/layout/loading";

// Kargo Seçenekleri (Sabit tutuldu)
const cargoOptions = [
  { id: "standart", name: "Standard Shipping", fee: 12.0 },
  { id: "express", name: "Express Shipping", fee: 22.0 },
];

// Yeni Adres Formu için başlangıç state'i
const initialAddressForm = {
  title: "",
  firstName: "",
  lastName: "",
  address: "",
  district: "",
  city: "",
  zip: "",
  phone: "",
  country: "",
};

// --- ANA BİLEŞEN ---

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState(initialAddressForm);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCargo, setSelectedCargo] = useState(cargoOptions[0].id);

  // Kart Bilgileri
  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");

  const [step, setStep] = useState(1);

  // Sepet
  const [cartItems, setCartItems] = useState([]); // Sepet verisi buraya API'dan çekilecek

  // --- API'DEN KULLANICI VERİSİNİ ÇEKME (Değişmedi) ---
  const fetchUser = async () => {
    // ... Orijinal fetchUser fonksiyonu ...
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kullanıcı verisi çekilemedi.");
      }

      setUser(data.user);

      if (data.user.addresses.length > 0) {
        setSelectedAddress(data.user.addresses[0].id.toString());
      }
    } catch (err) {
      console.error("API Hata:", err);
      setError("Kullanıcı verilerini yüklerken bir hata oluştu.");
    } finally {
      // Sepet yüklemesi tamamlanana kadar loading true kalacak.
      // fetchCart içinde tekrar false yapılacak.
      // setLoading(false); // Kaldırıldı
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

 
  // API'den sepeti çek (Değişmedi)
  useEffect(() => {
    async function fetchCart() {
      setError(null);
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Sepet verileri alınamadı.");
        const data = await res.json();
        // Gelen verinin sizin örneğinizdeki gibi bir Array olduğunu varsayıyoruz.
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        // Hem user hem de cartItems yüklendikten sonra loading'i false yapıyoruz.
        // Basitlik için sadece cartItems'ın sonunda false yaptık.
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  console.log("cartItems:", cartItems);

  // --- HESAPLAMALAR (GÜNCELLENDİ) ---
  const subTotal = useMemo(() => {
    const STROLLER_COVER_PRICE = 149; // Bebek arabası örtüsü ek ücreti (Örnekten alındı, sabit varsayalım)
    const HAT_TOY_PRICE = 149; // Şapka/Oyuncak ek ücreti (Örnekten alındı, sabit varsayalım)

    return cartItems.reduce((acc, item) => {
      // product nesnesi mevcut değilse 0 fiyat al
      const basePrice = item.product?.price ?? 0;

      // Eğer strollerCover 'true' ise ek ücreti ekle
      const strollerCoverPrice = item.strollerCover ? STROLLER_COVER_PRICE : 0;

      // Eğer hatToyOption 'ruffle' gibi bir değerse (ve 'none' değilse) ek ücreti ekle
      // Not: Sizin örneğinizde hatToyOption: "ruffle" idi, "none" harici tüm değerleri ek ücretli kabul ediyoruz.
      const hatToyPrice =
        item.hatToyOption && item.hatToyOption !== "none" ? HAT_TOY_PRICE : 0;

      // Ürünün o anki toplam fiyatı (Temel fiyat + Opsiyonlar) * Miktar
      const itemFinalPrice =
        (basePrice + strollerCoverPrice + hatToyPrice) * (item.quantity ?? 1);

      return acc + itemFinalPrice;
    }, 0);
  }, [cartItems]); // cartItems değiştiğinde yeniden hesapla

  const selectedCargoFee = useMemo(() => {
    const cargo = cargoOptions.find((c) => c.id === selectedCargo);
    return cargo ? cargo.fee : 0.0;
  }, [selectedCargo]);

  const totalPrice = useMemo(() => {
    // subTotal artık cartItems üzerinden doğru hesaplanıyor
    return subTotal + selectedCargoFee;
  }, [subTotal, selectedCargoFee]);

  // --- YENİ ADRES EKLEME İŞLEMİ (Değişmedi) ---
  const handleAddressFormChange = (e) => {
    const { id, value } = e.target;
    setNewAddressForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (isSavingAddress) return;

    // Form doğrulama
    const { firstName, lastName, address, district, city, country } =
      newAddressForm;
    if (!firstName || !lastName || !address || !district || !city || !country) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setIsSavingAddress(true);

    try {
      // Telefonu +code + number olarak birleştir
      const fullPhone = `+${newAddressForm.countryCode}${newAddressForm.phone}`;

      // API'ye gönderilecek payload
      const payload = {
        ...newAddressForm,
        phone: fullPhone, // burada birleşmiş halde
      };

      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Adres eklenirken bir hata oluştu.");
      }

      setUser((prev) => ({
        ...prev,
        addresses: [...prev.addresses, data.address],
      }));

      setSelectedAddress(data.address.id.toString());
      setNewAddressForm(initialAddressForm);
      setIsAddingNewAddress(false);

      alert("Yeni adres başarıyla eklendi ve seçildi.");
    } catch (err) {
      console.error("Adres Ekleme Hatası:", err);
      alert(err.message);
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Kart Numarası Formatlama (Değişmedi)
  const formattedCardNumber = cardNumber
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$& ");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user || !selectedAddress || !selectedCargo) {
      alert("Lütfen tüm adımları tamamlayın.");
      return;
    }

    // Seçilen adresi bul
    const selectedAddr = user.addresses.find(
      (a) => a.id.toString() === selectedAddress
    );
    if (!selectedAddr) {
      alert("Geçerli bir adres seçiniz.");
      return;
    }

    // Kart bilgileri
    const paymentCard = {
      cardHolderName: holderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      registerCard: "0",
    };

    // Buyer bilgileri
    const buyer = {
      id: user.id,
      name: selectedAddr.firstName,
      surname: selectedAddr.lastName,
      gsmNumber: selectedAddr.phone || "",
      email: user.email || "",
      identityNumber: "74300864791",
      lastLoginDate: new Date().toISOString(),
      registrationDate: user.createdAt,
      registrationAddress: selectedAddr.address,
      ip: "127.0.0.1",
      city: selectedAddr.city,
      country: selectedAddr.country || "Turkey",
      zipCode: selectedAddr.zip,
    };

    // Shipping ve Billing adresleri
    const shippingAddress = {
      contactName: `${selectedAddr.firstName} ${selectedAddr.lastName}`,
      city: selectedAddr.city,
      country: selectedAddr.country || "Turkey",
      address: selectedAddr.address,
      district: selectedAddr.district,
      zipCode: selectedAddr.zip,
      phone: selectedAddr.phone,
    };
    const billingAddress = { ...shippingAddress };

    // Sepet ürünleri
    const basketItems = cartItems.map((item) => ({
      id: item.id.toString(),
      name: item.product?.name || "Ürün",
      category1: "Kategori",
      itemType: "PHYSICAL",
      price: (
        (item.product?.price ?? 0) +
        (item.strollerCover ? 149 : 0) +
        (item.hatToyOption && item.hatToyOption !== "none" ? 149 : 0)
      ).toFixed(2),
      quantity: item.quantity || 1,
    }));

    // Sepet toplamını hesapla
    const basketTotal = basketItems
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);

    // Ödeme verisi
    const paymentData = {
      price: basketTotal,
      paidPrice: basketTotal,
      currency: "TRY",
      basketId: `B${Date.now()}`,
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
    };

    try {
      // Ödeme isteği
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await res.json();
      console.log("payment result:", result);

      if (result.status === "success") {
        // Sipariş kaydı oluştur
        const orderRes = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: buyer.id,
            firstName: buyer.name,
            lastName: buyer.surname,
            basketItems,
            shippingAddress,
            billingAddress,
            totalPrice: basketTotal,
            paidPrice: basketTotal,
            currency: "TRY",
            paymentMethod: "iyzipay",
            transactionId: result.paymentId,
            email: buyer.email,
          }),
        });

        const orderResult = await orderRes.json();
        console.log("order result:", orderResult);

        if (orderResult.status === "success") {
          try {
            // Ödeme başarılı, kullanıcının sepetini temizle
            await fetch("/api/cart", {
              method: "DELETE",
            });
          } catch (err) {
            console.error("Failed to clear cart after successful order:", err);
            // Burada kullanıcıya hata mesajı göstermek isteğe bağlı
          }

          // Başarılı yönlendirme
          router.push("/checkout/success");
        } else {
          router.push("/checkout/unsuccess");
        }
      } else {
        router.push("/checkout/unsuccess");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Ödeme sırasında bir hata oluştu.");
    }
  };
  // --- SAYFA DÜZENİ VE YÜKLEME KONTROLÜ (Değişmedi) ---
  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        Hata: {error}
      </div>
    );
  }

  // API'den veri geldiğinde ve yükleme bittiğinde render et
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Payment Transactions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Sütun: Adımlar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adım Başlıkları/Göstergesi */}
          <PaymentStepper currentStep={step} />

          {/* Adım 1: Adres Seçimi */}
          {step === 1 && (
            <StepAddress
              user={user}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
              setStep={setStep}
              isAddingNewAddress={isAddingNewAddress}
              setIsAddingNewAddress={setIsAddingNewAddress}
              newAddressForm={newAddressForm}
              handleAddressFormChange={handleAddressFormChange}
              handleAddNewAddress={handleAddNewAddress}
              isSavingAddress={isSavingAddress}
            />
          )}

          {/* Adım 2: Kargo Seçimi */}
          {step === 2 && (
            <StepCargo
              cargoOptions={cargoOptions}
              selectedCargo={selectedCargo}
              setSelectedCargo={setSelectedCargo}
              setStep={setStep}
            />
          )}

          {/* Adım 3: Kart Bilgileri */}
          {step === 3 && (
            <StepPaymentCard
              holderName={holderName}
              setHolderName={setHolderName}
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              formattedCardNumber={formattedCardNumber}
              expireMonth={expireMonth}
              setExpireMonth={setExpireMonth}
              expireYear={expireYear}
              setExpireYear={setExpireYear}
              cvc={cvc}
              setCvc={setCvc}
              handlePayment={handlePayment}
              totalPrice={totalPrice}
              setStep={setStep}
            />
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 text-green-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Your payments are protected by SSL.
            </p>
          </div>
        </div>

        {/* Sağ Sütun: Sepet Özeti */}
        <div className="lg:col-span-1">
          <div className="flex justify-center">
            <img
              src="/iyzico/iyzico_ile_ode_colored_horizontal.webp"
              alt="iyzico ile güvenli ödeme"
              className="h-10 md:h-12 object-contain mb-4"
              loading="lazy"
            />
          </div>
          <BasketSummaryCard
            // basketItemsData yerine cartItems gönderildi
            basketItemsData={cartItems}
            subTotal={subTotal}
            selectedCargoFee={selectedCargoFee}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </div>
  );
}
