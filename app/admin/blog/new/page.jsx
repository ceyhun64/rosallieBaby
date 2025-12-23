import React from "react";
import NewBlogForm from "@/components/admin/blog/newBlog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      <NewBlogForm />
    </div>
  );
}
