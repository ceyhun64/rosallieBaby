// Blog slug API - GET single blog by slug
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tek blog detayı (slug ile)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}
