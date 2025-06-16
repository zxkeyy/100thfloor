import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.redirect(new URL("/?error=invalid-unsubscribe", request.url));
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscription) {
      return NextResponse.redirect(new URL("/?error=not-found", request.url));
    }

    if (!subscription.isActive) {
      return NextResponse.redirect(new URL("/?message=already-unsubscribed", request.url));
    }

    await prisma.newsletter.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL("/?message=unsubscribed", request.url));
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.redirect(new URL("/?error=server-error", request.url));
  } finally {
    await prisma.$disconnect();
  }
}
