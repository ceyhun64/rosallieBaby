import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function BasketSummaryCard({
  basketItemsData,
  subTotal,
  selectedCargoFee,
  totalPrice,
}) {
  // Construct item details based on the new data structure
  const getItemDetails = (item) => {
    const details = [];
    if (item.customName) {
      details.push(`Personalization: "${item.customName}"`);
    }
   
    return details;
  };

  //kedlkekdşlkşede

  return (
    <Card className="sticky top-6 lg:h-fit p-4">
      <CardHeader>
        <CardTitle className="text-xl">Basket Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product List */}
        <div className="space-y-4">
          {basketItemsData.map((item) => {
            if (!item.product) return null;

            const product = item.product;
            const details = getItemDetails(item);

            return (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-xl">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    width={50}
                    height={100}
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-sm">{product.name}</p>
                  {details.length > 0 && (
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {details.map((detail, index) => (
                        <p key={index}>{detail}</p>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {item.quantity} pcs
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-medium text-red-500">
                    {(product.price * item.quantity).toFixed(2)}€
                  </span>
                  {product.oldPrice > product.price && (
                    <span className="text-xs line-through text-gray-400">
                      {(product.oldPrice * item.quantity).toFixed(2)}€
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Price Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-normal">
            <span>Subtotal</span>
            <span className="font-medium">{subTotal.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-normal">
            <span>Shipping / Delivery</span>
            <span
              className={`font-medium ${
                selectedCargoFee === 0 ? "text-green-600" : ""
              }`}
            >
              {selectedCargoFee === 0
                ? "Free"
                : `+${selectedCargoFee.toFixed(2)}€`}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{totalPrice.toFixed(2)}€</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/cart" className="w-full">
          <Button variant="outline" className="w-full">
            Edit Basket
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
