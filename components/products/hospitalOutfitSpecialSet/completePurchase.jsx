"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export default function CompletePurchase() {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState({}); // { productId: true/false }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        const categories = [
          "toy",
          "hospital_outfit_set",
          "hospital_outfit_special_set",
        ];

        const selected = categories
          .map((category) => {
            const categoryProducts = data.products.filter(
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

        // Başlangıçta hepsi seçili değil
        const initialSelected = {};
        selected.forEach((p) => (initialSelected[p.id] = false));
        setSelectedProducts(initialSelected);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleSwitchChange = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
  };

  const handleAddAllToCart = async () => {
    try {
      // 🔹 1. Kullanıcı login mi?
      const sessionRes = await fetch("/api/account/check");
      const sessionData = await sessionRes.json();

      if (!sessionData.user) {
        toast.error("You must log in before adding to cart!");
        window.location.href = "/account/login";
        return;
      }

      // 🔹 2. Sadece seçilen ürünleri al
      const selected = products.filter((p) => selectedProducts[p.id]);
      if (!selected.length) {
        toast.error("No products selected!");
        return;
      }

      // 🔹 3. Seçili ürünleri sepete ekle
      for (const product of selected) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1,
            strollerCover: false,
            customName: "none",
            hatToyOption: "none",
          }),
        });

        if (!res.ok) throw new Error(`Failed to add ${product.description}`);
      }

      toast.success("All selected products added to cart!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while adding products!");
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
    return oldTotal ? Math.round(((oldTotal - total) / oldTotal) * 100) : 0;
  };

  if (loading) return <p className="text-center py-8">Loading products...</p>;
  if (!products.length)
    return <p className="text-center py-8">No products available.</p>;

  return (
    <div className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full mt-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-start">
        Complete Your Purchase with Other Products!
      </h2>
      <p className="text-gray-500 text-sm mb-8 text-start">
        The name on the romper will automatically be added here as well.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Product Cards */}
        <div className="flex flex-wrap gap-6 flex-1">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-row items-center rounded-md flex-1 min-w-[280px] max-w-[350px]"
            >
              <img
                src={product.mainImage}
                alt={product.description}
                className="w-1/3 h-40 object-cover  ms-4"
              />
              <CardContent className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-xs md:text-sm font-medium mb-1">
                  {product.description}
                </h3>
                <div className="flex flex-col gap-1">
                  {product.discount > 0 && (
                    <div className="bg-red-600 text-white text-[10px] font-semibold px-2 py-1 w-max mb-1">
                      %{product.discount}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400 text-[11px] md:text-xs">
                      €{product.oldPrice.toFixed(2)}
                    </span>
                    <span className="font-bold text-sm md:text-base text-teal-600">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Switch
                  className="mt-2 self-start"
                  checked={selectedProducts[product.id]}
                  onCheckedChange={() => handleSwitchChange(product)}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="flex-shrink-0 lg:w-1/4 mt-6 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-sm font-normal text-gray-500 flex items-center gap-2">
              <Info />
              These products will also be added to your cart along with the one
              you are viewing!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 border-t flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Total Savings</h4>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1">
                %{calculateDiscountPercentage()}
              </span>
              <span className="line-through text-gray-400">
                €{calculateOldTotal().toFixed(2)}
              </span>
              <span className="font-bold text-xl">
                €{calculateTotal().toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 rounded-none"
              onClick={handleAddAllToCart}
            >
              Add All to Cart ({products.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
