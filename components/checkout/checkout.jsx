"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import PaymentStepper from "@/components/checkout/paymentStepper";
import StepAddress from "@/components/checkout/stepAddress";
import StepCargo from "@/components/checkout/stepCargo";
import StepPaymentCard from "@/components/checkout/stepPayment";
import BasketSummaryCard from "@/components/checkout/cartSummary";
import { getCart, clearGuestCart } from "@/utils/cart";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const cargoOptions = [
  { id: "standart", name: "Standard Shipping", fee: 14.99 },
  { id: "express", name: "Express Shipping", fee: 24.99 },
];

const FREE_CARGO_THRESHOLD = 250;

const initialAddressForm = {
  title: "",
  firstName: "",
  lastName: "",
  address: "",
  district: "",
  city: "",
  zip: "",
  phone: "",
  countryCode: "90",
  country: "Turkey",
  email: "",
  neighborhood: "",
};

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

  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");

  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch user data
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (!res.ok || !data.user) {
        setIsGuest(true);
        setUser({ addresses: [] });
        setIsAddingNewAddress(true);
      } else {
        setIsGuest(false);
        setUser(data.user);
        if (data.user.addresses?.length > 0) {
          setSelectedAddress(data.user.addresses[0].id.toString());
        } else {
          setIsAddingNewAddress(true);
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      setIsGuest(true);
      setUser({ addresses: [] });
      setIsAddingNewAddress(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch cart
  useEffect(() => {
    async function fetchCart() {
      setError(null);
      try {
        if (isGuest) {
          const guestCart = getCart();
          setCartItems(guestCart);
        } else if (user) {
          const res = await fetch("/api/cart");
          if (!res.ok) throw new Error("Failed to fetch cart data.");
          const data = await res.json();
          setCartItems(data);
        }
      } catch (err) {
        setError(err.message);
        const guestCart = getCart();
        setCartItems(guestCart);
      } finally {
        setLoading(false);
      }
    }

    if (user !== null || isGuest) {
      fetchCart();
    }
  }, [user, isGuest]);

  // Calculations
  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const basePrice = item.product?.price || item.price || 0;
      const itemFinalPrice = basePrice * (item.quantity || 1);
      return acc + itemFinalPrice;
    }, 0);
  }, [cartItems]);

  // Ücretsiz kargo kontrolü ile kargo ücreti hesaplama
  const selectedCargoFee = useMemo(() => {
    const cargo = cargoOptions.find((c) => c.id === selectedCargo);
    if (!cargo) return 0.0;

    // Eğer standart kargo seçili ve sepet tutarı 250'den fazlaysa ücretsiz
    if (cargo.id === "standart" && subTotal >= FREE_CARGO_THRESHOLD) {
      return 0.0;
    }

    return cargo.fee;
  }, [selectedCargo, subTotal]);

  const totalPrice = useMemo(() => {
    return subTotal + selectedCargoFee;
  }, [subTotal, selectedCargoFee]);

  // Add address
  const handleAddNewAddress = async (e) => {
    if (e) e.preventDefault();
    if (isSavingAddress) return;

    const {
      firstName,
      lastName,
      address,
      district,
      city,
      country,
      email,
      phone,
      countryCode,
      title,
      neighborhood,
      zip,
    } = newAddressForm;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !district ||
      !city ||
      !country ||
      !title
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (isGuest && !email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSavingAddress(true);

    try {
      let userId = user?.id;
      let registeredEmail = email;

      if (isGuest) {
        const registeredPassword = Math.random().toString(36).slice(-8);

        const registerRes = await fetch("/api/account/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: firstName,
            surname: lastName,
            email: registeredEmail,
            password: registeredPassword,
          }),
        });

        if (!registerRes.ok) {
          const errorData = await registerRes.json();
          throw new Error(errorData.error || "User registration failed.");
        }

        const registerData = await registerRes.json();
        userId = registerData.user.id;

        const signInResult = await signIn("credentials", {
          email: registeredEmail,
          password: registeredPassword,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error("Auto login error:", signInResult.error);
          throw new Error("Login failed. Please try again.");
        }

        await new Promise((resolve) => setTimeout(resolve, 800));

        const userRes = await fetch("/api/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
          setIsGuest(false);
        }
      }

      const fullPhone = phone ? `+${countryCode}${phone}` : "";

      const addressPayload = {
        title: title || "Home",
        firstName,
        lastName,
        address,
        district,
        city,
        zip: zip || "",
        phone: fullPhone,
        country,
        neighborhood: neighborhood || "",
      };

      const addressRes = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressPayload),
      });

      if (!addressRes.ok) {
        const addressError = await addressRes.json();
        throw new Error(addressError.error || "Error adding address.");
      }

      const addressData = await addressRes.json();

      setUser((prev) => ({
        ...prev,
        id: userId,
        email: registeredEmail,
        addresses: [...(prev?.addresses || []), addressData.address],
      }));

      setSelectedAddress(addressData.address.id.toString());

      const guestCart = getCart();
      if (guestCart.length > 0) {
        const transferPromises = guestCart.map((item) =>
          fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity || 1,
              customName: item.customName || null,
            }),
          })
        );

        await Promise.all(transferPromises);
        clearGuestCart();

        const cartRes = await fetch("/api/cart");
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItems(cartData);
        }
      }

      setNewAddressForm(initialAddressForm);
      setIsAddingNewAddress(false);
      toast.success("Address saved successfully!");
    } catch (err) {
      console.error("❌ Address Addition Error:", err);
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const formattedCardNumber = cardNumber
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1 ");

  // Card validation
  const validatePaymentInfo = () => {
    if (!holderName.trim()) {
      toast.error("Enter cardholder name.");
      return false;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (cleanCardNumber.length !== 16) {
      toast.error("Card number must be 16 digits.");
      return false;
    }

    if (!expireMonth || !expireYear) {
      toast.error("Enter expiration date.");
      return false;
    }

    const month = parseInt(expireMonth);
    if (month < 1 || month > 12) {
      toast.error("Invalid month (must be between 1-12).");
      return false;
    }

    if (cvc.length !== 3) {
      toast.error("CVV must be 3 digits.");
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();

    if (!validatePaymentInfo()) {
      return;
    }

    if (!user || !selectedAddress || !selectedCargo) {
      toast.error("Please complete all steps.");
      return;
    }

    const normalizedSelectedAddress = Number(selectedAddress);

    if (
      !user.addresses ||
      !Array.isArray(user.addresses) ||
      user.addresses.length === 0
    ) {
      toast.error("Address information not found. Please add an address.");
      setStep(1);
      return;
    }

    const selectedAddr = user.addresses.find(
      (a) =>
        a.id === normalizedSelectedAddress ||
        a.id.toString() === selectedAddress
    );

    if (!selectedAddr) {
      console.error("❌ Address not found:", {
        selectedAddress,
        normalizedSelectedAddress,
        availableAddresses: user.addresses.map((a) => ({
          id: a.id,
          title: a.title,
        })),
      });
      toast.error("Select a valid address. Please return to the address step.");
      setStep(1);
      return;
    }

    if (
      !selectedAddr.firstName ||
      !selectedAddr.lastName ||
      !selectedAddr.address ||
      !selectedAddr.city ||
      !selectedAddr.district
    ) {
      toast.error(
        "Selected address information is incomplete. Please check your address."
      );
      setStep(1);
      return;
    }

    setProcessingPayment(true);

    try {
      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      const paymentCard = {
        cardHolderName: holderName.trim(),
        cardNumber: cleanCardNumber,
        expireMonth: expireMonth.padStart(2, "0"),
        expireYear: expireYear.length === 4 ? expireYear.slice(-2) : expireYear,
        cvc,
        registerCard: "0",
      };

      const buyer = {
        id: user.id.toString(),
        name: selectedAddr.firstName,
        surname: selectedAddr.lastName,
        gsmNumber: selectedAddr.phone || "+905555555555",
        email: user.email || "guest@example.com",
        identityNumber: "11111111111",
        lastLoginDate: new Date().toISOString().split(".")[0] + "Z",
        registrationDate:
          new Date(user.createdAt || Date.now()).toISOString().split(".")[0] +
          "Z",
        registrationAddress: selectedAddr.address,
        ip: "85.34.78.112",
        city: selectedAddr.city,
        country: selectedAddr.country || "Turkey",
        zipCode: selectedAddr.zip || "34000",
      };

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

      const basketItems = cartItems.map((item) => {
        const productId = item.product?.id || item.productId;

        if (!productId) {
          console.error("❌ Invalid product:", item);
          throw new Error(
            `Invalid product in cart: ${item.title || "Unknown product"}`
          );
        }

        return {
          id: productId.toString(),
          name: item.product?.name || item.title || "Product",
          category1: item.product?.category || item.category || "Category",
          itemType: "PHYSICAL",
          price: (item.product?.price || item.price || 0).toFixed(2),
          quantity: item.quantity || 1,
          customName: item.customName || null,
        };
      });

      const basketTotal = basketItems
        .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
        .toFixed(2);

      const paymentData = {
        price: basketTotal,
        paidPrice: basketTotal,
        currency: "USD",
        basketId: `B${Date.now()}`,
        paymentCard,
        buyer,
        shippingAddress,
        billingAddress,
        basketItems,
      };

      console.log("💳 Payment initiated...", {
        addressId: selectedAddr.id,
        buyerName: `${buyer.name} ${buyer.surname}`,
        totalItems: basketItems.length,
        totalPrice: basketTotal,
      });

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await res.json();

      if (result.errorMessage || result.error) {
        console.error("❌ Iyzico Error:", result.errorMessage || result.error);
        toast.error(
          `Payment Error: ${
            result.errorMessage || result.error
          }. Please check your card information.`
        );
        setProcessingPayment(false);
        return;
      }

      if (result.status === "success") {
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
            currency: "USD",
            paymentMethod: "iyzipay",
            transactionId: result.paymentId,
            email: buyer.email,
            buyer,
            paymentCard,
          }),
        });

        const orderResult = await orderRes.json();

        if (orderResult.status === "success") {
          console.log("✅ Order created successfully:", orderResult.order?.id);

          try {
            await fetch("/api/cart", { method: "DELETE" });
            clearGuestCart();
          } catch (err) {
            console.error("Cart clearing error:", err);
          }

          toast.success("Payment successful! Redirecting...");
          router.push("/checkout/success");
        } else {
          console.error("❌ Order creation failed:", orderResult);
          toast.error(
            "Order could not be saved. Please contact customer service."
          );
          setProcessingPayment(false);
        }
      } else {
        console.error("❌ Payment failed:", result);
        toast.error("Payment failed. Please try again.");
        setProcessingPayment(false);
      }
    } catch (err) {
      console.error("💥 Payment Error:", err);
      toast.error(
        err.message || "Payment processing failed. Please try again."
      );
      setProcessingPayment(false);
    }
  };

  // Skeleton Loading Component
  const renderLoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex-1 flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-16 ml-2 hidden sm:block" />
              </div>
              <Skeleton className="h-1 flex-grow mx-2" />
              <div className="flex-1 flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-16 ml-2 hidden sm:block" />
              </div>
              <Skeleton className="h-1 flex-grow mx-2" />
              <div className="flex-1 flex items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-16 ml-2 hidden sm:block" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-4 border p-4 rounded-lg">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="flex justify-end mt-6">
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoadingSkeleton();

  if (error && cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-600">
            Enter your information to complete your order
          </p>
        </div>

        {isGuest && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-800">
              🛒 You are shopping as a guest. You can continue by entering your
              address information.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PaymentStepper currentStep={step} />

            {step === 1 && (
              <StepAddress
                addresses={user?.addresses || []}
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
                onNext={() => setStep(2)}
                newAddressForm={newAddressForm}
                setNewAddressForm={setNewAddressForm}
                onSaveAddress={handleAddNewAddress}
                isAddingNewAddress={isAddingNewAddress}
                setIsAddingNewAddress={setIsAddingNewAddress}
                isSavingAddress={isSavingAddress}
              />
            )}

            {step === 2 && (
              <StepCargo
                cargoOptions={cargoOptions}
                selectedCargo={selectedCargo}
                setSelectedCargo={setSelectedCargo}
                setStep={setStep}
                subTotal={subTotal}
              />
            )}

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

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
                <img
                  src="/iyzico/iyzico_ile_ode_colored_horizontal.webp"
                  alt="Secure payment with iyzico"
                  className="h-10 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="bg-white rounded-lg shadow-md">
                <BasketSummaryCard
                  basketItemsData={cartItems}
                  subTotal={subTotal}
                  selectedCargoFee={selectedCargoFee}
                  totalPrice={totalPrice}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm">
                <Link href="/contact">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need help?
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Contact our customer service for questions about your
                    payment.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Contact Us →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {processingPayment && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-indigo-900/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-4 text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Processing Your Payment
            </h3>
            <p className="text-gray-600 mb-6">
              Your payment is being processed securely. This may take a few
              seconds.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Important Notice
                </p>
                <p className="text-xs text-amber-800">
                  Please do not close this page or press your browser's back
                  button.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
