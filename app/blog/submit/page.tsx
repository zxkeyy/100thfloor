/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "../../../styles/_variables.scss";
import "../../../styles/_keyframe-animations.scss";
import { Image } from "lucide-react";

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
    authorPhone: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal states
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);

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

  const validateBlogForm = (): string | null => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.content.trim() || formData.content === "<p></p>") return "Content is required";
    return null;
  };

  const validateAuthorForm = (): string | null => {
    if (!formData.authorName.trim()) return "Your name is required";
    if (!formData.authorEmail.trim()) return "Your email is required";
    // Phone number is now optional - removed validation

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      return "Please enter a valid email address";
    }

    // Phone validation (only if provided)
    if (formData.authorPhone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.authorPhone.replace(/[\s\-\(\)]/g, ""))) {
        return "Please enter a valid phone number";
      }
    }

    return null;
  };

  // Handle initial blog post submission (opens author modal)
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate blog form
    const validationError = validateBlogForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Open author information modal
    setShowAuthorModal(true);
  };

  // Handle author information submission
  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate author form
    const validationError = validateAuthorForm();
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
        const data = await response.json();
        setMessage(data.message);
        setVerificationEmail(data.email);
        setShowAuthorModal(false);
        setShowVerificationModal(true);
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingCode(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/posts/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);

        // Reset form and redirect after success
        setTimeout(() => {
          setFormData({
            title: "",
            content: "",
            authorName: "",
            authorEmail: "",
            authorPhone: "",
            image: "",
          });
          setImageFile(null);
          setImagePreview("");
          setShowVerificationModal(false);
          setVerificationCode("");
          router.push("/blog");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to verify code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("An error occurred while verifying the code. Please try again.");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    setResendingCode(true);
    setError("");
    setMessage("");

    try {
      let imageUrl = formData.image;

      // Upload image if selected (in case it wasn't uploaded before)
      if (imageFile && !imageUrl) {
        const uploadedImageUrl = await uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
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
        const data = await response.json();
        console.log("log 10", data);
        setMessage("New verification code sent to your email!");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      setError("An error occurred while resending the code. Please try again.");
    } finally {
      setResendingCode(false);
    }
  };

  // Main blog form
  return (
    <>
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

        <form onSubmit={handleBlogSubmit}>
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
            {/* Hidden file input */}
            <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />

            {/* Custom styled div that triggers file input */}
            <div
              onClick={() => document.getElementById("imageFile")?.click()}
              style={{
                width: "100%",
                padding: imagePreview ? "0" : "40px 20px",
                border: imagePreview ? "none" : "2px dashed #ccc",
                borderRadius: "8px",
                fontSize: "16px",
                boxSizing: "border-box",
                backgroundColor: imagePreview ? "transparent" : "#f9f9f9",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "#666",
                position: "relative",
                minHeight: imagePreview ? "200px" : "auto",
              }}
              onMouseEnter={(e) => {
                if (!imagePreview) {
                  e.currentTarget.style.borderColor = "#007bff";
                  e.currentTarget.style.backgroundColor = "#f0f8ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!imagePreview) {
                  e.currentTarget.style.borderColor = "#ccc";
                  e.currentTarget.style.backgroundColor = "#f9f9f9";
                }
              }}
              className="hover:border-blue-500 hover:bg-blue-50 flex justify-center items-center "
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "6px",
                      maxHeight: "400px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview("");
                      setError("");
                    }}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(220, 53, 69, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(220, 53, 69, 1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(220, 53, 69, 0.9)";
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      opacity: "0.8",
                    }}
                  >
                    Click to change image
                  </div>
                </>
              ) : (
                <>
                  <Image size={50} />
                  <p>Add showcase image</p>
                </>
              )}
            </div>

            <small style={{ color: "#666", display: "block", marginTop: "5px" }}>Upload an image file (JPEG, PNG, GIF, WebP) - Max 3MB. Images will be automatically optimized and securely stored.</small>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                minHeight: "500px",

                overflow: "auto",
              }}
            >
              <SimpleEditor content={formData.content} onChange={handleEditorChange} placeholder="Write your blog post content here..." />
            </div>
            <small style={{ color: "#666", display: "block", marginTop: "5px" }}>Minimum 100 characters recommended for a quality post.</small>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push("/blog")}
              style={{
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              className="rounded-full py-5 px-15 font-bold text-primary-foreground border-2 border-primary-foreground"
            >
              PREVIEW
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              style={{
                //backgroundColor: uploadingImage ? "#ccc" : "#007bff",
                color: "white",
                fontSize: "16px",
                cursor: uploadingImage ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
              }}
              className="rounded-full py-5 px-15 font-bold bg-primary-foreground"
            >
              PUBLISH NOW
            </button>
          </div>
        </form>
      </div>

      {/* Author Information Modal */}
      <Dialog open={showAuthorModal} onOpenChange={setShowAuthorModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-4">Author Information</DialogTitle>
          </DialogHeader>

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

          <form onSubmit={handleAuthorSubmit} className="space-y-4">
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
              <label htmlFor="authorPhone" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Your Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="authorPhone"
                name="authorPhone"
                value={formData.authorPhone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
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
              <small style={{ color: "#666", display: "block", marginTop: "5px" }}>A verification code will be sent to this email</small>
            </div>

            <div style={{ display: "flex", gap: "10px", paddingTop: "10px" }}>
              <button
                type="submit"
                disabled={loading || uploadingImage}
                style={{
                  backgroundColor: loading || uploadingImage ? "#ccc" : "",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading || uploadingImage ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                  flex: 1,
                }}
                className="bg-primary"
              >
                {uploadingImage ? "Uploading..." : loading ? "Sending..." : "Submit Post"}
              </button>

              <button
                type="button"
                onClick={() => setShowAuthorModal(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#6c757d",
                  padding: "12px 20px",
                  border: "1px solid #6c757d",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-2">Verify Your Email</DialogTitle>
            <p className="text-center text-gray-600 mb-4">
              We&apos;ve sent a 6-digit verification code to <strong>{verificationEmail}</strong>
            </p>
          </DialogHeader>

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

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verificationCode" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Enter Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").substring(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "24px",
                  textAlign: "center",
                  letterSpacing: "8px",
                  boxSizing: "border-box",
                }}
              />
              <small style={{ color: "#666", display: "block", marginTop: "5px" }}>The code expires in 10 minutes</small>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="submit"
                disabled={verifyingCode || verificationCode.length !== 6}
                style={{
                  backgroundColor: verifyingCode || verificationCode.length !== 6 ? "#ccc" : "",
                  color: "white",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: verifyingCode || verificationCode.length !== 6 ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                  flex: 1,
                }}
                className="bg-primary"
              >
                {verifyingCode ? "Verifying..." : "Verify & Submit"}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendingCode}
                style={{
                  backgroundColor: "transparent",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: resendingCode ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  flex: 1,
                }}
                className="border-1 border-primary text-primary"
              >
                {resendingCode ? "Resending..." : "Resend"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowVerificationModal(false);
                setShowAuthorModal(true);
                setVerificationCode("");
                setError("");
                setMessage("");
              }}
              style={{
                backgroundColor: "transparent",
                color: "#6c757d",
                padding: "8px 16px",
                border: "1px solid #6c757d",
                borderRadius: "4px",
                fontSize: "14px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              ← Back to Author Info
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
