import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST /api/posts/verify - Verify email code and create blog post
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 });
    }

    // Find the verification record
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        verified: false,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    // Extract post data from verification record
    interface PostData {
      title: string;
      slug: string;
      content: string;
      authorName: string;
      authorEmail: string;
      authorPhoneNumber?: string;
      image?: string;
    }

    const postData = verification.postData as unknown as PostData;

    // Create the blog post
    const blogPost = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        authorName: postData.authorName,
        authorEmail: postData.authorEmail,
        authorPhoneNumber: postData.authorPhoneNumber,
        image: postData.image,
        status: "PENDING", // Default status for admin review
      },
    });

    // Mark verification as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    });

    // Clean up old verification records for this email
    await prisma.emailVerification.deleteMany({
      where: {
        email,
        verified: false,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      message: "Email verified successfully! Your blog post has been submitted for review.",
      post: {
        id: blogPost.id,
        title: blogPost.title,
        slug: blogPost.slug,
        status: blogPost.status,
      },
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json({ error: "Error verifying email" }, { status: 500 });
  }
}
