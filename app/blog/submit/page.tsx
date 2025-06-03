/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import "../../../styles/_variables.scss";
import "../../../styles/_keyframe-animations.scss";

// Import validation constants from the service
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export default function SubmitBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "",
    authorEmail: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for editor content changes
  const handleEditorChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }));
    console.log(html);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic frontend validation (server will do comprehensive validation)
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File too large. Please select an image under 3MB");
        return;
      }

      setImageFile(file);
      setError(""); // Clear any previous errors

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim() || formData.content === "<p></p>") return "Content is required";
    if (!formData.authorName.trim()) return "Your name is required";
    if (!formData.authorEmail.trim()) return "Your email is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      let imageUrl = formData.image;

      // Upload image if selected
      if (imageFile) {
        const uploadedImageUrl = await uploadImage();
        if (!uploadedImageUrl) {
          setError("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
        imageUrl = uploadedImageUrl;
        if (!imageUrl) {
          setError("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        setMessage("Blog post submitted successfully! It will be reviewed by our admin team before being published.");
        setFormData({
          title: "",
          content: "",
          authorName: "",
          authorEmail: "",
          image: "",
        });
        setImageFile(null);
        setImagePreview("");

        // Redirect to blog page after a delay
        setTimeout(() => {
          router.push("/blog");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit blog post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      if (error instanceof Error) {
        // Handle specific errors from the service
        if (error.message.includes("Too many upload attempts")) {
          setError("Too many upload attempts. Please try again in a few minutes.");
        } else if (error.message.includes("Invalid file type")) {
          setError("Invalid file type. Please select a valid image file.");
        } else if (error.message.includes("File too large")) {
          setError("File too large. Please select an image under 3MB.");
        } else {
          setError("An error occurred while submitting your post. Please try again.");
        }
      } else {
        setError("An error occurred while submitting your post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "20px" }}>
      {message && (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #c3e6cb",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }} className="flex justify-center w-full">
          <textarea
            id="title"
            name="title"
            rows={1}
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title..."
            required
            style={{
              minHeight: "1.2em",
              height: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
            className="text-[46px] text-center font-bold outline-none resize-none overflow-hidden"
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box",
              backgroundColor: "#f9f9f9",
            }}
            className="text-center cursor-pointer border-dashed"
          />
          <small style={{ color: "#666", display: "block", marginTop: "5px" }}>Upload an image file (JPEG, PNG, GIF, WebP) - Max 3MB. Images will be automatically optimized and securely stored.</small>

          {/* Enhanced Image Preview */}
          {imagePreview && (
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                <p style={{ fontSize: "14px", color: "#555", margin: "0" }}>Preview:</p>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Remove
                </button>
              </div>
              <img
                src={imagePreview}
                alt="Image preview"
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>

        {/* Updated Editor section */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "bold" }}>Content *</label>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              minHeight: "300px",
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            <SimpleEditor content={formData.content} onChange={handleEditorChange} placeholder="Write your blog post content here..." />
          </div>
          <small style={{ color: "#666", display: "block", marginTop: "5px" }}>Minimum 100 characters recommended for a quality post.</small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label htmlFor="authorName" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Your Name *
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label htmlFor="authorEmail" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Your Email *
            </label>
            <input
              type="email"
              id="authorEmail"
              name="authorEmail"
              value={formData.authorEmail}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            style={{
              backgroundColor: loading || uploadingImage ? "#ccc" : "#007bff",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading || uploadingImage ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {uploadingImage ? "Uploading Image..." : loading ? "Submitting..." : "Submit Blog Post"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/blog")}
            style={{
              backgroundColor: "transparent",
              color: "#007bff",
              padding: "12px 30px",
              border: "1px solid #007bff",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            View Blog
          </button>
        </div>
      </form>
    </div>
  );
}
