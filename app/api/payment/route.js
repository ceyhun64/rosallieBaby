const crypto = require("crypto");

/**
 * İyzipay için HMAC-SHA256 signature oluşturur
 */
function generateIyzicoSignature(randomKey, uri, requestBody, secretKey) {
  const dataToSign = randomKey + uri + requestBody;
  return crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("hex");
}

/**
 * İyzipay authorization header'ı oluşturur
 */
function createAuthorizationHeader(apiKey, secretKey, uri, requestBody) {
  const randomKey = crypto.randomBytes(16).toString("hex");
  const signature = generateIyzicoSignature(
    randomKey,
    uri,
    requestBody,
    secretKey
  );

  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const authorization = `IYZWSv2 ${Buffer.from(authString).toString("base64")}`;

  return { authorization, randomKey };
}

/**
 * Tarihleri İyzipay formatına çevirir (YYYY-MM-DD HH:mm:ss)
 */
function formatDateForIyzipay(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * JSON yanıtını oluşturur
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * POST /api/payment
 * İyzipay ödeme işlemini gerçekleştirir
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
      cargoFee = 0,
      currency = "USD",
      basketId,
    } = body;

    // Environment variables kontrolü
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const baseUrl =
      process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

    if (!apiKey || !secretKey) {
      console.error("İyzipay API credentials eksik!");
      return jsonResponse(
        {
          status: "error",
          error: "Payment configuration error. Please contact support.",
        },
        500
      );
    }

    // Buyer tarihlerini formatla
    const formattedBuyer = {
      ...buyer,
      registrationDate: formatDateForIyzipay(buyer.registrationDate),
      lastLoginDate: formatDateForIyzipay(buyer.lastLoginDate),
    };

    // ✅ Frontend'den gelen veriler zaten hazır
    // basketItems = [{ price: "180.00", quantity: 1 }]
    // price: birim fiyat, quantity: adet

    // ✅ Sepet toplamını hesapla
    const basketTotal = basketItems.reduce((sum, item) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);

    // ✅ Genel toplam: sepet + kargo
    const totalPrice = basketTotal + cargoFee;

    // ✅ İyzipay için sepet ürünlerini formatla
    // İyzipay'in "price" alanı: TOPLAM fiyat (birim fiyat × miktar)
    const formattedBasketItems = basketItems.map((item) => {
      const unitPrice =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const quantity = item.quantity || 1;
      const itemTotalPrice = unitPrice * quantity;

      return {
        id: item.id.toString(),
        name: item.name || "Ürün",
        category1: item.category1 || "Genel",
        itemType: item.itemType || "PHYSICAL",
        price: itemTotalPrice.toFixed(2), // ✅ TOPLAM fiyat (İyzipay formatı)
      };
    });

    // ✅ Kargo ücretini ayrı ürün olarak ekle
    if (cargoFee > 0) {
      formattedBasketItems.push({
        id: "CARGO_FEE",
        name: "Kargo Ücreti",
        category1: "Kargo",
        itemType: "VIRTUAL",
        price: cargoFee.toFixed(2),
      });
    }

    // ✅ İyzipay doğrulama: basketItems toplamı === totalPrice olmalı
    const iyzipayBasketTotal = formattedBasketItems.reduce(
      (sum, item) => sum + parseFloat(item.price),
      0
    );

    if (Math.abs(iyzipayBasketTotal - totalPrice) > 0.01) {
      console.error("❌ İyzipay fiyat uyuşmazlığı:", {
        calculatedTotal: totalPrice.toFixed(2),
        iyzipayBasketTotal: iyzipayBasketTotal.toFixed(2),
        difference: Math.abs(iyzipayBasketTotal - totalPrice).toFixed(2),
      });
      return jsonResponse(
        {
          status: "error",
          error: "Price calculation error. Please contact support.",
        },
        400
      );
    }

    // İyzipay ödeme request body'si
    const paymentRequest = {
      locale: "tr",
      conversationId: Date.now().toString(),
      price: totalPrice.toFixed(2),
      paidPrice: totalPrice.toFixed(2),
      currency,
      basketId: basketId || `B${Date.now()}`,
      paymentChannel: "WEB",
      paymentCard: {
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: paymentCard.cardNumber.replace(/\s/g, ""),
        expireMonth: paymentCard.expireMonth,
        expireYear: paymentCard.expireYear,
        cvc: paymentCard.cvc,
        registerCard: 0,
      },
      buyer: formattedBuyer,
      shippingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: shippingAddress.country,
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: billingAddress.contactName,
        city: billingAddress.city,
        country: billingAddress.country,
        address: billingAddress.address,
        zipCode: billingAddress.zipCode,
      },
      basketItems: formattedBasketItems,
    };

    const requestBody = JSON.stringify(paymentRequest);
    const uri = "/payment/auth";
    const { authorization, randomKey } = createAuthorizationHeader(
      apiKey,
      secretKey,
      uri,
      requestBody
    );

    console.log("💳 İyzipay ödeme isteği gönderiliyor...", {
      endpoint: `${baseUrl}${uri}`,
      basketTotal: basketTotal.toFixed(2),
      cargoFee: cargoFee.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      itemCount: formattedBasketItems.length,
      basketItems: formattedBasketItems,
    });

    // İyzipay API'ye istek gönder
    const response = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "x-iyzi-rnd": randomKey,
        Accept: "application/json",
      },
      body: requestBody,
    });

    const result = await response.json();

    // Başarılı ödeme kontrolü
    if (result.status === "success") {
      console.log("✅ İyzipay ödeme başarılı:", {
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        amount: totalPrice.toFixed(2),
      });

      return jsonResponse({
        status: "success",
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        fraudStatus: result.fraudStatus,
        pricing: {
          basketTotal: parseFloat(basketTotal.toFixed(2)),
          cargoFee: parseFloat(cargoFee.toFixed(2)),
          total: parseFloat(totalPrice.toFixed(2)),
        },
        ...result,
      });
    }

    // Hatalı ödeme
    console.error("❌ İyzipay ödeme hatası:", {
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
      errorGroup: result.errorGroup,
    });

    return jsonResponse(
      {
        status: "error",
        error: result.errorMessage || "Ödeme işlemi başarısız oldu",
        errorCode: result.errorCode,
        errorGroup: result.errorGroup,
      },
      400
    );
  } catch (error) {
    console.error("💥 Payment API kritik hata:", error);

    return jsonResponse(
      {
        status: "error",
        error: "Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        details: error.message,
      },
      500
    );
  }
}
