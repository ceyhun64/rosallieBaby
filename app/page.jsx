import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Heroes from "@/components/home/heroes";
import HeroesBar from "@/components/home/hereosBar";
import MuslinSets from "@/components/home/muslinSets";
import Categories from "@/components/home/categories";
import MostVisited from "@/components/home/mostVisited";
import SleepingFriends from "@/components/home/sleepingFriends";
import Subscribe from "@/components/home/subscribe";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Heroes />
      <HeroesBar />
      <MuslinSets />
      <Categories />
      <MostVisited />
      <SleepingFriends />
      <Subscribe />
      <Footer />
    </div>
  );
}
