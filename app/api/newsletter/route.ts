import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { sendNewsletterWelcomeEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address." }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json({ success: false, message: "You're already subscribed to our newsletter!" }, { status: 409 });
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: {
            isActive: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        });
      }
    } else {
      // Create new subscription
      await prisma.newsletter.create({
        data: { email },
      });
    }

    // Send welcome email
    try {
      await sendNewsletterWelcomeEmail(email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again later." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, message: "Unsubscribe token is required." }, { status: 400 });
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscription) {
      return NextResponse.json({ success: false, message: "Invalid unsubscribe link." }, { status: 404 });
    }

    if (!subscription.isActive) {
      return NextResponse.json({ success: false, message: "You're already unsubscribed." }, { status: 409 });
    }

    await prisma.newsletter.update({
      where: { unsubscribeToken: token },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from our newsletter.",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ success: false, message: "Something went wrong. Please try again later." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
