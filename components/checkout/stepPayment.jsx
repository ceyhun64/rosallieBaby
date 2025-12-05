import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, CreditCard, Calendar, Shield } from "lucide-react";

export default function StepPaymentCard({
  holderName,
  setHolderName,
  cardNumber,
  setCardNumber,
  formattedCardNumber, // Bu prop kullanılmadığı için kaldırılabilir, ancak tutuyorum.
  expireMonth,
  setExpireMonth,
  expireYear,
  setExpireYear,
  cvc,
  setCvc,
  handlePayment,
  totalPrice,
  setStep,
  isProcessing: externalProcessing,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const processing = externalProcessing || isProcessing;

  // Card number formatting (groups of 4)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted;
  };

  // Detect card type
  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return "unknown";
  };

  const cardType = getCardType(cardNumber);

  // Form validations
  const validateCardNumber = (num) => {
    const cleaned = num.replace(/\s/g, "");
    // Checks for standard 16 digits
    return cleaned.length === 16;
  };

  const validateExpiry = (month, year) => {
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
    
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    // Month validity check
    if (monthNum < 1 || monthNum > 12) return false;

    // Current date logic (YY format)
    const currentDate = new Date();
    const currentYearFull = currentDate.getFullYear();
    const currentYear = currentYearFull % 100;
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed

    // Year check
    if (yearNum < currentYear) return false;
    
    // Check if the card is expired within the current year
    if (yearNum === currentYear && monthNum < currentMonth) return false;

    return true;
  };

  const validateCVC = (cvcValue) => {
    // Standard CVC length check
    return cvcValue.length >= 3 && cvcValue.length <= 4;
  };

  const isFormValid =
    holderName.trim().length >= 3 &&
    validateCardNumber(cardNumber) &&
    validateExpiry(expireMonth, expireYear) &&
    validateCVC(cvc);

  const onClickPayment = async () => {
    if (!isFormValid || processing) return;
    setIsProcessing(true);
    try {
      await handlePayment();
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper for international/Turkish character check (assuming only standard letters and space are allowed for name)
  const handleNameChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Allows standard English alphabet letters and spaces
    if (/^[A-Z\s]*$/.test(value)) {
      setHolderName(value);
    }
  };


  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="text-blue-900 font-medium mb-1">Secure Payment</p>
          <p className="text-blue-700">
            Your card details are protected with 256-bit SSL encryption. 
            Your information is never stored or shared.
          </p>
        </div>
      </div>

      {/* Payment Card Form */}
      <Card className={"p-4 py-8"}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Card Details
            </CardTitle>
            <div className="flex gap-2">
              {/* Card logos - Using placeholders as URLs are not provided */}
              <img
                src="https://placehold.co/50x32/303030/ffffff?text=VISA"
                alt="Visa"
                className={`h-8 rounded-sm ${
                  cardType === "visa" ? "opacity-100" : "opacity-30"
                } transition-opacity`}
                // Fallback for image loading error
                onError={(e) => (e.currentTarget.style.display = "none")} 
              />
              <img
                src="https://placehold.co/50x32/303030/ffffff?text=MC"
                alt="Mastercard"
                className={`h-8 rounded-sm ${
                  cardType === "mastercard" ? "opacity-100" : "opacity-30"
                } transition-opacity`}
                // Fallback for image loading error
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          </div>
          <CardDescription>
            Enter your payment information securely
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Card Holder Name */}
          <div className="space-y-2">
            <Label
              htmlFor="holderName"
              className="text-sm font-medium flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Cardholder Name
            </Label>
            <Input
              id="holderName"
              placeholder="JANE DOE"
              value={holderName}
              autoComplete="cc-name"
              disabled={processing}
              className={`h-12 text-base ${
                focusedField === "holderName" ? "ring-2 ring-blue-500" : ""
              }`}
              onFocus={() => setFocusedField("holderName")}
              onBlur={() => setFocusedField(null)}
              onChange={handleNameChange} // Use adapted handler
            />
            {holderName && holderName.trim().length < 3 && (
              <p className="text-xs text-amber-600">Please enter at least 3 characters</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-sm font-medium">
              Card Number
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={formatCardNumber(cardNumber)}
                autoComplete="cc-number"
                disabled={processing}
                className={`h-12 text-base pl-4 pr-12 ${
                  focusedField === "cardNumber" ? "ring-2 ring-blue-500" : ""
                }`}
                onFocus={() => setFocusedField("cardNumber")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 16) {
                    setCardNumber(value);
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {cardNumber && !validateCardNumber(cardNumber) && (
              <p className="text-xs text-amber-600">
                Please enter a 16-digit card number
              </p>
            )}
          </div>

          {/* Expiration Date and CVC */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expiry Date
              </Label>
              <div className="flex gap-2">
                <Input
                  id="expireMonth"
                  placeholder="MM"
                  maxLength={2}
                  value={expireMonth}
                  autoComplete="cc-exp-month"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "expireMonth" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("expireMonth")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 2) {
                      setExpireMonth(value);
                    }
                  }}
                />
                <span className="flex items-center text-gray-400 font-bold">
                  /
                </span>
                <Input
                  id="expireYear"
                  placeholder="YY"
                  maxLength={2}
                  value={expireYear}
                  autoComplete="cc-exp-year"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "expireYear" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("expireYear")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 2) {
                      setExpireYear(value);
                    }
                  }}
                />
              </div>
              {expireMonth &&
                expireYear &&
                !validateExpiry(expireMonth, expireYear) && (
                  <p className="text-xs text-red-600">Invalid expiry date</p>
                )}
            </div>

            {/* CVC */}
            <div className="space-y-2">
              <Label
                htmlFor="cvc"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                CVC/CVV
              </Label>
              <div className="relative">
                <Input
                  id="cvc"
                  type="password"
                  placeholder="•••"
                  maxLength={4} // CVC is 3 or 4 digits
                  value={cvc}
                  autoComplete="cc-csc"
                  disabled={processing}
                  className={`h-12 text-base text-center ${
                    focusedField === "cvc" ? "ring-2 ring-blue-500" : ""
                  }`}
                  onFocus={() => setFocusedField("cvc")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 4) {
                      setCvc(value);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                3 or 4 digit code on the back of your card
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount Due:</span>
              <span className="text-2xl font-bold text-gray-900">
                € {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            disabled={processing}
            className="w-full sm:w-auto h-12"
          >
            ← Back
          </Button>
          <Button
            onClick={onClickPayment}
            disabled={!isFormValid || processing}
            className="w-full sm:flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                {`Pay € ${totalPrice.toFixed(2)}`}
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Footer Information */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gray-900 text-sm">
          Secure Payment Guarantee
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>
              All payments are processed according to PCI DSS standards
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Your card details are never stored</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>3D Secure for an extra layer of security</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <span>Immediate refund if payment fails</span>
          </li>
        </ul>
      </div>
    </div>
  );
}