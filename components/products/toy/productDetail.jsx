"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquareText, Star, X, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  ShoppingCart,
  Heart,
  Truck,
  Gift,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/layout/breadcrumb";
import Bestseller from "./bestseller";
import CompletePurchase from "./completePurchase";
import { useIsMobile } from "@/hooks/use-mobile";

const products = [
  {
    id: 1,
    name: "Astronaut Muslin Hospital Outfit 8-Piece Set",
    mainImage: "/allProducts/product1main.webp",
    subImages: [
      "/allProducts/product1main.webp",
      "/allProducts/product1sub.webp",
      "/allProducts/product2sub.webp",
      "/allProducts/product3sub.webp",
    ],
    description: `A perfect choice for newborn photos, the Astronaut Muslin Hospital Outfit 6-Piece Set offers a soft texture with 4 layers of muslin fabric to protect your baby's sensitive skin. Its elegant and comfortable design makes the first days unforgettable.
    Set contents:
    Embroidered toy
    Embroidered pillowcase
    Embroidered jumpsuit
    Hat
    Gloves
    Bib`,
    oldPrice: 2999,
    price: 2399,
    discount: 20,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState("plain");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const [selectedStars, setSelectedStars] = useState(0);

  const product = products.find((p) => p.id === parseInt(id));

  const [activeIndex, setActiveIndex] = useState(0);
  const total = product?.subImages.length || 0;

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Product not found.
      </div>
    );
  }

  const handleThumbUp = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleThumbDown = () => {
    if (activeIndex < total - 1) setActiveIndex(activeIndex + 1);
  };

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    toast.success("Product added to cart!");
  };

  const handleWhatsapp = () => {
    window.open("https://wa.me/905551234567", "_blank");
  };

  const formatDescription = (desc) => {
    return desc.split("\n").map((line, index) => {
      const isBold = line.includes("Set contents:");
      if (isBold) {
        return (
          <p key={index} className="font-bold mt-4">
            {line}
          </p>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  const handleOpenReviewModal = () => setIsReviewModalOpen(true);
  const handleCloseReviewModal = () => setIsReviewModalOpen(false);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Breadcrumb />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isMobile ? (
          <div className="lg:col-span-2 flex justify-center items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory w-full pb-4">
              {product.subImages.map((img, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 snap-center flex justify-center"
                >
                  <Image
                    src={img}
                    alt={`Image ${index + 1}`}
                    width={500}
                    height={500}
                    className="h-[270px] w-full object-contain cursor-pointer"
                    onClick={() => {
                      setActiveIndex(index);
                      setIsImageModalOpen(true);
                    }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 lg:col-span-2">
            <div className="flex flex-col items-center gap-2 w-28">
              <button
                onClick={handleThumbUp}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <ChevronUp size={20} />
              </button>

              <div className="flex flex-col gap-2">
                {product.subImages
                  .slice(activeIndex, activeIndex + 3)
                  .map((img, index) => {
                    const realIndex = activeIndex + index;
                    return (
                      <div
                        key={realIndex}
                        className={`flex justify-center items-center cursor-pointer ${
                          realIndex === activeIndex
                            ? "border-gray-900"
                            : "border-transparent hover:border-gray-400"
                        }`}
                        onClick={() => setActiveIndex(realIndex)}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${realIndex + 1}`}
                          width={80}
                          height={120}
                          className="h-24 w-auto object-contain"
                          unoptimized
                        />
                      </div>
                    );
                  })}
              </div>

              <button
                onClick={handleThumbDown}
                className="p-1 hover:bg-gray-200"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            <div className="relative flex-1 flex justify-center items-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-2 bg-white p-2 shadow hover:bg-gray-100 border border-gray-400"
              >
                <ChevronLeft size={24} />
              </button>

              <Image
                src={product.subImages[activeIndex]}
                alt="Main Image"
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                className="h-[600px] w-auto object-contain cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />

              <button
                onClick={handleNextImage}
                className="absolute right-2 bg-white p-2 shadow hover:bg-gray-100 border border-gray-400"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5 lg:col-span-1">
          <div className="flex justify-between items-start">
            <h1 className="text-sm">{product.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-red-500"
            >
              <Heart size={30} strokeWidth={2} />
            </Button>
          </div>
          <div className="flex items-start gap-1 sm:gap-4 text-base sm:text-lg">
            <span className="bg-stone-700 text-white px-2 py-3 sm:px-1 sm:py-2 rounded-none font-bold text-xs sm:text-sm">
              % {product.discount}
            </span>
            <div className="flex flex-col leading-none ms-1">
              <span className="text-ms sm:text-md md:text-lg line-through text-gray-400">
                € {product.oldPrice.toFixed(2)}
              </span>
              <span className="font-bold text-stone-700 text-base sm:text-sm">
                € {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              className="w-full py-6 text-base font-bold bg-[#809363] hover:bg-orange-500 transition-colors rounded-full text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={20} className="mr-2" />
              ADD TO CART
            </Button>
            <Button
              className="w-full py-6 text-base font-bold bg-[#809363] hover:bg-green-800 transition-colors rounded-full text-white"
              onClick={handleWhatsapp}
            >
              WHATSAPP
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center gap-2">
              <Truck size={24} />
              <div>
                <span className="font-bold">Ships in 3 Business Days</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gift size={24} />
              <div>
                <span className="font-bold">Free Shipping Over 999 TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CompletePurchase />
      <div className="mt-8 flex flex-col items-start md:items-center text-left md:text-center">
        <h2 className="text-xl font-medium text-green-800">
          Product Description
        </h2>
        <div className="w-16 h-0.5 bg-green-800 mt-2"></div>
        <div className="w-full max-w-2xl mt-8 text-left md:text-center text-gray-700">
          {formatDescription(product.description)}
        </div>
      </div>

      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-800">Reviews</h3>
          <Button
            variant="ghost"
            className="text-green-800 font-medium hover:bg-gray-100"
            onClick={handleOpenReviewModal}
          >
            <MessageSquareText size={18} className="mr-2" />
            Write a Review
          </Button>
        </div>
        <div className="border border-gray-200 p-4 rounded-md">
          <p className="text-gray-500 text-sm">
            No reviews yet for this product.
          </p>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Reviews</h3>
              <Button
                variant="ghost"
                onClick={handleCloseReviewModal}
                className="text-gray-500 hover:bg-gray-100"
              >
                Close
                <X size={18} className="ml-2" />
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <Label
                  htmlFor="stars"
                  className="text-sm font-semibold text-gray-700"
                >
                  Stars <span className="text-red-500">*</span>
                </Label>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <Star
                        key={ratingValue}
                        size={24}
                        onClick={() => setSelectedStars(ratingValue)}
                        className={`cursor-pointer transition-colors duration-200 ${
                          ratingValue <= selectedStars
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Write your title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="comment"
                  className="text-sm font-semibold text-gray-700"
                >
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="comment"
                  rows={4}
                  placeholder="Write your review here..."
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                />
              </div>

              <Button className="w-full py-4 bg-green-700 text-white font-bold hover:bg-green-800 transition rounded-md">
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      <Bestseller />

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 z-50"
            >
              <X size={28} />
            </button>

            <Image
              src={product.subImages[activeIndex]}
              alt="Main Image"
              width={0}
              height={0}
              sizes="100vw"
              unoptimized
              className="max-h-screen w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
