"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquareText, Star, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

// 🆕 Review Skeleton Component
const ReviewSkeleton = () => (
  <div className="border border-gray-200 p-6 rounded-lg space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-4 w-32" />
  </div>
);

export default function ReviewSection({ productId, productName }) {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleOpenReviewModal = () => setIsReviewModalOpen(true);
  const handleCloseReviewModal = () => setIsReviewModalOpen(false);

  // Yorumları çekme mantığı
  useEffect(() => {
    async function fetchReviews() {
      if (!productId) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/review/${productId}`);
        if (!res.ok) throw new Error("Could not fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [productId, isReviewModalOpen]);

  // Yorum gönderme mantığı
  const handleSubmitReview = async () => {
    if (selectedStars === 0 || !reviewTitle || !reviewComment) {
      toast.error("Please fill all required fields and select stars.");
      return;
    }

    try {
      const sessionRes = await fetch("/api/account/check");
      const sessionData = await sessionRes.json();

      if (!sessionData.user) {
        toast.error("You must log in to submit a review!");
        router.push("/account/login");
        return;
      }

      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          rating: selectedStars,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "You have already reviewed this product.") {
          toast.error("You have already reviewed this product.");
        } else {
          toast.error(data.error || "Failed to submit review");
        }
        return;
      }

      toast.success("Review submitted successfully!");
      setReviewTitle("");
      setReviewComment("");
      setSelectedStars(0);
      handleCloseReviewModal();

      const updatedReviewsRes = await fetch(`/api/review/${productId}`);
      const updatedReviews = await updatedReviewsRes.json();
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while submitting the review.");
    }
  };

  return (
    <div className="mt-16 mb-16 max-w-4xl mx-auto">
      {/* Başlık ve Yorum Yaz Butonu */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h3 className="text-md md:text-2xl font-light tracking-wide text-gray-800">
          Customer Reviews
        </h3>
        <Button
          variant="ghost"
          className="text-black font-medium hover:bg-gray-100 transition-all"
          onClick={handleOpenReviewModal}
        >
          <MessageSquareText size={18} className="mr-2" />
          Write a Review
        </Button>
      </div>

      {/* Yorumlar Listesi */}
      <div className="space-y-6">
        {isLoading ? (
          // 🆕 Skeleton Loading
          Array.from({ length: 3 }).map((_, index) => (
            <ReviewSkeleton key={index} />
          ))
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No reviews yet for this product. Be the first to share your
            experience!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-lg">{rev.title}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < rev.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                {rev.comment}
              </p>
              <p className="text-gray-500 text-sm">
                {rev.user?.name} {rev.user?.surname}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Yorum Ekleme Modalı */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-2xl font-light tracking-wide text-gray-800">
                Write a Review for {productName}
              </h3>
              <Button
                variant="ghost"
                onClick={handleCloseReviewModal}
                className="text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Rating <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <Star
                        key={ratingValue}
                        size={32}
                        onClick={() => setSelectedStars(ratingValue)}
                        className={`cursor-pointer transition-all duration-200 ${
                          ratingValue <= selectedStars
                            ? "text-yellow-500 fill-yellow-500 scale-110"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Summarize your experience"
                  className="rounded-lg border-gray-300 focus:border-black focus:ring-black"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Your Review <span className="text-red-500">*</span>
                </Label>
                <textarea
                  rows={5}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <Button
                className="w-full py-6 bg-black text-white font-medium hover:bg-gray-800 transition-all duration-300 rounded-lg tracking-wider"
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
