"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./sideBar";
import ProductCard from "./productCard";
import Loading from "../layout/loading";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1 ms-20 mt-20 md:mt-32 px-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">My Favorites</h2>

        {loading ? (
          <Loading />
        ) : favorites.length === 0 ? (
          <div className="p-4 rounded-md bg-blue-100 text-sm text-gray-600">
            You haven't added any products to your favorites yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <ProductCard key={fav.id} product={fav.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
