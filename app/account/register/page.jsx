import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Register from "@/components/account/register";
import Footer from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Register />
      <Footer />
    </div>
  );
}
