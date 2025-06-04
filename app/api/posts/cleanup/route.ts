import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST /api/posts/cleanup - Clean up expired verification codes
export async function POST() {
  try {
    // Delete expired verification records
    const deletedRecords = await prisma.emailVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      message: `Cleaned up ${deletedRecords.count} expired verification records`,
      deletedCount: deletedRecords.count,
    });
  } catch (error) {
    console.error("Error cleaning up verification codes:", error);
    return NextResponse.json({ error: "Error cleaning up verification codes" }, { status: 500 });
  }
}
