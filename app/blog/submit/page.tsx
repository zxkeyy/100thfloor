"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Basic validation
    if (!formData.title.trim() || !formData.content.trim() || !formData.authorName.trim() || !formData.authorEmail.trim()) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.authorEmail)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      setError("An error occurred while submitting your post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1>Submit a Blog Post</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>Share your thoughts, experiences, or expertise with our community. All submissions are reviewed before publication.</p>

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
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a compelling title for your blog post"
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

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="content" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your blog post content here. Be detailed and engaging!"
            required
            rows={15}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              fontFamily: "Arial, sans-serif",
              lineHeight: "1.5",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <small style={{ color: "#666" }}>Minimum 100 characters recommended for a quality post.</small>
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
            <small style={{ color: "#666" }}>We&apos;ll use this to contact you about your submission.</small>
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label htmlFor="image" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Featured Image URL (Optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/your-image.jpg"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
          <small style={{ color: "#666" }}>Add a URL to an image that represents your blog post. Make sure you have permission to use the image.</small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
            <strong>Submission Guidelines:</strong>
            <br />
            • Posts must be original content written by you
            <br />
            • Keep content appropriate and respectful
            <br />
            • Include proper attribution for any quotes or references
            <br />• Posts will be reviewed within 2-3 business days
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {loading ? "Submitting..." : "Submit Blog Post"}
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
