"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import { Sparkles, Gift, Truck, Star } from "lucide-react";

export default function HeroesBar() {
  const benefits = [
    {
      icon: <Gift className="h-4 w-4" strokeWidth={1.6} />,
      text: "Exclusive Member Privileges — Join Our Premium Club",
    },
    {
      icon: <Truck className="h-4 w-4" strokeWidth={1.6} />,
      text: "Complimentary Shipping on All Orders Over €50",
    },
    {
      icon: <Star className="h-4 w-4" strokeWidth={1.6} />,
      text: "Discover Our New Luxury Capsule Collection",
    },
    {
      icon: <Sparkles className="h-4 w-4" strokeWidth={1.6} />,
      text: "Crafted From Ultra-Soft 100% Organic Cotton",
    },
  ];

  return (
    <div
      className="
        w-full py-4
        bg-gradient-to-r
        from-[#f7f3ef] via-[#f3ede8] to-[#f7f3ef]
      "
    >
      <Marquee
        pauseOnHover
        speed={36}
        gradient={true}
        gradientWidth={120}
        gradientColor="#f3ede8"
      >
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="
              flex items-center mx-20
              group select-none
              transition-all
            "
          >
            <div
              className="
                flex items-center justify-center
                h-7 w-7 rounded-full  
                mr-3 text-gray-700
                group-hover:text-rose-700
                group-hover:shadow-[0_0_10px_rgba(0,0,0,0.12)]
                transition-all duration-300
              "
            >
              {benefit.icon}
            </div>

            <span
              className="
                text-[11px]
                tracking-[0.18em]
                uppercase
                font-light
                text-gray-800
                group-hover:text-gray-900
                transition-colors duration-300
              "
            >
              {benefit.text}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
