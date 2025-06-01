import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// GET /api/posts - Get all approved blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
  }
}

// POST /api/posts - Submit a new blog post
export async function POST(request: Request) {
  try {
    const { title, content, authorName, authorEmail, authorPhoneNumber, image } = await request.json();

    // Create URL-friendly slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        authorName,
        authorEmail,
        authorPhoneNumber,
        image,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}
