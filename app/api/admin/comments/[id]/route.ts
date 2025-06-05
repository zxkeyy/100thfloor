import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// PATCH /api/admin/comments/[id] - Update comment status (approve/reject)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    // Validate status
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be APPROVED or REJECTED" }, { status: 400 });
    }

    // Update comment status
    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json({ error: "Error updating comment" }, { status: 500 });
  }
}

// DELETE /api/admin/comments/[id] - Delete comment
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Error deleting comment" }, { status: 500 });
  }
}
