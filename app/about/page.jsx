import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata = {
    title: "About Rosallie Baby | Our Story & Quality Promise",
    description: "Discover the story behind Rosallie Baby. Premium handcrafted newborn outfits made with love, safety, and timeless craftsmanship. Woman-owned business.",
    openGraph: {
        title: "About Rosallie Baby | Our Story",
        description: "Premium handcrafted newborn outfits made with love.",
        url: "https://rosalliebaby.com/about",
    },
    alternates: {
        canonical: "https://rosalliebaby.com/about",
    },
};

export default function AboutPage() {
    return (
        <div>
            <Topbar />
            <Navbar />

            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif text-center mb-8">
                        About Rosallie Baby
                    </h1>

                    <div className="prose prose-lg mx-auto space-y-6 text-gray-700">
                        {/* Our Story */}
                        <h2 className="text-2xl font-serif mt-12 mb-6 text-gray-900">Our Story</h2>
                        <p>
                            Rosallie Baby was born from a simple belief: your baby&apos;s first day deserves
                            something extraordinary.
                        </p>
                        <p>
                            As a new mother preparing for my daughter Rosalie&apos;s arrival, I searched
                            everywhere for the perfect coming home outfit. I wanted something that was
                            beautifully crafted, made from safe organic materials, and personalized to
                            mark this once-in-a-lifetime moment. What I found was disappointing—either
                            mass-produced basics with no personality, or expensive options that sacrificed
                            comfort for style.
                        </p>
                        <p className="font-medium text-gray-900">
                            So I created what I couldn&apos;t find.
                        </p>
                        <p>
                            Each Rosallie Baby outfit is handcrafted with the same care and attention I
                            wanted for my own daughter. We use only GOTS-certified organic muslin because
                            your baby&apos;s delicate skin deserves the softest, safest fabrics. Every piece
                            features custom embroidery, transforming a beautiful outfit into a cherished
                            keepsake.
                        </p>
                        <p>
                            We&apos;re a small, woman-owned business that believes in quality over quantity,
                            craftsmanship over mass production, and creating pieces that you&apos;ll treasure
                            long after your baby has outgrown them.
                        </p>
                        <p>
                            Whether you&apos;re preparing for your own little one or searching for the perfect
                            baby shower gift, we&apos;re honored to be part of your journey.
                        </p>
                        <p className="mt-8">
                            With love,<br />
                            <strong>The Rosallie Baby Team</strong><br />
                            <em>Founder & Creative Director</em>
                        </p>

                        {/* Our Values */}
                        <h2 className="text-2xl font-serif mt-16 mb-6 text-gray-900">Our Values</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
                        <div className="text-center p-6">
                            <span className="text-4xl mb-4 block">🌿</span>
                            <h3 className="font-semibold text-lg mb-2">Organic & Safe</h3>
                            <p className="text-gray-600">
                                We use only GOTS-certified organic muslin, free from harmful chemicals,
                                dyes, and treatments.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <span className="text-4xl mb-4 block">✨</span>
                            <h3 className="font-semibold text-lg mb-2">Handcrafted Quality</h3>
                            <p className="text-gray-600">
                                Each piece is carefully crafted by skilled artisans who take pride
                                in their work.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <span className="text-4xl mb-4 block">💝</span>
                            <h3 className="font-semibold text-lg mb-2">Personalized Touch</h3>
                            <p className="text-gray-600">
                                Custom embroidery transforms every outfit into a one-of-a-kind keepsake.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <span className="text-4xl mb-4 block">📸</span>
                            <h3 className="font-semibold text-lg mb-2">Timeless Design</h3>
                            <p className="text-gray-600">
                                Classic, elegant styles that photograph beautifully and never go out of style.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-lg mx-auto mt-12 space-y-6 text-gray-700">
                        {/* Quality Promise */}
                        <h2 className="text-2xl font-serif mt-16 mb-6 text-gray-900">Our Quality Promise</h2>
                        <ul className="space-y-2">
                            <li><strong>GOTS-Certified Organic:</strong> All our muslin fabric is certified organic</li>
                            <li><strong>Safe for Newborns:</strong> Hypoallergenic, breathable, and gentle on skin</li>
                            <li><strong>Pre-Washed:</strong> Ready to wear right out of the box</li>
                            <li><strong>Handcrafted:</strong> Each piece is carefully made and inspected</li>
                            <li><strong>Satisfaction Guaranteed:</strong> We stand behind everything we make</li>
                        </ul>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gray-50 py-16 px-4 text-center">
                    <h2 className="text-2xl font-serif mb-4">Ready to Find the Perfect Outfit?</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Explore our collection of personalized newborn hospital outfits and
                        create something special for your little one.
                    </p>
                    <a
                        href="/all_products/hospital_outfit_special_set"
                        className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition"
                    >
                        Shop Now
                    </a>
                </section>
            </main>

            <Footer />
        </div>
    );
}
