import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/admin/comments - Get all comments for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      include: {
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
  }
}
