/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  image?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchPosts();
  }, [session, status, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (response.ok) {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, status: "APPROVED" as const } : post)));
      }
    } catch (error) {
      console.error("Error approving post:", error);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (response.ok) {
        setPosts(posts.map((post) => (post.id === postId ? { ...post, status: "REJECTED" as const } : post)));
      }
    } catch (error) {
      console.error("Error rejecting post:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => (filter === "ALL" ? true : post.status === filter));

  if (status === "loading" || loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "15px" }}>Welcome, {session.user?.email}</span>
          <button
            onClick={() => signOut()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="filter" style={{ marginRight: "10px" }}>
          Filter by status:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")}
          style={{
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <option value="ALL">All Posts</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p>Total Posts: {posts.length}</p>
        <p>Pending: {posts.filter((p) => p.status === "PENDING").length}</p>
        <p>Approved: {posts.filter((p) => p.status === "APPROVED").length}</p>
        <p>Rejected: {posts.filter((p) => p.status === "REJECTED").length}</p>
      </div>

      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: post.status === "PENDING" ? "#fff3cd" : post.status === "APPROVED" ? "#d4edda" : "#f8d7da",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>{post.title}</h3>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                    By {post.authorName} ({post.authorEmail})
                  </p>
                  <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "12px" }}>Submitted: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: post.status === "PENDING" ? "#ffc107" : post.status === "APPROVED" ? "#28a745" : "#dc3545",
                    color: "white",
                  }}
                >
                  {post.status}
                </span>
              </div>

              {post.image && (
                <div style={{ marginBottom: "15px" }}>
                  <img src={post.image} alt="Post image" style={{ width: "200px", height: "auto", borderRadius: "4px" }} />
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <p style={{ margin: "0", lineHeight: "1.5" }}>{post.content}</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {post.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(post.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#ffc107",
                        color: "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {post.status === "REJECTED" && (
                  <button
                    onClick={() => handleApprove(post.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                )}

                {post.status === "APPROVED" && (
                  <button
                    onClick={() => handleReject(post.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ffc107",
                      color: "black",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                )}

                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
