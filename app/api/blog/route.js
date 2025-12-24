// Blog API - GET all published, POST new
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Yayınlanmış blogları listele
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = (page - 1) * limit;

    const where = {
      published: true,
      ...(featured === "true" && { featured: true }),
      ...(category && { category }),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          image: true,
          category: true,
          readTime: true,
          featured: true,
          publishedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Yeni blog oluştur (Admin only)
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      category,
      readTime,
      published,
      featured,
      metaTitle,
      metaDescription,
    } = body;

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        readTime:
          readTime || `${Math.ceil(content.split(" ").length / 200)} min read`,
        published: published || false,
        featured: featured || false,
        publishedAt: published ? new Date() : null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json(
      { message: "Failed to create blog", error: error.message },
      { status: 500 }
    );
  }
}
