"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Mail, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SubscribeSection() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setStatus("");
    setIsSuccess(false);
    setIsLoading(true);

    if (!email) {
      setStatus("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus(data.error || "Something went wrong. Please try again.");
        setIsSuccess(false);
        return;
      }

      setStatus("Welcome to our exclusive club!");
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      setStatus("Unable to subscribe. Please try again later.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-cover bg-center py-20 md:py-32 relative overflow-hidden">
      {/* Premium Background Image with Overlay */}
      <Image
        src="/subscribe/subscribe.webp"
        alt="Join our exclusive community"
        layout="fill"
        objectFit="cover"
        className="brightness-75"
        priority
      />
      
      {/* Sophisticated Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 z-0" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40 z-0" />

      <div className="container mx-auto px-6 md:px-8 text-center relative z-10 max-w-4xl">
        {/* Decorative Top Element */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/40" />
          <Sparkles className="h-6 w-6 text-white/80 animate-pulse" strokeWidth={1.5} />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/40" />
        </div>

        {/* Luxury Heading */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-6 tracking-tight leading-tight">
          Join Our Exclusive Circle
        </h2>
        
        <p className="text-base md:text-lg text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
          Be the first to discover new collections, exclusive offers, and insider access to premium baby essentials crafted with love.
        </p>

        {/* Premium Email Form */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-12 pr-6 py-6 md:py-7 rounded-full text-gray-900 font-light
              focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/95 backdrop-blur-sm
              border-2 border-white/20 hover:border-white/40 transition-all duration-300
              placeholder:text-gray-400 text-base shadow-xl"
              disabled={isLoading}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-full 
            px-10 py-6 md:py-7 shadow-2xl hover:shadow-3xl transition-all duration-500 
            border-2 border-white/20 uppercase tracking-[0.15em] text-sm
            disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              "Join Now"
            )}
          </Button>
        </div>

        {/* Status Message with Icons */}
        {status && (
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-md shadow-xl
            ${isSuccess 
              ? "bg-green-500/90 text-white" 
              : "bg-red-500/90 text-white"
            } transition-all duration-500 animate-fade-in`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            ) : (
              <AlertCircle className="h-5 w-5" strokeWidth={2} />
            )}
            <p className="font-light tracking-wide">{status}</p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70 text-xs font-light tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            <span>Exclusive Offers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            <span>Early Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            <span>No Spam, Ever</span>
          </div>
        </div>

        {/* Decorative Bottom Element */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30" />
        </div>
      </div>
    </section>
  );
}