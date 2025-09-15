"use client";
import React from "react";
import Marquee from "react-fast-marquee";

export default function HeroesBar() {
  return (
    <div className="w-full bg-teal-700 py-2">
      <Marquee pauseOnHover gradient={false} speed={50}>
        <span className="mx-8 text-white font-medium text-sm md:text-base">
          Sign up now and don’t miss out on exclusive discounts and surprise
          perks!
        </span>
        <span className="mx-8 text-white font-medium text-sm md:text-base">
          Sign up now and don’t miss out on exclusive discounts and surprise
          perks!
        </span>
        <span className="mx-8 text-white font-medium text-sm md:text-base">
          Sign up now and don’t miss out on exclusive discounts and surprise
          perks!
        </span>
      </Marquee>
    </div>
  );
}
