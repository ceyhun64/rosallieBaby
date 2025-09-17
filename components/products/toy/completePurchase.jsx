// src/components/CompletePurchase.jsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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

      <div className="flex gap-6 w-full">
        {/* Product Cards: vertical layout */}
        <div className="flex gap-4 flex-1">
          {products.map((product) => (
            <Card key={product.id} className="flex-1">
              <CardContent className="p-4 flex flex-col items-center gap-4">
                {/* Vertical image */}
                <img
                  src={product.mainImage}
                  alt={product.description}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {/* Product info */}
                <div className="flex flex-col items-center text-center gap-2">
                  <h3 className="text-lg font-medium">{product.description}</h3>
                  <div className="flex items-center gap-2 justify-center mt-2">
                    <span className="text-red-600 font-semibold">
                      %{product.discount}
                    </span>
                    <span className="line-through text-gray-400">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                    <span className="font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <Switch className="mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="lg:w-1/3 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-base font-normal text-gray-500 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
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
                ${calculateOldTotal().toFixed(2)}
              </span>
              <span className="font-bold text-xl">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              Add All to Cart ({products.length})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
