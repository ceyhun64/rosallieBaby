import React from "react";
import Topbar from "@/components/layout/topbar";
import Navbar from "@/components/layout/navbar";
import Login from "@/components/account/login";
import Footer from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div>
      <Topbar />
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
}
