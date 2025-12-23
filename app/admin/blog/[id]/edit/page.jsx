import React from "react";
import EditBlogForm from "@/components/admin/blog/editBlog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function EditBlogPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  const { id } = await params;

  return (
    <div>
      <EditBlogForm blogId={id} />
    </div>
  );
}
