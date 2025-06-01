/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  slug: string;
  image?: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("An error occurred while fetching posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
        <h1>Error</h1>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={fetchPosts}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0" }}>Blog</h1>
        <Link
          href="/blog/submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Write a Post
        </Link>
      </div>

      <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "40px" }}>Discover insights, stories, and expertise from our community.</p>

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h3 style={{ color: "#666", marginBottom: "20px" }}>No blog posts yet</h3>
          <p style={{ color: "#999", marginBottom: "30px" }}>Be the first to share your story with our community!</p>
          <Link
            href="/blog/submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Submit Your First Post
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "30px" }}>
          {posts.map((post) => (
            <article
              key={post.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "30px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                {post.image && (
                  <div style={{ flexShrink: 0 }}>
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      margin: "0 0 10px 0",
                      lineHeight: "1.3",
                    }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        color: "#333",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#007bff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#333";
                      }}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <div
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      marginBottom: "15px",
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    <span>By {post.authorName}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#555",
                      lineHeight: "1.6",
                      margin: "0 0 20px 0",
                    }}
                  >
                    {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            padding: "30px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Have something to share?</h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>Join our community of writers and share your insights.</p>
          <Link
            href="/blog/submit"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Submit Your Post
          </Link>
        </div>
      )}
    </div>
  );
}
