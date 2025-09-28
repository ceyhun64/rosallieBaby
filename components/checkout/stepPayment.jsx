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
  formattedCardNumber, // Formatted card number for display
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
        <CardTitle>Card Information</CardTitle>
        <CardDescription>
          Enter your card details to complete the payment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="holderName">Card Holder Name</Label>
          <Input
            id="holderName"
            placeholder="Name on the Card"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19} // 16 digits + 3 spaces
            value={formattedCardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expireMonth">Month</Label>
            <Input
              id="expireMonth"
              placeholder="MM"
              maxLength={2}
              value={expireMonth}
              onChange={(e) =>
                setExpireMonth(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expireYear">Year</Label>
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
          Back
        </Button>
        <Button onClick={handlePayment} disabled={!isFormValid}>
          Complete Payment {totalPrice.toFixed(2)}₺
        </Button>
      </CardFooter>
    </Card>
  );
}
