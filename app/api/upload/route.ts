import { NextRequest, NextResponse } from "next/server";
import { ImageUploadService } from "@/lib/services/image-upload.service";

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const clientIP = getClientIP(request);
    const result = await ImageUploadService.handleUpload(file, clientIP);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);

    const errorMessage = error instanceof Error ? error.message : "Error uploading file";
    const statusCode = errorMessage.includes("Too many upload attempts") ? 429 : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
