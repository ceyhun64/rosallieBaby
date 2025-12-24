import React from "react";
import AdminBlogs from "@/components/admin/blog/blogs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }
  return (
    <div>
      <AdminBlogs />
    </div>
  );
}
