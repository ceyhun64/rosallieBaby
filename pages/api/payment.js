// pages/api/payment.js
import Iyzipay from "iyzipay";

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL,
});

// Tarihleri Iyzipay formatına çeviren fonksiyon
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", error: "Method not allowed" });
  }

  try {
    const {
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
      currency,
      basketId,
    } = req.body;

    // Tarihleri Iyzipay formatına çevir
    const formattedBuyer = {
      ...buyer,
      registrationDate: formatDateForIyzipay(buyer.registrationDate),
      lastLoginDate: formatDateForIyzipay(buyer.lastLoginDate),
    };

    // basketItems toplamını hesapla
    const basketTotal = basketItems
      .reduce((sum, item) => sum + parseFloat(item.price), 0)
      .toFixed(2);

    // Ödeme isteği oluştur
    const paymentRequest = {
      locale: "tr",
      conversationId: Date.now().toString(),
      price: basketTotal, // basket toplamına eşitle
      paidPrice: basketTotal, // basket toplamına eşitle (kampanya yoksa)
      currency: currency || "TRY",
      basketId: basketId || "B" + Date.now(),
      paymentChannel: "WEB",
      paymentCard: {
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: paymentCard.cardNumber,
        expireMonth: paymentCard.expireMonth,
        expireYear: paymentCard.expireYear,
        cvc: paymentCard.cvc,
        registerCard: 0,
      },
      buyer: formattedBuyer,
      shippingAddress: { ...shippingAddress },
      billingAddress: { ...billingAddress },
      basketItems: basketItems.map((item) => ({
        id: item.id.toString(),
        name: item.name || "Ürün",
        category1: item.category1 || "Kategori",
        itemType: item.itemType || "PHYSICAL",
        price: parseFloat(item.price).toFixed(2),
      })),
    };

    // Iyzipay ödeme oluşturma
    iyzipay.payment.create(paymentRequest, function (err, result) {
      if (err) {
        console.error("Iyzico Error:", err);
        return res.status(500).json({ status: "error", error: err.message });
      } else {
        return res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error("Payment API Error:", error);
    return res.status(500).json({ status: "error", error: error.message });
  }
}
