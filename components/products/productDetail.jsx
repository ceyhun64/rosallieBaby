// ProductDetail.jsx - Updated Design based on product_example_johnp.html
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Check, Info, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Heart, Truck, Zap, Clock, Leaf, Camera } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/layout/breadcrumb";
import Bestseller from "@/components/products/bestseller";
import CompletePurchase from "@/components/products/completePurchase";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import ReviewSection from "@/components/products/review";
import { useFavorite } from "@/contexts/favoriteContext";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSchema from "@/components/seo/ProductSchema";
import { addToGuestCart } from "@/utils/cart";

// Skeleton Component
function ProductDetailSkeleton({ isMobile }) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-10">
      <div className="mb-6">
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-[60px]">
        <div>
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex gap-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useParams();
  const completePurchaseRef = useRef(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  const [customName, setCustomName] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Zoom states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState("details");

  useEffect(() => {
    async function fetchProductAndUserStatus() {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch product data.");
        }
        const data = await res.json();
        setProduct(data.product);

        const userRes = await fetch("/api/account/check", {
          method: "GET",
          credentials: "include",
        });
        const userData = await userRes.json();
        setIsLoggedIn(!!userData.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductAndUserStatus();
  }, [id]);

  // Update char count when customName changes
  useEffect(() => {
    setCharCount(customName.length);
  }, [customName]);

  if (isLoading || favLoading)
    return <ProductDetailSkeleton isMobile={isMobile} />;

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

  const allImages = [product.mainImage, ...(product.subImages?.map(img => img.url) || [])];
  const total = allImages.length;
  const isFavorite = isFavorited(product.id);

  const handleThumbUp = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleThumbDown = () => {
    if (activeIndex < total - 1) setActiveIndex(activeIndex + 1);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const trimmedName = customName.trim();

    if (product.customName && !trimmedName) {
      toast.error("Please enter your name!");
      return;
    }

    setIsAddingToCart(true);

    const productDetails = {
      productId: product.id,
      quantity: 1,
      customName: trimmedName || "none",
      image: product.mainImage,
      price: product.price,
      title: product.name,
      oldPrice: product.oldPrice,
      category: product.category,
      description: product.description,
    };

    try {
      if (isLoggedIn) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productDetails),
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to add product to cart via API.");
        }
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        toast.success(`Product '${trimmedName || product.name}' added to your cart!`);
      } else {
        addToGuestCart(productDetails, 1);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        toast.success(`Product '${trimmedName || product.name}' added to your cart!`);
      }

      setCustomName("");

      if (completePurchaseRef.current) {
        completePurchaseRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(`Error adding to cart: ${error.message || "Please try again."}`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWhatsapp = () => {
    window.open("https://wa.me/905432266322", "_blank");
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

  const saveAmount = product.oldPrice ? (product.oldPrice - product.price).toFixed(2) : 0;

  return (
    <div className="bg-white">
      {/* Product Schema for SEO */}
      {product && <ProductSchema product={product} reviews={product.reviews || []} />}

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-[60px]">
          <Breadcrumb />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-[60px] py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-[60px]">

          {/* ===== GALLERY SECTION ===== */}
          <div className="lg:sticky lg:top-[120px] self-start">
            {/* Main Image Container with Navigation */}
            <div className="relative group">
              <div
                ref={imageRef}
                className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#f5f1eb] cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => !isMobile && setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={allImages[activeIndex]}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-200 ${isZoomed ? "scale-150" : "scale-100"}`}
                  style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                  priority
                  unoptimized
                />
              </div>

              {/* Navigation Arrows - Hover'da görünür */}
              {total > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleThumbUp(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleThumbDown(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-black hover:text-white z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeIndex === index ? "border-black" : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ===== PRODUCT INFO SECTION ===== */}
          <div className="pt-2">
            {/* Category */}
            <p className="text-[#8b7355] text-[11px] uppercase tracking-[2px] font-semibold mb-3">
              {product.category?.replace(/_/g, " ")}
            </p>

            {/* Title */}
            <h1 className="font-serif text-[28px] md:text-[32px] font-medium mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[#d4a853] text-sm">★★★★★</span>
              <span className="text-gray-500 text-[13px]">4.9 (127 reviews)</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <span className="text-[28px] font-semibold">${product.price.toFixed(2)}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                  <span className="bg-[#f0e6d8] text-[#8b7355] px-3 py-1.5 rounded text-xs font-semibold">
                    Save ${saveAmount}
                  </span>
                </>
              )}
            </div>

            {/* Hook / Emotional Quote */}
            {(product.hookQuote || true) && (
              <p className="font-serif text-xl italic text-[#8b7355] mb-4 leading-relaxed">
                "{product.hookQuote || "The outfit they'll wear in those first precious photos — the ones you'll treasure for a lifetime."}"
              </p>
            )}

            {/* Description */}
            <p className="text-gray-500 text-sm leading-[1.8] mb-4">
              {product.description || "Your baby's arrival is a moment like no other. The first time you hold them, the first photo in the hospital, the journey home — these are memories that deserve to be wrapped in something truly special."}
            </p>

            {/* Highlight Box */}
            {(product.highlightBox || true) && (
              <div className="bg-[#faf8f5] p-4 rounded-lg border-l-4 border-[#8b7355] mb-6">
                <p className="text-sm text-gray-600 italic flex items-start gap-2">
                  <Camera className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {product.highlightBox || "Perfect for newborn photoshoots, hospital coming-home moments, and that very first \"hello world\" announcement."}
                </p>
              </div>
            )}

            {/* Set Includes */}
            <div className="bg-[#faf8f5] rounded-lg p-5 mb-6">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                🎁 This Complete Set Includes:
              </h3>
              <ul className="grid grid-cols-2 gap-2.5">
                {[
                  "Personalized Romper with embroidered name",
                  "Matching Bonnet Hat with ruffles",
                  "Personalized Muslin Blanket with ruffles",
                  "Personalized Star Pillow",
                  "Soft Cotton Mittens",
                  "Matching Bib"
                ].map((item, index) => (
                  <li key={index} className="text-gray-600 text-[13px] flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Details Box */}
            <div className="border border-gray-200 rounded-lg p-5 mb-6">
              {(() => {
                // Kategori bazlı detaylar
                const categoryDetails = {
                  hospital_outfit_special_set: [
                    { label: "📏 Size", value: "0-6 Months (One Size)" },
                    { label: "🧵 Material", value: "100% Organic Muslin Cotton" },
                    { label: "✨ Embroidery Style", value: "Custom Hand Embroidery" },
                    { label: "🎨 Thread Color", value: "As Shown in Photos" }
                  ],
                  hospital_outfit_set: [
                    { label: "📏 Size", value: "3-9 Months (One Size)" },
                    { label: "🧵 Material", value: "100% Organic Muslin Cotton" },
                    { label: "💎 Design", value: "Premium Ready-to-Wear" },
                    { label: "📸 Perfect For", value: "Photoshoots & Special Occasions" }
                  ],
                  blanket: [
                    { label: "📐 Dimensions", value: "90x100 cm" },
                    { label: "🧵 Material", value: "100% Organic Muslin Cotton" },
                    { label: "✨ Embroidery Style", value: "Custom Hand Embroidery" },
                    { label: "🎨 Thread Color", value: "As Shown in Photos" }
                  ],
                  toy: [
                    { label: "📏 Size", value: "Suitable for 0+ Months" },
                    { label: "🧵 Material", value: "100% Organic Cotton" },
                    { label: "🛡️ Safety", value: "CE Certified, Baby Safe" },
                    { label: "🎨 Color", value: "As Shown in Photos" }
                  ]
                };

                const details = categoryDetails[product.category] || categoryDetails.hospital_outfit_special_set;

                return details.map((detail, index, arr) => (
                  <div
                    key={index}
                    className={`flex justify-between py-2.5 text-[13px] ${index !== arr.length - 1 ? "border-b border-gray-200" : ""}`}
                  >
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ));
              })()}
            </div>

            {/* Personalization Input */}
            {product.customName && (
              <div className="bg-[#f5f1eb] rounded-lg p-5 mb-6">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  ✍️ Enter Baby's Name for Personalization
                </h3>
                <Input
                  type="text"
                  placeholder="Enter name (max 12 characters)"
                  maxLength={12}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full py-3.5 px-4 border border-gray-200 rounded-md text-[15px] focus:border-black focus:ring-0"
                />
                <p className="text-right text-[11px] text-gray-400 mt-1.5">
                  <span>{charCount}</span>/12 characters
                </p>
                <div className="bg-white p-3 rounded-md mt-3 flex gap-2 text-xs text-gray-500">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>The name will be embroidered exactly as you enter it. Please double-check the spelling.</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-[18px] h-auto bg-black hover:bg-[#8b7355] text-white font-medium rounded-md transition-all"
              >
                {isAddingToCart ? "Adding..." : `Add to Cart — $${product.price.toFixed(2)}`}
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsapp}
                className="w-full py-[18px] h-auto border-2 border-black hover:bg-black hover:text-white font-medium rounded-md transition-all"
              >
                CONTACT VIA WHATSAPP
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200 mb-6">
              <div className="flex items-center gap-2.5 text-xs">
                <Truck className="w-5 h-5 text-gray-700" />
                <div>
                  <strong className="block">Standard Shipping $12.99</strong>
                  <span className="text-gray-400 text-[11px]">FREE over $250</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Zap className="w-5 h-5 text-gray-700" />
                <div>
                  <strong className="block">Express Shipping $24.99</strong>
                  <span className="text-gray-400 text-[11px]">Always $24.99</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Clock className="w-5 h-5 text-gray-700" />
                <div>
                  <strong className="block">Ships in 3-5 Days</strong>
                  <span className="text-gray-400 text-[11px]">Hand-embroidered</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Leaf className="w-5 h-5 text-gray-700" />
                <div>
                  <strong className="block">100% Organic Cotton</strong>
                  <span className="text-gray-400 text-[11px]">GOTS Certified</span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-0">
              {/* Product Details Accordion */}
              <details open className="border-b border-gray-200">
                <summary className="py-4 cursor-pointer font-medium text-sm flex justify-between items-center list-none">
                  Product Details
                  <span className="text-lg">+</span>
                </summary>
                <div className="pb-5 text-gray-500 text-[13px] leading-[1.8]">
                  <ul className="space-y-2">
                    <li><strong>Material:</strong> 100% GOTS Certified Organic Muslin Cotton</li>
                    <li><strong>Certifications:</strong> Oeko-Tex Standard 100, CPSC Compliant</li>
                    <li><strong>Embroidery:</strong> Hand-stitched with baby-safe brown thread</li>
                    <li><strong>Size:</strong> 0-3 Months (fits babies up to 14 lbs)</li>
                    <li><strong>Made In:</strong> Handcrafted with love</li>
                  </ul>
                </div>
              </details>

              {/* Shipping Accordion */}
              <details className="border-b border-gray-200">
                <summary className="py-4 cursor-pointer font-medium text-sm flex justify-between items-center list-none">
                  Shipping Information
                  <span className="text-lg">+</span>
                </summary>
                <div className="pb-5 text-gray-500 text-[13px] leading-[1.8]">
                  <p><strong>Production Time:</strong> 3-5 business days (each piece is hand-embroidered)</p>
                  <p className="mt-3"><strong>Standard:</strong> 5-7 days - $12.99 (FREE over $250)</p>
                  <p><strong>Express:</strong> 2-3 days - $24.99</p>
                </div>
              </details>

              {/* Care Instructions Accordion */}
              <details className="border-b border-gray-200">
                <summary className="py-4 cursor-pointer font-medium text-sm flex justify-between items-center list-none">
                  Care Instructions
                  <span className="text-lg">+</span>
                </summary>
                <div className="pb-5 text-gray-500 text-[13px] leading-[1.8]">
                  <ul className="space-y-2">
                    <li>✓ Machine wash cold, gentle cycle</li>
                    <li>✓ Use mild, fragrance-free detergent</li>
                    <li>✓ Tumble dry low or lay flat to dry</li>
                    <li>✗ Do not bleach</li>
                    <li>✓ Iron on low (avoid embroidered areas)</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-[#faf8f5] py-[60px]">
        <div className="max-w-[900px] mx-auto px-4 md:px-10">
          <ReviewSection productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* Complete Purchase Section */}
      <div ref={completePurchaseRef} className="py-[60px]">
        <CompletePurchase />
      </div>

      {/* Bestseller */}
      <Bestseller />

      {/* Image Modal / Lightbox */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm outline-none"
          onClick={() => setIsImageModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsImageModalOpen(false);
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              setActiveIndex((prev) => (prev - 1 + total) % total);
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              setActiveIndex((prev) => (prev + 1) % total);
            }
          }}
          tabIndex={0}
          ref={(el) => el && el.focus()}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all z-[10000] hover:scale-110"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Arrows in Modal */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev - 1 + total) % total); }}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:scale-110 z-[10000]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev + 1) % total); }}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:scale-110 z-[10000]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main Image */}
            <Image
              src={allImages[activeIndex]}
              alt="Product Image"
              width={0}
              height={0}
              sizes="100vw"
              unoptimized
              className="max-h-[85vh] max-w-[85vw] w-auto object-contain rounded-lg animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {activeIndex + 1} / {total}
            </div>

            {/* Thumbnail Strip in Modal */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(index); }}
                  className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeIndex === index ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
