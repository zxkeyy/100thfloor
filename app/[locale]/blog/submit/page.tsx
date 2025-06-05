/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import "../../../../styles/_variables.scss";
import "../../../../styles/_keyframe-animations.scss";
import { CircleCheck, Image } from "lucide-react";
import DOMPurify from "dompurify";
import { useTranslations, useLocale } from "next-intl";

// Import validation constants from the service
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export default function SubmitBlogPost() {
  const router = useRouter();
  const t = useTranslations("BlogSubmit");
  const locale = useLocale();
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
        setError(t("validationErrors.invalidFileType"));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(t("validationErrors.fileTooLarge"));
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
    if (!formData.title.trim()) return t("validationErrors.titleRequired");
    if (!formData.content.trim() || formData.content === "<p></p>") return t("validationErrors.contentRequired");
    return null;
  };

  const validateAuthorForm = (): string | null => {
    if (!formData.authorName.trim()) return t("validationErrors.nameRequired");
    if (!formData.authorEmail.trim()) return t("validationErrors.emailRequired");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      return t("validationErrors.invalidEmail");
    }

    // Phone validation (only if provided)
    if (formData.authorPhone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.authorPhone.replace(/[\s\-\(\)]/g, ""))) {
        return t("validationErrors.invalidPhone");
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
          setError(t("validationErrors.uploadFailed"));
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
        setError(errorData.error || t("validationErrors.submissionFailed"));
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      if (error instanceof Error) {
        // Handle specific errors from the service
        if (error.message.includes("Too many upload attempts")) {
          setError(t("validationErrors.tooManyUploads"));
        } else if (error.message.includes("Invalid file type")) {
          setError(t("validationErrors.invalidFileType"));
        } else if (error.message.includes("File too large")) {
          setError(t("validationErrors.fileTooLarge"));
        } else {
          setError(t("validationErrors.submissionFailed"));
        }
      } else {
        setError(t("validationErrors.submissionFailed"));
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (locale === "ar") {
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        setMessage(t("newVerificationSent"));
      } else {
        const errorData = await response.json();
        setError(errorData.error || t("validationErrors.submissionFailed"));
      }
    } catch (error) {
      console.error("Error resending code:", error);
      setError(t("validationErrors.submissionFailed"));
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
                placeholder={t("titlePlaceholder")}
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
                      title={t("removeImage")}
                    >
                      ×
                    </button>

                    <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.7)] text-white py-1 px-2 rounded text-xs opacity-80">{t("clickToChangeImage")}</div>
                  </>
                ) : (
                  <>
                    <Image size={50} />
                    <p>{t("addShowcaseImage")}</p>
                  </>
                )}
              </div>

              <small className="text-gray-500 block mt-1">{t("uploadImageHelp")}</small>
            </div>

            <div className="mb-5">
              <div className="border border-gray-300 rounded min-h-[500px] overflow-auto">
                <SimpleEditor content={formData.content} onChange={handleEditorChange} placeholder={t("contentPlaceholder")} />
              </div>
              <small className="text-gray-500 block mt-1">{t("contentHelp")}</small>
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setIsPreviewMode(true)} className="rounded-full py-5 px-15 font-bold text-primary-foreground border-2 border-primary-foreground transition-all duration-300 cursor-pointer">
                {t("preview")}
              </button>
              <button type="submit" disabled={uploadingImage} className="rounded-full py-5 px-15 font-bold bg-primary-foreground text-white transition-colors duration-300 cursor-pointer disabled:cursor-not-allowed">
                {t("publishNow")}
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
                {t("backToEdit")}
              </button>
            </div>

            {/* Article header */}
            <header className="mb-[40px]">
              <h1 className="text-[2.5rem] leading-[1.2] mt-0 mr-0 mb-[20px] ml-0 text-[#333] text-center font-bold">{formData.title || t("yourBlogTitle")}</h1>

              <div className="flex items-center justify-end gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
                <span>
                  {t("by")}
                  <span className="font-bold"> {formData.authorName || t("yourName")}</span>
                </span>
                <span>•</span>
                <time>{formatDate(new Date().toISOString())}</time>
                <span>•</span>
                <span>
                  {Math.ceil((formData.content?.split(" ").length || 0) / 200) || 1} {t("minRead")}
                </span>
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
                __html: DOMPurify.sanitize(formData.content || `<p>${t("yourContentPreview")}</p>`),
              }}
            />

            {/* Action buttons in preview */}
            <div className="flex items-center justify-between mt-8">
              <button onClick={() => setIsPreviewMode(false)} className="rounded-full py-5 px-15 font-bold text-primary-foreground border-2 border-primary-foreground transition-all duration-300 cursor-pointer">
                {t("backToEditFull")}
              </button>
              <button onClick={handleBlogSubmit} className="rounded-full py-5 px-15 font-bold bg-primary-foreground text-white transition-colors duration-300 cursor-pointer">
                {t("publishNow")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Author Information Modal */}
      <Dialog open={showAuthorModal} onOpenChange={setShowAuthorModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-4">{t("authorInformation")}</DialogTitle>
          </DialogHeader>

          {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-5 border border-red-200">{error}</div>}

          <form onSubmit={handleAuthorSubmit} className="space-y-4">
            <div>
              <label htmlFor="authorName" className="block mb-1 font-bold">
                {t("yourNameLabel")}
              </label>
              <input type="text" id="authorName" name="authorName" value={formData.authorName} onChange={handleInputChange} placeholder={t("yourNamePlaceholder")} required className="w-full p-3 border border-gray-300 rounded text-base box-border" />
            </div>

            <div>
              <label htmlFor="authorPhone" className="block mb-1 font-bold">
                {t("yourPhoneLabel")}
              </label>
              <input type="tel" id="authorPhone" name="authorPhone" value={formData.authorPhone} onChange={handleInputChange} placeholder={t("yourPhonePlaceholder")} className="w-full p-3 border border-gray-300 rounded text-base box-border" />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block mb-1 font-bold">
                {t("yourEmailLabel")}
              </label>
              <input type="email" id="authorEmail" name="authorEmail" value={formData.authorEmail} onChange={handleInputChange} placeholder={t("yourEmailPlaceholder")} required className="w-full p-3 border border-gray-300 rounded text-base box-border" />
              <small className="text-gray-500 block mt-1">{t("verificationCodeInfo")}</small>
            </div>

            <div className="flex gap-2.5 pt-2.5">
              <button type="submit" disabled={loading || uploadingImage} className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1 disabled:cursor-not-allowed disabled:bg-gray-300">
                {uploadingImage ? t("uploading") : loading ? t("sending") : t("submitPost")}
              </button>

              <button type="button" onClick={() => setShowAuthorModal(false)} className="bg-transparent text-gray-500 py-3 px-5 border border-gray-500 rounded text-base cursor-pointer flex-1">
                {t("cancel")}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Email Verification Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-md bg-white p-10 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold mb-2">{t("verifyYourEmail")}</DialogTitle>
            <p className="text-center text-gray-600 mb-4">
              {t("verificationSentTo")} <strong>{verificationEmail}</strong>
            </p>
          </DialogHeader>

          {message && <div className="bg-green-100 text-green-800 p-4 rounded mb-5 border border-green-200">{message}</div>}

          {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-5 border border-red-200">{error}</div>}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block mb-1 font-bold">
                {t("enterVerificationCode")}
              </label>
              <input type="text" id="verificationCode" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").substring(0, 6))} placeholder={t("verificationCodePlaceholder")} maxLength={6} required className="w-full p-4 border border-gray-300 rounded text-2xl text-center tracking-[8px] box-border" />
              <small className="text-gray-500 block mt-1">{t("codeExpires")}</small>
            </div>

            <div className="flex gap-2.5 items-center">
              <button type="submit" disabled={verifyingCode || verificationCode.length !== 6} className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1 disabled:cursor-not-allowed disabled:bg-gray-300">
                {verifyingCode ? t("verifying") : t("verifyAndSubmit")}
              </button>

              <button type="button" onClick={handleResendCode} disabled={resendingCode} className="bg-transparent py-3 px-5 rounded text-base cursor-pointer flex-1 border border-primary text-primary transition-all duration-300 disabled:cursor-not-allowed">
                {resendingCode ? t("resending") : t("resend")}
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
              {t("backToAuthorInfo")}
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
              {t("thankYou")}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center mb-4">
            <p className="text-gray-700 text-base">{t("submissionSuccess")}</p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setShowThankYouModal(false);
                router.push("/blog");
              }}
              className="bg-primary text-white py-3 px-5 border-none rounded text-base font-bold cursor-pointer transition-colors duration-300 flex-1"
            >
              {t("goToBlog")}
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
              {t("writeAnother")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
