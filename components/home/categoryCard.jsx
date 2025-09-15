// components/CategoryCard.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryCard({ title, imageUrl, href }) {
  return (
    <div className="relative w-full h-[450px] md:h-[500px]  overflow-hidden shadow-lg group">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 group-hover:scale-110"
      />

      {/* Content Layer at Bottom */}
      <div className="absolute bottom-0 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-t from-black/40 to-transparent text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wider">
          {title}
        </h3>
        <Link href={href} passHref>
          <Button
            variant="ghost"
            className="bg-white text-gray-800 rounded-full px-8 py-3 text-sm font-bold shadow-md hover:bg-gray-100 transition-colors"
          >
            Discover Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
