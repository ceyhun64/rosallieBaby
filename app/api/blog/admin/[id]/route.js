// Blog ID API - GET single, PUT update, DELETE
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - ID ile tek blog (admin için draft dahil)
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const post = await prisma.blogPost.findUnique({
            where: { id: parseInt(id) },
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

// PUT - Blog güncelle
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const existing = await prisma.blogPost.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Blog post not found" },
                { status: 404 }
            );
        }

        // If publishing for the first time
        if (body.published && !existing.published && !existing.publishedAt) {
            body.publishedAt = new Date();
        }

        const post = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: body,
        });

        return NextResponse.json({ post });
    } catch (error) {
        console.error("Blog update error:", error);
        return NextResponse.json(
            { message: "Failed to update blog", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Blog sil
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.blogPost.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Blog delete error:", error);
        return NextResponse.json(
            { message: "Failed to delete blog", error: error.message },
            { status: 500 }
        );
    }
}
