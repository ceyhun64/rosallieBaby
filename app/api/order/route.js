// app/api/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Helper: mail gönder
const sendMail = async (recipients, subject, message) => {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-mail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients, subject, message }),
  });
};

// POST: Yeni sipariş ve ödeme
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      basketItems,
      shippingAddress,
      billingAddress,
      totalPrice,
      paidPrice,
      currency,
      paymentMethod,
      firstName,
      lastName,
      email,
      paymentCard,
    } = body;

    if (!userId || !basketItems || basketItems.length === 0) {
      return NextResponse.json(
        { status: "failure", error: "Geçerli kullanıcı veya ürün yok" },
        { status: 400 }
      );
    }

    // --- Iyzipay uyumlu buyer objesi ---
    const buyer = {
      id: body.buyer?.id?.toString() || userId.toString(),
      name: body.buyer?.buyerName || body.buyer?.name || "",
      surname: body.buyer?.buyerSurname || body.buyer?.surname || "",
      email: body.buyer?.email || email || "",
      identityNumber: body.buyer?.identityNumber || "11111111111",
      registrationAddress: body.shippingAddress?.address || "",
      registrationDate:
        body.buyer?.registrationDate || new Date().toISOString(),
      lastLoginDate: body.buyer?.lastLoginDate || new Date().toISOString(),
      phone: body.buyer?.phone || shippingAddress.phone || "",
      city: body.buyer?.city || shippingAddress.city || "",
      country: body.buyer?.country || shippingAddress.country || "Türkiye",
      zipCode: body.buyer?.zipCode || shippingAddress.zipCode || "",
      ip: body.buyer?.ip || "127.0.0.1",
    };

    // --- Iyzipay uyumlu shipping & billing adres ---
    const shipping = {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: shippingAddress.city ?? "",
      country: shippingAddress.country ?? "Türkiye",
      address: shippingAddress.address ?? "",
      zipCode: shippingAddress.zip ?? shippingAddress.zipCode ?? "",
    };

    const billing = {
      contactName: `${buyer.name} ${buyer.surname}`.trim(),
      city: billingAddress.city ?? "",
      country: billingAddress.country ?? "Türkiye",
      address: billingAddress.address ?? "",
      zipCode: billingAddress.zip ?? billingAddress.zipCode ?? "",
    };

    // --- Iyzipay uyumlu basketItems ---
    const basketItemsFormatted = basketItems.map((item) => ({
      id: item.id.toString(),
      name: item.name ?? "Ürün",
      category1: item.category1 ?? "Kategori",
      itemType: "PHYSICAL",
      price: Number(item.price).toFixed(2),
    }));

    // --- Iyzipay uyumlu paymentCard ---
    const paymentCardFormatted = {
      cardHolderName: paymentCard.cardHolderName,
      cardNumber: paymentCard.cardNumber,
      expireMonth: paymentCard.expireMonth,
      expireYear: paymentCard.expireYear,
      cvc: paymentCard.cvc,
    };

    // --- Iyzipay payload ---
    const paymentPayload = {
      paymentCard: paymentCardFormatted,
      buyer,
      shippingAddress: shipping,
      billingAddress: billing,
      basketItems: basketItemsFormatted,
      currency: currency ?? "USD",
      basketId: "B" + Date.now(),
    };

    // --- Payment API çağrısı (APP ROUTER için düzeltildi) ---
    // App Router'da internal API çağrısı için base URL oluştur
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    console.log("🔄 Payment API çağrılıyor:", `${baseUrl}/api/payment`);

    const paymentRes = await fetch(`${baseUrl}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    // Response'u kontrol et
    if (!paymentRes.ok) {
      const errText = await paymentRes.text();
      console.error("❌ Payment API HTTP hatası:", paymentRes.status, errText);
      return NextResponse.json(
        {
          status: "failure",
          error: "Ödeme başarısız: " + errText,
        },
        { status: 400 }
      );
    }

    const paymentResult = await paymentRes.json();
    console.log("💳 Payment API response:", paymentResult);

    // İyzipay başarı kontrolü
    if (!paymentResult || paymentResult.status !== "success") {
      console.error("❌ İyzipay ödeme hatası:", paymentResult);
      return NextResponse.json(
        {
          status: "failure",
          error:
            paymentResult?.error ||
            paymentResult?.errorMessage ||
            "Ödeme başarısız",
          errorCode: paymentResult?.errorCode,
        },
        { status: 400 }
      );
    }

    console.log("✅ Ödeme başarılı! Sipariş oluşturuluyor...");

    // --- Ödeme başarılı, veritabanına kaydet ---
    // --- Ödeme başarılı, veritabanına kaydet ---
    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        status: "paid",
        totalPrice: Number(totalPrice),
        paidPrice: Number(paidPrice),
        currency: currency || "USD",
        paymentMethod: paymentMethod || "iyzipay",
        transactionId: paymentResult?.paymentId || null,
        items: {
          create: basketItems.map((item) => {
            const unitPrice = Number(item.price);
            const quantity = Number(item.quantity);

            return {
              product: {
                connect: { id: Number(item.id) },
              },
              quantity: quantity,
              unitPrice: unitPrice, // ✅ Eklendi
              totalPrice: unitPrice * quantity, // ✅ Eklendi
              customName: item.customName || null,
            };
          }),
        },
        addresses: {
          create: [
            {
              type: "shipping",
              firstName: body.buyer?.name || firstName || "",
              lastName: body.buyer?.surname || lastName || "",
              address: shippingAddress.address ?? "",
              district: shippingAddress.district ?? "",
              city: shippingAddress.city ?? "",
              zip: shippingAddress.zip ?? shippingAddress.zipCode ?? "",
              phone: body.buyer?.gsmNumber || shippingAddress.phone || "",
              country: shippingAddress.country ?? "Turkey",
            },
            {
              type: "billing",
              firstName: body.buyer?.name || firstName || "",
              lastName: body.buyer?.surname || lastName || "",
              address: billingAddress.address ?? "",
              district: billingAddress.district ?? "",
              city: billingAddress.city ?? "",
              zip: billingAddress.zip ?? billingAddress.zipCode ?? "",
              phone: body.buyer?.gsmNumber || billingAddress.phone || "",
              country: billingAddress.country ?? "Turkey",
            },
          ],
        },
      },
      include: { items: true, addresses: true },
    });

    console.log("✅ Sipariş oluşturuldu:", order.id);

    const formatPrice = (price) =>
      Number(price).toLocaleString("tr-TR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    // --- Mail Gönderimi ---
    try {
      // 1A. Müşteri onay maili
      if (buyer.email) {
        await sendMail(
          [buyer.email],
          `Siparişiniz Başarıyla Alınmıştır - #${order.id}`,
          `
Sayın ${firstName || ""} ${lastName || ""},

**Rosallie Baby** üzerinden vermiş olduğunuz **#${order.id
          }** numaralı siparişiniz başarıyla oluşturulmuş ve ödemesi onaylanmıştır. Siparişiniz, en kısa sürede titizlikle hazırlanmaya başlanacaktır.

**Sipariş Detayları:**
* **Sipariş Numarası:** #${order.id}
* **Sipariş Tarihi:** ${new Date().toLocaleDateString("tr-TR")}
* **Toplam Tutar (KDV Dahil):** ${formatPrice(totalPrice)} ${currency || "USD"}
* **Ödenen Tutar (KDV Dahil):** ${formatPrice(paidPrice)} ${currency || "USD"}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Edilen Ürünler:**
${basketItems
            .map(
              (item) =>
                `• ${item.name} (${item.quantity} Adet) — Birim Fiyat: ${formatPrice(
                  item.unitPrice || item.totalPrice
                )} ${currency}`
            )
            .join("\n")}

**Teslimat Adresi:**
* **Alıcı Adı:** ${shippingAddress.firstName || firstName || ""} ${shippingAddress.lastName || lastName || ""
          }
* **Adres:** ${shippingAddress.address}
* **İl/İlçe:** ${shippingAddress.city} / ${shippingAddress.district}
* **Telefon:** ${shippingAddress.phone}

Siparişinizin tüm aşamaları hakkında e-posta ile bilgilendirileceksiniz.

Bizi tercih ettiğiniz için teşekkür eder, iyi günler dileriz.

Saygılarımızla, 
**Rosallie Baby Ekibi**
`
        );
      }

      // 1B. Admin bilgilendirme maili
      await sendMail(
        ["rosalliebaby@gmail.com"],
        `🔔 Yeni Sipariş Kaydı - Acil İşlem Gerekiyor: #${order.id}`,
        `
Sayın Yönetici,

Web sitesi üzerinden yeni bir sipariş başarıyla alınmış ve ödemesi onaylanmıştır. Aşağıdaki detaylara göre siparişin en kısa sürede işleme alınması gerekmektedir.

**Genel Sipariş Bilgileri:**
* **Sipariş Numarası:** #${order.id}
* **Müşteri ID:** ${userId}
* **Müşteri E-posta:** ${buyer.email || "Belirtilmemiş"}
* **Ödenen Tutar:** ${formatPrice(paidPrice)} ${currency || "USD"}
* **Ödeme Yöntemi:** ${paymentMethod || "Kredi Kartı"}

**Sipariş Kalemleri:**
${basketItems
          .map(
            (item) =>
              `• ${item.name} — Miktar: ${item.quantity
              } Adet — Toplam Fiyat: ${formatPrice(item.totalPrice)} ${currency}`
          )
          .join("\n")}

**Teslimat Bilgileri:**
* **Adres:** ${shippingAddress.address}
* **İl/İlçe:** ${shippingAddress.city} / ${shippingAddress.district}
* **Telefon:** ${shippingAddress.phone}

Lütfen siparişin detaylarını kontrol ederek üretim ve gönderim sürecini başlatınız.

İyi çalışmalar.
`
      );
    } catch (mailErr) {
      console.error("⚠️ Mail gönderimi sırasında hata:", mailErr);
      // Ödeme ve sipariş başarılı ise mail hatası siparişi iptal etmez
    }

    return NextResponse.json({ status: "success", order, paymentResult });
  } catch (err) {
    console.error("💥 Order POST Error:", err);
    return NextResponse.json(
      { status: "failure", error: err.message },
      { status: 500 }
    );
  }
}

// GET: Tüm siparişleri getirme
export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        addresses: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "success", orders });
  } catch (error) {
    console.error("Order GET Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH: Sipariş durumunu güncelle
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { status: "failure", error: "orderId ve status gerekli" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { status: "failure", error: "Geçersiz sipariş durumu" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
      include: {
        items: { include: { product: true } },
        addresses: true,
        user: true,
      },
    });

    // Kullanıcı bilgilendirme maili
    // ... (Veritabanı güncellemesi yapıldı)

    // Durumların Türkçe karşılıkları
    const statusMap = {
      pending: "Beklemede",
      paid: "Ödeme Alındı (Hazırlanıyor)",
      shipped: "Kargoya Verildi",
      delivered: "Teslim Edildi",
      cancelled: "İptal Edildi",
    };

    const turkishStatus = statusMap[updatedOrder.status] || updatedOrder.status;

    // 2A. Kullanıcı bilgilendirme maili
    /* ... PATCH fonksiyonu içinde ... */
    // 2A. Kullanıcı bilgilendirme maili (Güncellenmiş)
    if (updatedOrder.user?.email) {
      let specificNote = "";
      if (updatedOrder.status === "shipped") {
        specificNote =
          "Siparişiniz kargo firmasına teslim edilmiştir. Takip numaranızı e-postanıza ekleyerek [Takip Bağlantısı] üzerinden güncel durumu izleyebilirsiniz."; // Eğer takip no eklenebilirse daha iyi olur.
      } else if (updatedOrder.status === "delivered") {
        specificNote =
          "Siparişiniz başarıyla adresinize teslim edilmiştir. Ürünlerimizle ilgili deneyiminizi bizimle paylaşmanız bizi mutlu edecektir.";
      } else if (updatedOrder.status === "cancelled") {
        specificNote =
          "Talebiniz üzerine veya operasyonel bir nedenle siparişiniz iptal edilmiştir. Geri ödeme süreciniz bankanıza bağlı olarak kısa süre içinde başlatılacaktır.";
      } else if (updatedOrder.status === "paid") {
        specificNote =
          "Ödemeniz alınmış olup, siparişiniz hazırlanma aşamasına geçmiştir. Tahmini teslimat süreci hakkında bilgi almak için bizimle iletişime geçebilirsiniz.";
      }

      const userMessage = `
Sayın ${updatedOrder.user.name || updatedOrder.user.email},

**#${updatedOrder.id}** numaralı siparişinizin durumu güncellenmiştir.

**Yeni Durum:** **${turkishStatus}**

${specificNote ? `\n${specificNote}` : ""}

Güncel sipariş bilgilerinizi web sitemizdeki hesabınız üzerinden de takip edebilirsiniz.

Her türlü soru ve destek talebiniz için Müşteri Hizmetlerimiz ile iletişime geçebilirsiniz.

Saygılarımızla,
**Rosallie Baby Ekibi**
[Web Sitenizin Adresi veya İletişim Bilgileri]
`;

      await sendMail(
        [updatedOrder.user.email],
        `Sipariş Durumunuz Güncellendi: #${updatedOrder.id}`,
        userMessage
      );
    }
    /* ... */

    // 2B. Admin bilgilendirme maili
    /* ... PATCH fonksiyonu içinde ... */
    // 2B. Admin bilgilendirme maili (Güncellenmiş)
    const adminMessage = `
**#${updatedOrder.id
      }** numaralı siparişin durumu başarılı bir şekilde güncellenmiştir.

**Yeni Durum:** **${turkishStatus}** (${updatedOrder.status})
**Güncelleyen Kullanıcı/Sistem:** Admin Panel / Otomatik Sistem
**Güncelleme Zamanı:** ${new Date().toLocaleString("tr-TR")}

Gerekli operasyonel adımların tamamlandığından emin olunuz.
`;

    await sendMail(
      ["rosalliebaby@gmail.com"],
      `✅ Sipariş Durumu Değişikliği: #${updatedOrder.id}`,
      adminMessage
    );
    /* ... */
    return NextResponse.json({ status: "success", order: updatedOrder });
  } catch (error) {
    console.error("Order PATCH Error:", error);
    return NextResponse.json(
      { status: "failure", error: error.message },
      { status: 500 }
    );
  }
}
