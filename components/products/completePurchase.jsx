// CompletePurchase.jsx
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, ShoppingBag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
// import { useCart } from "@/contexts/cartContext"; // Artık sadece giriş yapmış kullanıcılar için API çağrısı manuel yapılacak.
import { Skeleton } from "../ui/skeleton";
import { addToGuestCart } from "@/utils/cart"; // Misafir sepeti için import

// 🆕 Product Card Skeleton (DEĞİŞMEDİ)
const ProductCardSkeleton = () => (
  <Card className="flex flex-col rounded-xl overflow-hidden shadow-md flex-1 min-w-[280px] max-w-[350px] bg-white border-0">
    <Skeleton className="h-56 w-full" />
    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export default function CompletePurchase() {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Manuel olarak yönetiliyor
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Giriş durumunu tutar

  useEffect(() => {
    async function fetchProductsAndUserStatus() {
      try {
        setLoading(true);

        // 1. Ürün verisini çek
        const productRes = await fetch("/api/products");
        const productData = await productRes.json();

        const categories = [
          "toy",
          "hospital_outfit_set",
          "hospital_outfit_special_set",
        ];

        const selected = categories
          .map((category) => {
            const categoryProducts = productData.products.filter(
              (p) => p.category === category
            );
            if (!categoryProducts.length) return null;
            const randomIndex = Math.floor(
              Math.random() * categoryProducts.length
            );
            return categoryProducts[randomIndex];
          })
          .filter(Boolean);

        setProducts(selected);

        const initialSelected = {};
        selected.forEach((p) => (initialSelected[p.id] = false));
        setSelectedProducts(initialSelected);

        // 2. Kullanıcı giriş durumunu kontrol et
        const userRes = await fetch("/api/account/check", {
          method: "GET",
          credentials: "include", // Cookie'leri göndermek için
        });
        const userData = await userRes.json();
        setIsLoggedIn(!!userData.user); // user nesnesi varsa true
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsAndUserStatus();
  }, []);

  const handleSwitchChange = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
  };

  // 🚀 GÜNCELLENDİ: Giriş durumuna göre sepet işlemi
  const handleAddAllToCart = async () => {
    const selected = products.filter((p) => selectedProducts[p.id]);

    if (!selected.length) {
      toast.error("No products selected to add!");
      return;
    }

    setIsAddingToCart(true);

    try {
      if (isLoggedIn) {
        // --- GİRİŞ YAPMIŞ KULLANICI İÇİN: API KULLAN ---
        for (const product of selected) {
          const productData = {
            productId: product.id,
            quantity: 1,
            customName: null,
            image: product.mainImage,
            price: product.price,
            title: product.name,
            oldPrice: product.oldPrice,
            category: product.category,
            description: product.description,
          };

          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
            credentials: "include",
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || "Failed to add product to cart via API."
            );
          }
        }
        toast.success("All selected products added to your cart via API!");
      } else {
        // --- MİSAFİR KULLANICI İÇİN: LOCAL STORAGE KULLAN ---
        for (const product of selected) {
          // addToGuestCart, product nesnesindeki alan adlarınıza göre güncellenmiştir.
          addToGuestCart({
            productId: product.id,
            quantity: 1,
            customName: null,
            image: product.mainImage,
            price: product.price,
            title: product.name,
            oldPrice: product.oldPrice,
            category: product.category,
            description: product.description,
          });
        }
        toast.success("All selected products added to guest cart!");
      }

      setSelectedProducts({}); // Başarılı olursa seçimi temizle
    } catch (error) {
      console.error("Bulk add error:", error);
      toast.error(
        `Error adding to cart: ${error.message || "Please try again."}`
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const calculateTotal = () =>
    products.reduce(
      (sum, p) => sum + (selectedProducts[p.id] ? p.price : 0),
      0
    );

  const calculateOldTotal = () =>
    products.reduce(
      (sum, p) => sum + (selectedProducts[p.id] ? p.oldPrice : 0),
      0
    );

  const calculateDiscountPercentage = () => {
    const oldTotal = calculateOldTotal();
    const total = calculateTotal();
    // Sıfıra bölme hatasını önle
    return oldTotal ? Math.round(((oldTotal - total) / oldTotal) * 100) : 0;
  };

  // 🆕 Show skeleton while loading (DEĞİŞMEDİ)
  if (loading) {
    return (
      <div className="flex flex-col px-4 md:px-8 lg:px-16 py-12 w-full bg-gray-50 rounded-2xl">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-px w-24 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="flex flex-wrap gap-6 flex-1 justify-center">
            {[1, 2, 3].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

          <Card className="flex-shrink-0 lg:w-1/3 rounded-xl border-0 shadow-lg bg-white sticky top-40 h-fit">
            <CardHeader className="border-b border-gray-200 bg-gray-50">
              <Skeleton className="h-16 w-full" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="flex flex-col px-4 md:px-8 lg:px-16 py-12 w-full bg-gray-50 rounded-2xl">
      {/* Premium Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-800 mb-3">
          Complete Your Purchase
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm tracking-wide">
          The name on the romper will automatically be added here as well
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Premium Product Cards */}
        <div className="flex flex-wrap gap-6 flex-1 justify-center">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex-1 min-w-[280px] max-w-[350px] bg-white border-0"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={product.mainImage}
                  alt={product.description}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-3 py-1.5 tracking-wider">
                    -{product.discount}%
                  </div>
                )}
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium mb-4 text-gray-800 line-clamp-2 min-h-[40px]">
                    {product.description}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    {product.oldPrice > product.price && (
                      <span className="line-through text-gray-400 text-sm">
                        €{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="font-semibold text-xl text-black">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Add to bundle</span>
                  <Switch
                    checked={selectedProducts[product.id]}
                    onCheckedChange={() => handleSwitchChange(product)}
                    className="data-[state=checked]:bg-black"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Summary Card */}
        <Card className="flex-shrink-0 lg:w-1/3 rounded-xl border-0 shadow-lg bg-white sticky top-40 h-fit">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-sm font-normal text-gray-700 flex items-start gap-3">
              <Info className="flex-shrink-0 mt-0.5" size={20} />
              <span className="leading-relaxed">
                These products will be added to your cart along with the one you
                are viewing
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Bundle Summary
              </h4>

              {/* Savings Badge */}
              {calculateDiscountPercentage() > 0 && (
                <div className="flex items-center gap-3 mb-4 p-4 bg-black text-white rounded-lg">
                  <span className="text-2xl font-semibold">
                    {calculateDiscountPercentage()}%
                  </span>
                  <span className="text-sm">Total Savings</span>
                </div>
              )}

              {/* Price Display */}
              <div className="space-y-2">
                {calculateOldTotal() > calculateTotal() && (
                  <div className="flex justify-between text-gray-500">
                    <span>Original Price:</span>
                    <span className="line-through">
                      €{calculateOldTotal().toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-semibold text-black pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>€{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base font-medium tracking-wider transition-all duration-300 rounded-full"
              onClick={handleAddAllToCart}
              disabled={isAddingToCart}
            >
              <ShoppingBag size={20} />
              {isAddingToCart
                ? "Adding..."
                : `Add All to Cart (${
                    Object.values(selectedProducts).filter(Boolean).length
                  })`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
