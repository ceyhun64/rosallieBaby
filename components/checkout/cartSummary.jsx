"use client";
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
  /**
   * Normalizes both guest + logged-in user cart formats
   * @param {object} item - Cart item (guest or authenticated)
   * @returns {object} Normalized format
   */
  const normalizeItem = (item) => {
    // Logged-in user format (nested product object)
    if (item.product) {
      return {
        productId: item.productId || item.product.id,
        title: item.product.name,
        image: item.product.mainImage,
        price: item.product.price,
        oldPrice: item.product.oldPrice,
        quantity: item.quantity,
        customName: item.customName,
      };
    }

    // Guest format (flat structure)
    return {
      productId: item.productId,
      title: item.title,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice,
      quantity: item.quantity,
      customName: item.customName,
    };
  };

  /**
   * Returns product details such as personalization
   */
  const getItemDetails = (customName) => {
    const details = [];
    if (customName && customName.toLowerCase() !== "none") {
      details.push(`Personalization: "${customName}"`);
    }
    return details;
  };

  return (
    <Card className="sticky top-6 lg:h-fit p-4">
      <CardHeader>
        <CardTitle className="text-xl">Basket Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product List */}
        <div className="space-y-4">
          {basketItemsData.map((item) => {
            const normalized = normalizeItem(item);
            const details = getItemDetails(normalized.customName);

            return (
              <div
                key={normalized.productId}
                className="flex items-center space-x-4"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <Image
                    src={normalized.image}
                    alt={normalized.title}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-grow">
                  <p className="font-semibold text-sm">{normalized.title}</p>

                  {details.length > 0 && (
                    <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                      {details.map((detail, index) => (
                        <p key={index}>{detail}</p>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    {normalized.quantity} pcs
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-medium text-red-500">
                    {(normalized.price * normalized.quantity).toFixed(2)}₺
                  </span>

                  {normalized.oldPrice > normalized.price && (
                    <span className="text-xs line-through text-gray-400">
                      {(normalized.oldPrice * normalized.quantity).toFixed(2)}₺
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
            <span className="font-medium">{subTotal.toFixed(2)}₺</span>
          </div>

          <div className="flex justify-between font-normal">
            <span>Shipping Fee</span>
            <span
              className={`font-medium ${
                selectedCargoFee === 0 ? "text-green-600" : ""
              }`}
            >
              {selectedCargoFee === 0
                ? "Free"
                : `+${selectedCargoFee.toFixed(2)}₺`}
            </span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span>{totalPrice.toFixed(2)}₺</span>
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
