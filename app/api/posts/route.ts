import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { sendVerificationEmail, generateVerificationCode } from "@/lib/email";

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

// POST /api/posts - Submit a new blog post (now with email verification)
export async function POST(request: Request) {
  try {
    const { title, content, authorName, authorEmail, authorPhoneNumber, image } = await request.json();

    // Validate required fields
    if (!title || !content || !authorName || !authorEmail) {
      return NextResponse.json({ error: "Missing required fields: title, content, authorName, and authorEmail are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create URL-friendly slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingPost = await prisma.blogPost.findFirst({
        where: { slug },
      });

      if (!existingPost) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Store the blog post data temporarily in verification record
    const postData = {
      title,
      slug,
      content,
      authorName,
      authorEmail,
      authorPhoneNumber,
      image,
    };

    // Clean up any existing verification records for this email (optional)
    await prisma.emailVerification.deleteMany({
      where: {
        email: authorEmail,
        verified: false,
        expiresAt: {
          lt: new Date(), // Delete only expired records
        },
      },
    });

    // Create verification record
    const verification = await prisma.emailVerification.create({
      data: {
        email: authorEmail,
        code: verificationCode,
        postData,
        expiresAt,
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(authorEmail, verificationCode);

    if (!emailResult.success) {
      // Clean up verification record if email failed
      await prisma.emailVerification.delete({
        where: { id: verification.id },
      });

      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      message: "Verification email sent! Please check your email and enter the verification code.",
      verificationId: verification.id,
      email: authorEmail,
    });
  } catch (error) {
    console.error("Error creating post submission:", error);
    return NextResponse.json({ error: "Error processing blog post submission" }, { status: 500 });
  }
}
