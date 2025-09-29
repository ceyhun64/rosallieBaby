import React from "react";
import AdminSubscribers from "@/components/admin/subscribers/subscribers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export default async function AdminSubscribersPage() {
  const session = await getServerSession(authOptions);
  
    // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
    if (!session || session.user.role !== "ADMIN") {
      redirect("/admin");
    }
  
  return (
    <div>
      <AdminSubscribers />
    </div>
  );
}
