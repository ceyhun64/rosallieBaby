"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ShoppingCart,
    Heart,
    Truck,
    Gift,
    Shield,
    Star,
    ChevronRight,
    Check,
    Sparkles,
    Package,
    Clock,
    ArrowLeft
} from "lucide-react";

export default function ExampleProductPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [customName, setCustomName] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const images = [
        "/examples/product-main.jpg",
        "/examples/product-detail.jpg",
    ];

    const product = {
        name: "Personalized Muslin Hospital Coming Home Set",
        subtitle: "Luxury 6-Piece Newborn Collection",
        price: 189.99,
        oldPrice: 249.99,
        discount: 24,
        rating: 4.9,
        reviews: 127,
        description: `Welcome your precious newborn in timeless elegance with our signature Personalized Muslin Hospital Coming Home Set. Each piece is lovingly crafted from 100% organic Turkish muslin cotton, ensuring the softest touch against your baby's delicate skin.

This exquisite 6-piece collection features your baby's name beautifully embroidered in our signature script font, creating a cherished keepsake that celebrates their arrival.`,
        features: [
            "100% Organic Turkish Muslin Cotton",
            "GOTS Certified & Chemical-Free",
            "Hand-Embroidered Personalization",
            "Newborn Size (0-3 Months)",
            "Machine Washable",
            "Gift-Ready Packaging"
        ],
        setContents: [
            { name: "Kimono Romper", desc: "Wrap-style for easy dressing" },
            { name: "Ruffled Blanket", desc: "80x80cm, perfect for swaddling" },
            { name: "Star Pillow", desc: "Decorative with embroidered name" },
            { name: "Newborn Beanie", desc: "Soft & stretchy fit" },
            { name: "Scratch Mittens", desc: "Protects delicate skin" },
            { name: "Matching Bib", desc: "Absorbent muslin layers" }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-white">
            {/* Luxurious Top Bar */}
            <div className="bg-[#c9b99a] text-white py-3">
                <div className="container mx-auto px-4 flex items-center justify-center gap-3">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span className="text-xs tracking-[0.2em] uppercase font-light">
                        Complimentary Gift Wrapping on All Orders
                    </span>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-900 transition">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/all_products/hospital_outfit_special_set" className="hover:text-gray-900 transition">Hospital Sets</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-900">Personalized Muslin Set</span>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative aspect-square bg-[#f5f3ef] rounded-2xl overflow-hidden group">
                            <Image
                                src={images[selectedImage]}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />

                            {/* Discount Badge */}
                            <div className="absolute top-6 left-6">
                                <div className="bg-black text-white px-4 py-2 text-sm font-medium tracking-wider">
                                    -{product.discount}% OFF
                                </div>
                            </div>

                            {/* Favorite Button */}
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                            >
                                <Heart
                                    className={`h-6 w-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                                />
                            </button>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="flex gap-4 justify-center">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === index
                                            ? "ring-2 ring-black ring-offset-2 scale-105"
                                            : "opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <p className="text-sm text-[#b8a686] uppercase tracking-[0.2em] font-medium">
                                {product.subtitle}
                            </p>
                            <h1 className="text-3xl lg:text-4xl font-serif font-light text-gray-900 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.rating} ({product.reviews} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 py-6 border-y border-gray-200">
                            <span className="text-4xl font-light text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className="text-xl text-gray-400 line-through">
                                ${product.oldPrice.toFixed(2)}
                            </span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                Save ${(product.oldPrice - product.price).toFixed(2)}
                            </span>
                        </div>

                        {/* Personalization Input */}
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-[#b8a686]" />
                                    Personalize with Baby's Name
                                    <span className="text-red-500">*</span>
                                </span>
                                <div className="mt-2 relative">
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder="Enter name (max 12 characters)"
                                        maxLength={12}
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#b8a686] focus:ring-0 transition-colors text-lg"
                                    />
                                    {customName && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Check className="h-5 w-5 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Preview: <span className="font-script text-[#8b7355] text-lg italic">{customName || "Your Baby's Name"}</span>
                                </p>
                            </label>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4">
                            <button className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-xl font-medium tracking-wider transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:shadow-xl hover:-translate-y-0.5">
                                <ShoppingCart className="h-6 w-6" />
                                ADD TO CART — ${product.price.toFixed(2)}
                            </button>

                            <button className="w-full border-2 border-black text-black py-5 rounded-xl font-medium tracking-wider transition-all duration-300 hover:bg-black hover:text-white flex items-center justify-center gap-3">
                                <Gift className="h-5 w-5" />
                                ADD TO GIFT REGISTRY
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6">
                            <div className="text-center p-4 bg-[#faf8f5] rounded-xl">
                                <Truck className="h-6 w-6 mx-auto mb-2 text-[#8b7355]" />
                                <p className="text-xs font-medium text-gray-900">Free Shipping</p>
                                <p className="text-xs text-gray-500">Orders $150+</p>
                            </div>
                            <div className="text-center p-4 bg-[#faf8f5] rounded-xl">
                                <Clock className="h-6 w-6 mx-auto mb-2 text-[#8b7355]" />
                                <p className="text-xs font-medium text-gray-900">Ships in 4-5</p>
                                <p className="text-xs text-gray-500">Business Days</p>
                            </div>
                            <div className="text-center p-4 bg-[#faf8f5] rounded-xl">
                                <Shield className="h-6 w-6 mx-auto mb-2 text-[#8b7355]" />
                                <p className="text-xs font-medium text-gray-900">Safe & Secure</p>
                                <p className="text-xs text-gray-500">Checkout</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Set Contents Section */}
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
                            What's Included in Your Set
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#b8a686] to-transparent mx-auto" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {product.setContents.map((item, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-[#f5f3ef] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-6 w-6 text-[#8b7355]" />
                                </div>
                                <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-light text-gray-900 mb-4">
                            About This Collection
                        </h2>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#b8a686] to-transparent mx-auto" />
                    </div>

                    <div className="prose prose-lg max-w-none text-center text-gray-600 leading-relaxed">
                        <p className="mb-8">{product.description}</p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                        {product.features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 bg-[#faf8f5] rounded-xl"
                            >
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Full Width Image */}
                <div className="mt-24">
                    <div className="relative h-[500px] rounded-3xl overflow-hidden">
                        <Image
                            src="/examples/product-detail.jpg"
                            alt="Complete Set View"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-lg ml-12 text-white">
                                <h3 className="text-4xl font-serif font-light mb-4">
                                    The Perfect Welcome Home Gift
                                </h3>
                                <p className="text-white/80 mb-6">
                                    Every piece is thoughtfully designed to surround your newborn in softness and love from their very first day.
                                </p>
                                <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-all">
                                    Explore All Sets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
