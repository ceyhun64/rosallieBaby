"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <Topbar />
      <Navbar />

      <main className="min-h-screen py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Rosallie Baby Blog
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert tips, guides, and inspiration for new and expecting
              parents. From choosing the perfect outfit to newborn care
              essentials.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No blog posts yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <article key={post.id} className="group">
                      <Link href={`/blog/${post.slug}`}>
                        <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden rounded-lg relative">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">
                                Blog Image
                              </span>
                            </div>
                          )}
                          {post.featured && (
                            <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.readTime || "5 min read"}</span>
                          </div>

                          <h2 className="text-xl font-semibold group-hover:text-gray-600 transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 line-clamp-2">
                            {post.excerpt}
                          </p>

                          <p className="text-sm text-gray-400">
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : ""}
                          </p>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Newsletter CTA */}
          <div className="mt-20 bg-gray-50 p-8 md:p-12 text-center rounded-lg">
            <h2 className="text-2xl font-serif mb-4">
              Get Parenting Tips Delivered
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Subscribe to our newsletter for weekly tips, exclusive offers, and
              new arrival announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black rounded"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition rounded"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
