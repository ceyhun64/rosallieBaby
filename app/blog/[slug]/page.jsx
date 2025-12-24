"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BlogSchema, { FAQSchema } from "@/components/seo/BlogSchema";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Post not found");
          throw new Error("Failed to fetch blog");
        }
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div>
        <Topbar />
        <Navbar />
        <main className="min-h-screen py-16 px-4 md:px-8">
          <article className="max-w-3xl mx-auto">
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-4 w-32 mb-12" />
            <Skeleton className="aspect-[16/9] w-full mb-12 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Topbar />
        <Navbar />
        <main className="min-h-screen py-16 px-4 text-center">
          <h1 className="text-2xl mb-4">{error || "Post not found"}</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      {/* Schema Markup */}
      <BlogSchema
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        slug={post.slug}
        image={post.image}
        datePublished={post.publishedAt}
      />

      <Topbar />
      <Navbar />

      <main className="min-h-screen py-16 px-4 md:px-8">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/blog" className="text-gray-500 hover:text-black">
              Blog
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">
              {post.title.substring(0, 30)}...
            </span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.readTime || "5 min read"}</span>
              <span>•</span>
              <time dateTime={post.publishedAt}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Featured Image */}
          {post.image ? (
            <div className="aspect-[16/9] relative mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="aspect-[16/9] bg-gray-100 mb-12 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Featured Image</span>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-600 mb-8">{post.excerpt}</p>

            {/* Render HTML content */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Author & Share */}
          <footer className="mt-16 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Written by</p>
                <p className="font-semibold">Rosallie Baby Editorial Team</p>
              </div>
            </div>
          </footer>

          {/* Related Products CTA */}
          <div className="mt-16 bg-gray-50 p-8 text-center rounded-lg">
            <h3 className="text-xl font-serif mb-4">
              Ready to Find the Perfect Outfit?
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our collection of personalized coming home outfits.
            </p>
            <Link
              href="/all_products/hospital_outfit_special_set"
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition rounded"
            >
              Shop Now
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
