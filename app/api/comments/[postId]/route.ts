import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { sendAdminCommentNotification } from "@/lib/email";

const prisma = new PrismaClient();

// GET /api/comments/[postId] - Get all approved comments for a post
export async function GET(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;

    const comments = await prisma.comment.findMany({
      where: {
        blogPostId: postId,
        status: "APPROVED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}

// POST /api/comments/[postId] - Submit a new comment
export async function POST(request: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;
    const { content } = await request.json();

    // Validate required fields
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // Validate content length (max 1000 characters)
    if (content.length > 1000) {
      return NextResponse.json({ error: "Comment is too long. Maximum 1000 characters allowed." }, { status: 400 });
    }

    // Check if the blog post exists and is approved
    const blogPost = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        status: "APPROVED",
      },
    });

    if (!blogPost) {
      return NextResponse.json({ error: "Blog post not found or not available for comments" }, { status: 404 });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        blogPostId: postId,
        status: "PENDING", // Comments require approval
      },
    });

    // Send admin notification email for new comment
    const adminNotificationResult = await sendAdminCommentNotification({
      content: content.trim(),
      postTitle: blogPost.title,
      postSlug: blogPost.slug,
      commentId: comment.id,
    });

    if (!adminNotificationResult.success) {
      console.warn("Failed to send admin comment notification email:", adminNotificationResult.error);
      // Don't fail the request if admin notification fails
    }

    return NextResponse.json({
      message: "Comment submitted successfully! It will appear after approval.",
      commentId: comment.id,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Error submitting comment" }, { status: 500 });
  }
}
