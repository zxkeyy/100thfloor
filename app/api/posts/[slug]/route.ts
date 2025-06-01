import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug: params.slug,
        status: "APPROVED",
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get related posts
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        status: "APPROVED",
        id: { not: post.id },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 });
  }
}
