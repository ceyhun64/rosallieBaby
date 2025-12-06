// ProductDetail.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
import Bestseller from "@/components/products/bestseller";
import CompletePurchase from "@/components/products/completePurchase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import ReviewSection from "@/components/products/review";
// import { useCart } from "@/contexts/cartContext"; // Hypothetical useCart is no longer used
import { useFavorite } from "@/contexts/favoriteContext";
import { Skeleton } from "@/components/ui/skeleton";

// Import cart functions from utils/cart.js
// Adjust the actual path based on your project: "@/utils/cart" or "./utils/cart" etc.
import { addToGuestCart } from "@/utils/cart";

// ... ProductDetailSkeleton component (unchanged) ...
const ProductDetailSkeleton = ({ isMobile }) => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-0 md:py-8">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-16">
        {/* Image Gallery Skeleton */}
        <div className="flex gap-6">
          {!isMobile && (
            <div className="flex flex-col items-center gap-3 w-24">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-28 w-20 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          )}
          <Skeleton className="flex-1 h-[600px] rounded-lg" />
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="pb-6 border-b border-gray-200">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="flex items-center gap-6 py-4">
            <Skeleton className="h-10 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <Skeleton className="h-14 w-full rounded-none" />
            <Skeleton className="h-14 w-full rounded-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
// ...

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useParams();
  const completePurchaseRef = useRef(null);

  // ❌ useCart removed or ignored. Cart logic will be implemented locally.
  // const { addToCart } = useCart();

  const {
    isFavorited,
    addFavorite,
    removeFavorite,
    loading: favLoading,
  } = useFavorite();

  const isMobile = useIsMobile();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ⚡️ New: State for user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Zoom states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch product data
        const productRes = await fetch(`/api/products/${id}`);
        if (!productRes.ok) {
          throw new Error("Failed to fetch product data.");
        }
        const productData = await productRes.json();
        setProduct(productData.product);

        // 2. Check user login status
        const userRes = await fetch("/api/account/check", {
          method: "GET",
          credentials: "include", // To send cookies
        });
        const userData = await userRes.json();
        setIsLoggedIn(!!userData.user); // true if user object exists
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // 🆕 Show skeleton while loading
  if (isLoading) return <ProductDetailSkeleton isMobile={isMobile} />;

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Product not found.
      </div>
    );

  const total = product?.subImages.length || 0;
  const isFavorite = isFavorited(product.id);

  // ... Other handler functions (handleThumbUp, handleThumbDown, etc.) ...

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

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // 🚀 Updated: Add to Cart Logic (API vs Local Storage)
  const handleAddToCart = async () => {
    if (!product) return;

    // The basic data structure the API expects for POST /api/cart:
    // { productId, quantity, customName }
    // Other fields (image, price, title) will not be sent unnecessarily since the API doesn't use them.
    const apiProductData = {
      productId: product.id,
      quantity: 1, // Assumed fixed quantity of 1
      customName: null, // Can be left as null if no customization is available
    };

    // Data prepared for the guest cart (additional fields required for Local Storage):
    const guestProductData = {
      ...apiProductData,
      image: product.mainImage,
      price: product.price,
      productName: product.name,
      oldPrice: product.oldPrice,
      category: product.category,
      title: product.name,
      description: product.description,
    };

    try {
      if (isLoggedIn) {
        // --- FOR LOGGED-IN USER: USE API ---
        const res = await fetch("/api/cart", {
          // API path: /api/cart
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiProductData),
          credentials: "include",
        });

        // Check if the response from the API is JSON or contains an error
        const responseBody = await res.json();

        if (!res.ok) {
          // Server returned 4xx or 5xx.
          // This part is safer since your new API returns valid JSON (in responseBody).
          const errorMessage =
            responseBody.error || "Failed to add to cart via API.";
          throw new Error(errorMessage);
        }

        // Successful response
        // responseBody contains the created or updated cart item.
        toast.success(`${product.name} successfully added to your cart.`);
      } else {
        // --- FOR GUEST USER: USE LOCAL STORAGE ---
        addToGuestCart(guestProductData, 1);
        toast.success(`${product.name} successfully added to guest cart.`);
      }

      // Scroll the screen after adding to cart
      if (completePurchaseRef.current) {
        completePurchaseRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      // The error message now comes directly from error.message (API error JSON is caught)
      toast.error(
        `Error adding to cart: ${error.message || "Please try again."}`
      );
    }
  };

  // ... Other handler functions (handleWhatsapp, formatDescription, handleFavoriteToggle) ...

  const handleWhatsapp = () => {
    window.open("https://wa.me/905432266322", "_blank");
  };

  const formatDescription = (desc) => {
    return desc.split("\n").map((line, index) => {
      const isBold = line.includes("Set contents:");
      if (isBold) {
        return (
          <p key={index} className="font-semibold mt-6 text-lg">
            {line}
          </p>
        );
      }
      return (
        <p key={index} className="leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(product.id);
        toast.success("Product removed from favorites.");
      } else {
        await addFavorite(product.id);
        toast.success("Product added to favorites!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again!");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-0 md:py-8">
      {/* ... Remaining component content (unchanged) ... */}
      <Breadcrumb />

      {/* Premium Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-16">
        {/* Image Gallery - Premium Style */}
        {isMobile ? (
          <div className="flex justify-center items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 md:pb-4 w-full gap-4">
              {[
                product.mainImage,
                ...product.subImages.map((img) => img.url),
              ].map((imgUrl, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 snap-center flex justify-center bg-white rounded-xs overflow-hidden"
                >
                  <Image
                    src={imgUrl}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={300}
                    className="h-[300px] w-full object-contain cursor-pointer transition-transform hover:scale-105"
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
          <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col items-center gap-3 w-24">
              <button
                onClick={handleThumbUp}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronUp size={20} />
              </button>

              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-hidden overflow-x-hidden">
                <div
                  className={`flex justify-center items-center cursor-pointer border-2 p-2 duration-300 rounded-xs overflow-hidden ${
                    activeIndex === 0
                      ? "border-black shadow-lg scale-105"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveIndex(0)}
                >
                  <Image
                    src={product.mainImage}
                    alt="Main thumbnail"
                    width={80}
                    height={80}
                    className="h-28 w-auto object-contain"
                    unoptimized
                  />
                </div>

                {product.subImages.map((img, index) => {
                  const realIndex = index + 1;
                  return (
                    <div
                      key={realIndex}
                      className={`flex justify-center items-center cursor-pointer border-2 p-2 duration-300 rounded-xs overflow-hidden ${
                        activeIndex === realIndex
                          ? "border-black shadow-lg scale-105"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveIndex(realIndex)}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${realIndex}`}
                        width={80}
                        height={80}
                        className="h-28 w-auto object-contain"
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleThumbDown}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Main Image with Zoom */}
            <div className="relative flex-1 flex justify-center items-center bg-white rounded-xs overflow-hidden">
              <button
                onClick={handlePrevImage}
                className="absolute left-4 bg-white/90 backdrop-blur-sm p-3 shadow-lg hover:bg-white border border-gray-200 z-10 rounded-full transition-all"
              >
                <ChevronLeft size={24} />
              </button>

              <div
                ref={imageRef}
                className="relative h-[600px] w-[600px] cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={
                    activeIndex === 0
                      ? product.mainImage
                      : product.subImages[activeIndex - 1]?.url
                  }
                  alt={`Image ${activeIndex + 1}`}
                  fill
                  unoptimized
                  className={`object-contain rounded-xs transition-transform duration-200 ${
                    isZoomed ? "scale-150" : "scale-100"
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />
              </div>

              <button
                onClick={handleNextImage}
                className="absolute right-4 bg-white/90 backdrop-blur-sm p-3 shadow-lg hover:bg-white border border-gray-200 z-10 rounded-full transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Product Info - Premium Style */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-light tracking-wide text-gray-800">
              {product.name}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteToggle}
              className="hover:bg-gray-100 rounded-full transition-all"
            >
              <Heart
                size={28}
                strokeWidth={1.5}
                fill={isFavorite ? "black" : "none"}
                color={isFavorite ? "black" : "currentColor"}
                className="transition-all"
              />
            </Button>
          </div>

          {/* Price Section - Premium */}
          <div className="flex items-center gap-6 py-4">
            <span className="bg-black text-white px-4 py-2 text-sm font-medium tracking-wider">
              -{product.discount}%
            </span>
            <div className="flex flex-col">
              <span className="text-lg line-through text-gray-400">
                €{product.oldPrice.toFixed(2)}
              </span>
              <span className="font-semibold text-3xl text-black">
                €{product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Premium Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            <Button
              className="w-full py-7 text-base font-medium bg-black hover:bg-gray-800 transition-all duration-300 rounded-none tracking-wider"
              onClick={handleAddToCart} // ✨ Updated function
            >
              <ShoppingCart size={20} className="mr-3" />
              ADD TO CART
            </Button>
            <Button
              variant="outline"
              className="w-full py-7 text-base font-medium border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-none tracking-wider"
              onClick={handleWhatsapp}
            >
              CONTACT VIA WHATSAPP
            </Button>
          </div>

          {/* Premium Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Truck size={28} className="text-gray-700" />
              <div>
                <p className="font-medium text-sm">Fast Shipping</p>
                <p className="text-xs text-gray-600">
                  Ships in 3 Business Days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Gift size={28} className="text-gray-700" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600">Over €99</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Purchase Section */}
      <div ref={completePurchaseRef}>
        <CompletePurchase />
      </div>

      {/* Premium Description Section */}
      <div className="mt-16 mb-16 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light tracking-wide text-gray-800 mb-4">
            Product Description
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
        </div>
        <div className="text-gray-700 leading-relaxed space-y-4 text-center">
          {formatDescription(product.description)}
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection productId={product.id} productName={product.name} />

      <Bestseller />

      {/* Premium Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-50"
            >
              <X className="h-5 w-5" />
            </button>

            <Image
              src={
                activeIndex === 0
                  ? product.mainImage
                  : product.subImages[activeIndex - 1]?.url
              }
              alt="Product Image"
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
