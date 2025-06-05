/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, Filter, BarChart3, FileText, CheckCircle, XCircle, Clock, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DOMPurify from "dompurify";

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
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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

  const handlePreview = (post: BlogPost) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  const filteredPosts = posts.filter((post) => (filter === "ALL" ? true : post.status === filter));

  const getStatusConfig = (status: BlogPost["status"]) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-amber-50 border-amber-200",
          badge: "bg-amber-500 text-white",
          icon: Clock,
          iconColor: "text-amber-500",
        };
      case "APPROVED":
        return {
          bg: "bg-green-50 border-green-200",
          badge: "bg-green-500 text-white",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50 border-red-200",
          badge: "bg-red-500 text-white",
          icon: XCircle,
          iconColor: "text-red-500",
        };
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-25">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = [
    { label: "Total Posts", value: posts.length, icon: FileText, color: "text-blue-600 bg-blue-100" },
    { label: "Pending", value: posts.filter((p) => p.status === "PENDING").length, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Approved", value: posts.filter((p) => p.status === "APPROVED").length, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    { label: "Rejected", value: posts.filter((p) => p.status === "REJECTED").length, icon: XCircle, color: "text-red-600 bg-red-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-25">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage blog posts and content</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back</p>
                <p className="text-sm text-gray-600">{session.user?.email}</p>
              </div>
              <button onClick={() => signOut()} className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="ALL">All Posts ({posts.length})</option>
              <option value="PENDING">Pending ({posts.filter((p) => p.status === "PENDING").length})</option>
              <option value="APPROVED">Approved ({posts.filter((p) => p.status === "APPROVED").length})</option>
              <option value="REJECTED">Rejected ({posts.filter((p) => p.status === "REJECTED").length})</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">There are no posts matching your current filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const statusConfig = getStatusConfig(post.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={post.id} className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.bg} overflow-hidden transition-all hover:shadow-md`}>
                  <div className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{post.authorName}</span>
                          <span>•</span>
                          <span>{post.authorEmail}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>{post.status}</span>
                      </div>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="mb-6">
                        <img src={post.image} alt="Post image" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" />
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="mb-6">
                      <div className="prose prose-sm max-w-none text-gray-700 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                      {/* Preview Button */}
                      <button onClick={() => handlePreview(post)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </button>

                      {post.status === "PENDING" && (
                        <>
                          <button onClick={() => handleApprove(post.id)} className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                          <button onClick={() => handleReject(post.id)} className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </>
                      )}

                      {post.status === "REJECTED" && (
                        <button onClick={() => handleApprove(post.id)} className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                      )}

                      {post.status === "APPROVED" && (
                        <button onClick={() => handleReject(post.id)} className="inline-flex items-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      )}

                      <button onClick={() => handleDelete(post.id)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors ml-auto">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-white p-10 rounded-lg shadow-lg overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Blog Post Preview</DialogTitle>
          </DialogHeader>

          {/* Modal Content - Styled exactly like the real blog post page */}
          <div className="flex-1 overflow-auto">
            {previewPost && (
              <div className="max-w-[1100px] mx-auto my-[20px] p-[20px]">
                {/* Article header */}
                <header className="mb-[40px]">
                  <h1 className="text-[2.5rem] leading-[1.2] mt-0 mr-0 mb-[20px] ml-0 text-[#333] text-center font-bold">{previewPost.title}</h1>

                  <div className="flex items-center justify-end gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
                    <span>
                      By<span className="font-bold"> {previewPost.authorName}</span>
                    </span>
                    <span>•</span>
                    <time>
                      {new Date(previewPost.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>•</span>
                    <span>{Math.ceil(previewPost.content.split(" ").length / 200)} min read</span>
                  </div>

                  {previewPost.image && (
                    <div className="mb-[30px] w-full flex justify-center">
                      <img src={previewPost.image} alt={previewPost.title} className="w-[90%] h-[400px] object-cover rounded-[8px] border border-[#ddd]" />
                    </div>
                  )}
                </header>

                {/* Article content */}
                <article className="text-[1.1rem] leading-[1.8] text-[#333] mb-[50px]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewPost.content) }} />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {previewPost && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusConfig(previewPost.status).badge}`}>{previewPost.status}</div>
                    <span className="text-sm text-gray-600">Status: {previewPost.status.toLowerCase()}</span>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                    Close Preview
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
