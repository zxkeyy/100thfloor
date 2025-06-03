import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Rate limiting storage (use Redis in production)
const uploadAttempts = new Map<string, { count: number; resetTime: number }>();

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface RateLimitResult {
  allowed: boolean;
  resetTime?: number;
}

export class ImageUploadService {
  private static readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private static readonly MAX_ATTEMPTS = 5; // 5 uploads per window
  private static readonly MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  private static readonly ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  private static readonly FILE_SIGNATURES = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    "image/gif": [
      [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
      [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
    ],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  };

  /**
   * Check rate limiting for IP address
   */
  public static checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const current = uploadAttempts.get(ip);

    if (!current || now > current.resetTime) {
      uploadAttempts.set(ip, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW,
      });
      return { allowed: true };
    }

    if (current.count >= this.MAX_ATTEMPTS) {
      return {
        allowed: false,
        resetTime: current.resetTime,
      };
    }

    current.count++;
    return { allowed: true };
  }

  /**
   * Validate file type and signature
   */
  public static validateFile(file: File, buffer: ArrayBuffer): { valid: boolean; error?: string } {
    // Check MIME type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only images are allowed.",
      };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File too large. Maximum size is 3MB.",
      };
    }

    // Check file signature (magic numbers)
    const bytes = new Uint8Array(buffer);
    const isValidSignature = this.validateImageSignature(bytes, file.type);

    if (!isValidSignature) {
      return {
        valid: false,
        error: "Invalid image file.",
      };
    }

    return { valid: true };
  }

  /**
   * Validate image file signature
   */
  private static validateImageSignature(bytes: Uint8Array, mimeType: string): boolean {
    const validSignatures = this.FILE_SIGNATURES[mimeType as keyof typeof this.FILE_SIGNATURES];
    if (!validSignatures) return false;

    return validSignatures.some((signature) => signature.every((byte, index) => bytes[index] === byte));
  }

  /**
   * Upload image to Cloudinary
   */
  public static async uploadToCloudinary(buffer: Buffer): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "blog-images",
            transformation: [
              { width: 1200, height: 630, crop: "limit" }, // Optimize for blog banners
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else if (!result) {
              reject(new Error("Upload failed: No result returned"));
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          }
        )
        .end(buffer);
    });
  }

  /**
   * Main upload handler
   */
  public static async handleUpload(file: File, ip: string): Promise<UploadResult> {
    // Check rate limiting
    const rateLimit = this.checkRateLimit(ip);
    if (!rateLimit.allowed) {
      throw new Error("Too many upload attempts. Please try again later.");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file
    const validation = this.validateFile(file, arrayBuffer);
    if (!validation.valid) {
      throw new Error(validation.error || "File validation failed");
    }

    // Upload to Cloudinary
    try {
      return await this.uploadToCloudinary(buffer);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to cloud storage");
    }
  }

  /**
   * Delete image from Cloudinary (for cleanup)
   */
  public static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete image:", error);
      // Don't throw error for cleanup operations
    }
  }
}
