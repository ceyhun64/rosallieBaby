"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const products = [
  {
    id: 1,
    name: "Tugkan",
    mainImage: "/allProducts/product1main.webp",
    subImage1: "/allProducts/product1sub.webp",
    description: "Anchor Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 17,
  },
  {
    id: 2,
    name: "Defne",
    mainImage: "/allProducts/product2main.webp",
    subImage1: "/allProducts/product2sub.webp",
    description: "Flowery Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2399,
    price: 1899,
    discount: 24,
  },
  {
    id: 3,
    name: "Sarp",
    mainImage: "/allProducts/product3main.webp",
    subImage1: "/allProducts/product3sub.webp",
    description: "Rabbit Muslin 6-Piece Baby Hospital Outfit Set",
    oldPrice: 2299,
    price: 1999,
    discount: 13,
  },
];

export default function CompletePurchase() {
  const isMobile = useIsMobile();

  const calculateTotal = () =>
    products.reduce((acc, product) => acc + product.price, 0);
  const calculateOldTotal = () =>
    products.reduce((acc, product) => acc + product.oldPrice, 0);
  const calculateDiscountPercentage = () => {
    const oldTotal = calculateOldTotal();
    const total = calculateTotal();
    return Math.round(((oldTotal - total) / oldTotal) * 100);
  };

  return (
    <div className="flex flex-col px-4 md:px-8 lg:px-16 py-8 w-full mt-8">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-start">
        Complete Your Purchase with Other Products!
      </h2>
      <p className="text-gray-500 text-sm mb-8 text-start">
        The name on the romper will automatically be added here as well.
      </p>

      {/* Ürünler ve Summary */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Ürün Kartları */}
        <div className="flex flex-wrap gap-6 flex-1">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-row items-center rounded-md flex-1 min-w-[280px] max-w-[350px]"
            >
              <img
                src={product.mainImage}
                alt={product.description}
                className="w-1/3 h-40 object-cover rounded-lg ms-4"
              />

              <CardContent className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-sm md:text-base font-medium mb-1">
                  {product.description}
                </h3>

                <div className="flex flex-col gap-1">
                  {product.discount > 0 && (
                    <div className="bg-red-600 text-white text-xs font-semibold px-2 py-1 w-max mb-1">
                      %{product.discount}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400 text-xs md:text-sm">
                      €{product.oldPrice.toFixed(2)}
                    </span>
                    <span className="font-bold text-base md:text-lg text-teal-600">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Switch className="mt-2 self-start" />
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
            <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-none">
              Add All to Cart ({products.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
