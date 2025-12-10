"use client";
import Image from "next/image";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useFavorite } from "@/contexts/favoriteContext";

// Guest cart utils
import { addToGuestCart } from "@/utils/cart";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  const { addFavorite, removeFavorite, isFavorited } = useFavorite();
  const favorited = isFavorited(product.id);

  // Check if the user is logged in
  const checkLoginStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/account/check", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data?.user?.id;
    } catch {
      return false;
    }
  }, []);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    favorited ? removeFavorite(product.id) : addFavorite(product.id);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (product.category === "hospital_outfit_special_set") {
      window.location.href = `/all_products/${product.category}/${product.id}`;
      return;
    }

    setLoading(true);

    const itemData = {
      productId: product.id,
      quantity: 1,
      customName: "none",
      image: product.mainImage,
      price: product.price,
      title: product.name,
      oldPrice: product.oldPrice,
      category: product.category,
      description: product.description,
    };

    try {
      const isLoggedIn = await checkLoginStatus();

      if (isLoggedIn) {
        // Logged-in user → API cart update
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: itemData.productId,
            quantity: itemData.quantity,
            customName: itemData.customName,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to add to cart.");
        }

        window.dispatchEvent(new CustomEvent("cartUpdated"));
        toast.success(`${product.name} added to cart!`, {
          description: "Your cart has been updated.",
        });
      } else {
        // Guest user → Local storage cart
        addToGuestCart(itemData, 1);
        toast.success(`${product.name} added to cart!`, {
          description: "Your cart was updated locally.",
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.message || "An error occurred while adding the item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group w-full cursor-pointer flex flex-col bg-white transition-all duration-500 hover:shadow-2xl">
      <div
        className="overflow-hidden relative flex-1 bg-gray-50"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <Link href={`/all_products/${product.category}/${product.id}`}>
          <div className="relative w-full aspect-[1] overflow-hidden">
            {/* Product Image */}
            <Image
              src={
                !isMobile && isHovered && product.subImages?.[0]?.url
                  ? product.subImages[0].url
                  : product.mainImage
              }
              alt={product.description}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105"
            />

            {/* Hover overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500" />
            )}

            {/* Discount badge */}
            {product.discount > 0 && (
              <div className="absolute top-1.5 left-1.5 md:top-4 md:left-4 z-10">
                <div className="bg-black text-white px-1.5 py-0.5 md:px-3 md:py-1.5 text-xs font-medium tracking-wider">
                  -{product.discount}%
                </div>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-1 right-1 md:top-4 md:right-4 z-20 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white/90 transition"
              aria-label="Add to favorites"
            >
              <Heart
                size={isMobile ? 14 : 20}
                className={`transition-transform ${
                  favorited ? "text-red-500 fill-red-500" : "text-gray-400"
                }`}
              />
            </button>

            {/* Action Buttons */}
            {(isMobile || isHovered) && (
              <div className="absolute inset-x-0 bottom-0 p-0 md:p-4">
                {product.customName ? (
                  <button
                    onClick={() =>
                      (window.location.href = `/all_products/${product.category}/${product.id}`)
                    }
                    className="w-full bg-white/80 text-black font-medium py-3 px-3 flex items-center justify-center gap-2 text-sm"
                    aria-label="Preview"
                  >
                    <Eye size={isMobile ? 14 : 20} />
                    <span className="text-xs md:text-sm">PREVIEW</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="w-full bg-white/80 text-black font-medium py-3 px-3 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={isMobile ? 14 : 20} />
                    <span className="text-xs md:text-sm">
                      {loading ? "ADDING..." : "ADD TO CART"}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-5 text-center bg-white transition-all duration-300 group-hover:bg-gray-50">
        <p className="text-xs md:text-sm text-gray-600 mb-0 line-clamp-2 leading-relaxed tracking-wide min-h-[40px]">
          {product.name}
        </p>

        {!isMobile && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed tracking-wide min-h-[40px]">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1">
            {product.oldPrice > product.price && (
              <span className="text-gray-400 line-through text-xs tracking-wide">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}

            <span className="text-lg md:text-xl font-semibold text-black tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
