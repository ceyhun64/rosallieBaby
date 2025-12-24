import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Blanket from "@/components/products/blanket/blanket";
import Footer from "@/components/layout/footer";

export const metadata = {
    title: "Personalized Baby Blankets | Rosallie Baby",
    description:
        "Discover our premium collection of personalized muslin baby blankets. Handcrafted with love, customized with your baby's name. Perfect for newborns and baby showers.",
    keywords: [
        "personalized baby blanket",
        "custom baby blanket with name",
        "muslin baby blanket",
        "newborn blanket personalized",
        "baby shower gift blanket",
    ],
    openGraph: {
        title: "Personalized Baby Blankets | Rosallie Baby",
        description:
            "Premium personalized muslin baby blankets, handcrafted with love.",
        images: ["/categoryBanners/blanketbanner.webp"],
    },
};

export default function BlanketPage() {
    return (
        <div>
            <Topbar />
            <Navbar />
            <Blanket />
            <Footer />
        </div>
    );
}
