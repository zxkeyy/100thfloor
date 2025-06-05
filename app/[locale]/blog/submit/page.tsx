/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "../../../styles/_variables.scss";
import "../../../styles/_keyframe-animations.scss";
import { CircleCheck, Image } from "lucide-react";
import DOMPurify from "dompurify";

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

  // Preview state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Modal states
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
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
        // Reset form and show thank you modal
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
        setShowThankYouModal(true);
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
      {!isPreviewMode ? (
        // Edit Mode
        <div className="max-w-[1200px] mx-auto my-[50px] p-5 mt-25">
          {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-5 border border-green-200">{message}</div>}

          {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-5 border border-red-200">{error}</div>}

          <form onSubmit={handleBlogSubmit}>
            <div className="flex justify-center w-full mb-5">
              <textarea
                id="title"
                name="title"
                rows={1}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title..."
                required
                className="text-[46px] text-center font-bold outline-none resize-none overflow-hidden w-full"
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </div>

            <div className="mb-8">
              {/* Hidden file input */}
              <input type="file" id="imageFile" accept="image/*" onChange={handleImageChange} className="hidden" />

              {/* Custom styled div that triggers file input */}
              <div
                onClick={() => document.getElementById("imageFile")?.click()}
                className={`
                  w-full ${imagePreview ? "p-0" : "p-[40px_20px]"} 
                  ${imagePreview ? "border-none" : "border-2 border-dashed border-gray-300"} 
                  rounded-lg text-base box-border 
                  ${imagePreview ? "bg-transparent" : "bg-gray-50"} 
                  text-center cursor-pointer transition-all duration-300 text-gray-500 relative
                  ${imagePreview ? "min-h-[200px]" : ""}
                  hover:border-blue-500 hover:bg-blue-50 flex justify-center items-center
                `}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover rounded-lg max-h-[400px]" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview("");
                        setError("");
                      }}
                      className="
                        absolute top-[10px] right-[10px] bg-[rgba(220,53,69,0.9)] text-white
                        border-none rounded-full w-[30px] h-[30px] cursor-pointer text-lg
                        flex items-center justify-center transition-all duration-300
                        hover:bg-[rgba(220,53,69,1)]
                      "
                      title="Remove image"
                    >
                      ×
                    </button>

                    <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.7)] text-white py-1 px-2 rounded text-xs opacity-80">Click to change image</div>
                  </>
                ) : (
                  <>
                    <Image size={50} />
                    <p>Add showcase image</p>
                  </>
                )}
              </div>

              <small className="text-gray-500 block mt-1">Upload an image file (JPEG, PNG, GIF, WebP) - Max 3MB. Images will be automatically optimized and securely stored.</small>
            </div>

            <div className="mb-5">
              <div className="border border-gray-300 rounded min-h-[500px] overflow-auto">
                <SimpleEditor content={formData.content} onChange={handleEditorChange} placeholder="Write your blog post content here..." />
              </div>
              <small className="text-gray-500 block mt-1">Minimum 100 characters recommended for a quality post.</small>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsPreviewMode(true)} className="rounded-full py-5 px-15 font-bold text-primary-foreground border-2 border-primary-foreground transition-all duration-300 cursor-pointer">
                PREVIEW
              </button>
              <button type="submit" disabled={uploadingImage} className="rounded-full py-5 px-15 font-bold bg-primary-foreground text-white transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed">
                PUBLISH NOW
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Preview Mode - Styled exactly like the real blog post page
        <>
          {/* NavBar Spacer */}
          <div className="w-full h-25" />
          <div className="max-w-[1100px] mx-auto my-[50px] p-[20px]">
            {/* Back to edit button */}
            <div className="mb-[30px]">
              <button onClick={() => setIsPreviewMode(false)} className="text-primary no-underline text-[0.9rem] hover:underline bg-transparent border-none cursor-pointer">
                ← Back to Edit
              </button>
            </div>

            {/* Article header */}
            <header className="mb-[40px]">
              <h1 className="text-[2.5rem] leading-[1.2] mt-0 mr-0 mb-[20px] ml-0 text-[#333] text-center font-bold">{formData.title || "Your Blog Title"}</h1>

              <div className="flex items-center justify-end gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
                <span>
                  By<span className="font-bold"> {formData.authorName || "Your Name"}</span>
                </span>
                <span>•</span>
                <time>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{Math.ceil((formData.content?.split(" ").length || 0) / 200) || 1} min read</span>
              </div>

              {(imagePreview || formData.image) && (
                <div className="mb-[30px] w-full flex justify-center">
                  <img src={imagePreview || formData.image} alt={formData.title || "Preview"} className="w-[90%] h-[400px] object-cover rounded-[8px] border border-[#ddd]" />
                </div>
              )}
            </header>

            {/* Article content */}
            <article
              className="text-[1.1rem] leading-[1.8] text-[#333] mb-[50px]"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formData.content || "<p>Your blog content will appear here...</p>"),
              }}
            />

            {/* Action buttons in preview */}
            <div className="flex items-center justify-between mt-8">
              <button onClick={() => setIsPreviewMode(false)} className="rounded-full py-5 px-15 font-bold text-primary-foreground border-2 border-primary-foreground transition-all duration-300 cursor-pointer">
                ← BACK TO EDIT
              </button>
              <button onClick={handleBlogSubmit} className="rounded-full py-5 px-15 font-bold bg-primary-foreground text-white transition-colors duration-300 cursor-pointer">
                PUBLISH NOW
              </button>
            </div>
          </div>
        </>
      )}

      {/* Author Information Modal */}
      <Dialog open={showAuthorModal} onOpenChange={setShowAuthorModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-4">Author Information</DialogTitle>
          </DialogHeader>

          {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-5 border border-red-200">{error}</div>}

          <form onSubmit={handleAuthorSubmit} className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block mb-1 font-bold">
                Your Name *
              </label>
              <input type="text" id="authorName" name="authorName" value={formData.authorName} onChange={handleInputChange} placeholder="Enter your full name" required className="w-full p-3 border border-gray-300 rounded text-base box-border" />
            </div>

            <div>
              <label htmlFor="authorPhone" className="block mb-1 font-bold">
                Your Phone Number (Optional)
              </label>
              <input type="tel" id="authorPhone" name="authorPhone" value={formData.authorPhone} onChange={handleInputChange} placeholder="Enter your phone number" className="w-full p-3 border border-gray-300 rounded text-base box-border" />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block mb-1 font-bold">
                Your Email *
              </label>
              <input type="email" id="authorEmail" name="authorEmail" value={formData.authorEmail} onChange={handleInputChange} placeholder="Enter your email address" required className="w-full p-3 border border-gray-300 rounded text-base box-border" />
              <small className="text-gray-500 block mt-1">A verification code will be sent to this email</small>
            </div>

            <div className="flex gap-2.5 pt-2.5">
              <button type="submit" disabled={loading || uploadingImage} className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1 disabled:cursor-not-allowed disabled:bg-gray-300">
                {uploadingImage ? "Uploading..." : loading ? "Sending..." : "Submit Post"}
              </button>

              <button type="button" onClick={() => setShowAuthorModal(false)} className="bg-transparent text-gray-500 py-3 px-5 border border-gray-500 rounded text-base cursor-pointer flex-1">
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

          {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-5 border border-green-200">{message}</div>}

          {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-5 border border-red-200">{error}</div>}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block mb-1 font-bold">
                Enter Verification Code
              </label>
              <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").substring(0, 6))} placeholder="000000" maxLength={6} required className="w-full p-4 border border-gray-300 rounded text-2xl text-center tracking-[8px] box-border" />
              <small className="text-gray-500 block mt-1">The code expires in 10 minutes</small>
            </div>

            <div className="flex gap-2.5 items-center">
              <button type="submit" disabled={verifyingCode || verificationCode.length !== 6} className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1 disabled:cursor-not-allowed disabled:bg-gray-300">
                {verifyingCode ? "Verifying..." : "Verify & Submit"}
              </button>

              <button type="button" onClick={handleResendCode} disabled={resendingCode} className="bg-transparent py-3 px-5 rounded text-base cursor-pointer flex-1 border border-primary text-primary transition-all duration-300 disabled:cursor-not-allowed">
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
              className="bg-transparent text-gray-500 py-2 px-4 border border-gray-500 rounded text-sm cursor-pointer w-full"
            >
              ← Back to Author Info
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Thank You Modal - Displayed after successful post submission */}
      <Dialog open={showThankYouModal} onOpenChange={setShowThankYouModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="items-center flex justify-center text-xl font-bold mb-4">
              <CircleCheck className="stroke-primary" size={40} />
              Thank You!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center mb-4">
            <p className="text-gray-700 text-base">Your blog post has been successfully submitted and is now under review. You will be notified via email once it is published.</p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setShowThankYouModal(false);
                router.push("/blog");
              }}
              className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1"
            >
              Go to Blog
            </button>

            <button
              onClick={() => {
                setShowThankYouModal(false);
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
                setIsPreviewMode(false);
              }}
              className="bg-transparent text-gray-500 py-3 px-5 border border-gray-500 rounded text-base cursor-pointer flex-1"
            >
              Write Another
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
