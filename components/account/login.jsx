"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Local Storage Keys
const CART_KEY = "guestCart";
const FAVORITES_KEY = "favorites";

// --- Local Storage Helper Functions: Cart ---

// Helper function: Safely retrieves the cart from Local Storage.
function getGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Local Storage cart parse error:", error);
    return [];
  }
}

// Helper function: Updates/writes the cart to Local Storage.
function setGuestCart(cartItems) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  // Dispatch event to notify listeners (e.g., cart components)
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

// --- Local Storage Helper Functions: Favorites ---

// Helper function: Safely retrieves favorites from Local Storage.
function getGuestFavorites() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    // Favorites are stored as an array of IDs: [6, 8]
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Local Storage favorites parse error:", error);
    return [];
  }
}

// Helper function: Updates/writes favorites to Local Storage.
function setGuestFavorites(favoriteIds) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  // Dispatch event to notify listeners (e.g., heart icons)
  window.dispatchEvent(new CustomEvent("favoritesUpdated"));
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 The main login handler which includes synchronization logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    toast.loading("Signing In...", {
      id: "login",
    });

    // 1. Sign In with Next-Auth
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    // Login failed
    if (result.error) {
      toast.error("Invalid email or password", { id: "login" });
      setIsLoading(false);
      return;
    }

    // Login successful
    if (result.ok) {
      let syncPromises = [];
      // NEW ARRAYS TO TRACK FAILED ITEMS FOR PARTIAL SYNCHRONIZATION
      let failedCartItems = [];
      let failedFavoriteIds = [];

      // ----------------------------------------------------
      // A. CART SYNCHRONIZATION
      // ----------------------------------------------------
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        toast.info("Synchronizing your cart...", {
          id: "cart-sync",
          duration: 2000,
        });

        const cartSyncPromises = guestCart.map((item) => {
          const payload = {
            productId: item.productId,
            quantity: item.quantity,
            customName: item.customName || "",
          };

          return fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          })
            .then((res) => {
              if (!res.ok) {
                console.error(
                  `Failed to sync cart item ${item.productId}. Status: ${res.status}`
                );
                failedCartItems.push(item); // RECORD THE FAILED ITEM
                return { success: false };
              }
              return { success: true };
            })
            .catch((e) => {
              console.error("Cart synchronization error:", e);
              failedCartItems.push(item); // RECORD THE ERRORED ITEM
              return { success: false };
            });
        });
        syncPromises.push(...cartSyncPromises);
      }

      // ----------------------------------------------------
      // B. FAVORITES SYNCHRONIZATION
      // ----------------------------------------------------
      const guestFavorites = getGuestFavorites();
      if (guestFavorites.length > 0) {
        toast.info("Synchronizing your favorite items...", {
          id: "favorites-sync",
          duration: 2000,
        });

        const favoriteSyncPromises = guestFavorites.map((productId) => {
          // Since local storage favorites are just an array of productIds,
          // we send a request for each ID to the API.
          const payload = { productId };

          return fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          })
            .then((res) => {
              // We consider it successful if status is 200 (OK) or 400 (Already added)
              if (!res.ok && res.status !== 400) {
                console.error(
                  `Failed to sync favorite ID ${productId}. Status: ${res.status}`
                );
                failedFavoriteIds.push(productId); // RECORD THE FAILED ID
              }
              // Success if OK or already added (400)
              return { success: res.ok || res.status === 400 };
            })
            .catch((e) => {
              console.error("Favorite synchronization error:", e);
              failedFavoriteIds.push(productId); // RECORD THE ERRORED ID
              return { success: false };
            });
        });
        syncPromises.push(...favoriteSyncPromises);
      }

      // ----------------------------------------------------
      // C. PROCESS RESULTS AND UPDATE LOCAL STORAGE
      // ----------------------------------------------------
      if (syncPromises.length > 0) {
        // Wait for all synchronizations to complete
        await Promise.all(syncPromises);

        // Check if all syncs were successful
        const allSyncsSuccessful =
          failedCartItems.length === 0 && failedFavoriteIds.length === 0;

        if (allSyncsSuccessful) {
          // If everything succeeded, completely clear Local Storage
          setGuestCart([]);
          setGuestFavorites([]);

          toast.success("All guest data successfully synchronized!", {
            id: "sync-result",
            duration: 2500,
          });
          toast.dismiss("cart-sync");
          toast.dismiss("favorites-sync");
        } else {
          // On partial success/failure, write back only the failed items to Local Storage.
          // Successful items are implicitly cleared by this step.
          setGuestCart(failedCartItems);
          setGuestFavorites(failedFavoriteIds);

          // Error message, now only truly failed items remain in Local Storage.
          toast.warning(
            `Login successful. ${
              failedCartItems.length + failedFavoriteIds.length
            } item(s) failed to synchronize. Please check your lists.`,
            { id: "sync-result", duration: 7000 }
          );
        }
      } else {
        // Dismiss sync toasts if there was no cart or favorites to sync
        toast.dismiss("cart-sync");
        toast.dismiss("favorites-sync");
      }

      // 5. Success Toast and Redirection
      toast.success("Welcome back!", { id: "login" });
      setTimeout(() => router.push("/"), 800);
    }
    setIsLoading(false);
  };

  return (
    // 1. Main Container: Full screen height and background image
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 2. Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Please update this image with your project's /public/login/login.jpg path. */}
        <img
          src="/login/login.jpg"
          alt="Elegant lifestyle background"
          className="w-full h-full object-cover"
          // Using a placeholder image for safe rendering
        />
        {/* Overlay layer: Increases form readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
      </div>

      {/* 3. Form Container - Centered Vertically */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-10">
        <div className="w-full max-w-md mx-auto">
          {/* 4. Glassmorphism Styled Form Box */}
          <div
            className="bg-white/10 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl border border-white/20 
            transform transition-all duration-500 hover:shadow-rose-500/30 ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px flex-1 bg-white/40" />
                <Sparkles className="h-6 w-6 text-rose-300" strokeWidth={1.5} />
                <div className="h-px flex-1 bg-white/40" />
              </div>

              <h1 className="text-4xl md:text-5xl font-extralight tracking-tight text-white text-center mb-2 drop-shadow-md">
                Welcome Back
              </h1>

              <p className="text-center text-sm font-light text-white/80 tracking-wide drop-shadow-sm">
                Sign in to continue your journey
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label className="block text-xs font-light tracking-widest uppercase text-white/80 mb-2 drop-shadow-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-light tracking-wide rounded-xl
                                  focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 
                                  placeholder:text-white/60 placeholder:font-light"
                  placeholder="name@email.com"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-xs font-light tracking-widest uppercase text-white/80 mb-2 drop-shadow-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white font-light tracking-wide rounded-xl
                                  focus:outline-none focus:ring-2 focus:ring-rose-300 transition-all duration-300 
                                  placeholder:text-white/60 placeholder:font-light pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-light text-white/70 hover:text-rose-300 tracking-wide transition-colors drop-shadow-sm"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full relative overflow-hidden bg-rose-500 text-white py-4 rounded-full 
                                  hover:bg-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                                  shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium tracking-widest uppercase">
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                    strokeWidth={1.5}
                  />
                </span>
                <div
                  className="absolute inset-0 bg-white/10 
                                  translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500"
                />
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm font-light text-white/70">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/account/register")}
                  className="text-white hover:text-rose-300 font-normal transition-colors relative group"
                >
                  Create an account
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-rose-300 transition-all duration-300 group-hover:w-full" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
