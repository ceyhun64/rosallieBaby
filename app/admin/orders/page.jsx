import React from "react";
import AdminOrders from "@/components/admin/orders/orders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  
    // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
    if (!session || session.user.role !== "ADMIN") {
      redirect("/admin");
    }
  
  return (
    <div>
      <AdminOrders />
    </div>
  );
}
