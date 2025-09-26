// components/payment/StepPaymentCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function StepPaymentCard({
  holderName,
  setHolderName,
  cardNumber,
  setCardNumber,
  formattedCardNumber, // Kart numarasının gösterim formatı
  expireMonth,
  setExpireMonth,
  expireYear,
  setExpireYear,
  cvc,
  setCvc,
  handlePayment,
  totalPrice,
  setStep,
}) {
  const isFormValid =
    cardNumber && cvc && holderName && expireMonth && expireYear;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kart Bilgileri</CardTitle>
        <CardDescription>
          Ödeme işlemini tamamlamak için kart bilgilerinizi giriniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="holderName">Kart Sahibi Adı Soyadı</Label>
          <Input
            id="holderName"
            placeholder="Kart üzerindeki Ad Soyad"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Kart Numarası</Label>
          <Input
            id="cardNumber"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={16 + 3}
            value={formattedCardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expireMonth">Ay</Label>
            <Input
              id="expireMonth"
              placeholder="AA"
              maxLength={2}
              value={expireMonth}
              onChange={(e) =>
                setExpireMonth(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expireYear">Yıl</Label>
            <Input
              id="expireYear"
              placeholder="YY"
              maxLength={2}
              value={expireYear}
              onChange={(e) => setExpireYear(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="***"
              maxLength={3}
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between w-full">
        <Button variant="outline" onClick={() => setStep(2)}>
          Geri
        </Button>
        <Button onClick={handlePayment} disabled={!isFormValid}>
          {totalPrice.toFixed(2)}₺ Ödemeyi Tamamla
        </Button>
      </CardFooter>
    </Card>
  );
}
