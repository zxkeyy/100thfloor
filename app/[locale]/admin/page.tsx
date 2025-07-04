/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut, Filter, BarChart3, FileText, CheckCircle, XCircle, Clock, Trash2, Eye, MessageSquare, Mail } from "lucide-react";
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

interface Comment {
  id: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  blogPost: {
    id: string;
    title: string;
    slug: string;
  };
}

interface NewsletterSubscription {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations("Admin.dashboard");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newslettersLoading, setNewslettersLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [commentFilter, setCommentFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [newsletterFilter, setNewsletterFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "newsletter">("posts");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }
    fetchPosts();
    fetchComments();
    fetchNewsletters();
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

  const fetchComments = async () => {
    try {
      const response = await fetch("/api/admin/comments");
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const response = await fetch("/api/admin/newsletter");
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data.subscriptions || []);
      } else {
        console.error("Failed to fetch newsletters");
      }
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setNewslettersLoading(false);
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
    if (!confirm(t("confirmations.deletePost"))) return;

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

  const handleCommentApprove = async (commentId: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (response.ok) {
        setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, status: "APPROVED" as const } : comment)));
      }
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleCommentReject = async (commentId: string) => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (response.ok) {
        setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, status: "REJECTED" as const } : comment)));
      }
    } catch (error) {
      console.error("Error rejecting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm(t("confirmations.deleteComment"))) return;

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleNewsletterDelete = async (email: string) => {
    if (!confirm("Are you sure you want to delete this newsletter subscription?")) return;

    try {
      const response = await fetch(`/api/admin/newsletter?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNewsletters(newsletters.filter((newsletter) => newsletter.email !== email));
      }
    } catch (error) {
      console.error("Error deleting newsletter subscription:", error);
    }
  };

  const handlePreview = (post: BlogPost) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };

  const getTranslatedStatus = (status: BlogPost["status"] | Comment["status"]) => {
    return t(`status.${status}`);
  };

  const filteredPosts = posts.filter((post) => (filter === "ALL" ? true : post.status === filter));
  const filteredComments = comments.filter((comment) => (commentFilter === "ALL" ? true : comment.status === commentFilter));

  const getStatusConfig = (status: BlogPost["status"] | Comment["status"]) => {
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
    { label: t("stats.totalPosts"), value: posts.length, icon: FileText, color: "text-blue-600 bg-blue-100" },
    { label: t("stats.pendingPosts"), value: posts.filter((p) => p.status === "PENDING").length, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: t("stats.approvedPosts"), value: posts.filter((p) => p.status === "APPROVED").length, icon: CheckCircle, color: "text-green-600 bg-green-100" },
    { label: t("stats.totalComments"), value: comments.length, icon: MessageSquare, color: "text-purple-600 bg-purple-100" },
    { label: t("stats.pendingComments"), value: comments.filter((c) => c.status === "PENDING").length, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: t("stats.approvedComments"), value: comments.filter((c) => c.status === "APPROVED").length, icon: CheckCircle, color: "text-green-600 bg-green-100" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mt-25">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("title")}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{t("subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user?.email}</p>
                <p className="text-xs text-gray-600">{t("administrator")}</p>
              </div>
              <button onClick={() => signOut()} className="inline-flex items-center px-3 py-2 sm:px-4 bg-gray-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("signOut")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg ${stat.color} flex items-center justify-center self-end sm:self-auto`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8">
              <button onClick={() => setActiveTab("posts")} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                <span className="hidden sm:inline">{t("tabs.posts")}</span>
                <span className="sm:hidden">{t("tabs.postsShort")}</span> ({posts.length})
              </button>
              <button onClick={() => setActiveTab("comments")} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "comments" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                {t("tabs.comments")} ({comments.length})
              </button>
              <button onClick={() => setActiveTab("newsletter")} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "newsletter" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                Newsletter ({newsletters.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <>
            {/* Posts Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t("posts.title")}</h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <select value={filter} onChange={(e) => setFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-auto">
                  <option value="ALL">
                    {t("filters.allPosts")} ({posts.length})
                  </option>
                  <option value="PENDING">
                    {t("filters.pending")} ({posts.filter((p) => p.status === "PENDING").length})
                  </option>
                  <option value="APPROVED">
                    {t("filters.approved")} ({posts.filter((p) => p.status === "APPROVED").length})
                  </option>
                  <option value="REJECTED">
                    {t("filters.rejected")} ({posts.filter((p) => p.status === "REJECTED").length})
                  </option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{t("posts.noPostsFound")}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t("posts.noPostsDescription")}</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredPosts.map((post) => {
                  const statusConfig = getStatusConfig(post.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={post.id} className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.bg} overflow-hidden transition-all hover:shadow-md`}>
                      <div className="p-4 sm:p-6">
                        {/* Post Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{post.title}</h2>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                              <span className="font-medium">{post.authorName}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-xs">{post.authorEmail}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-xs">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3 self-start">
                            <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusConfig.iconColor}`} />
                            <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold ${statusConfig.badge}`}>{getTranslatedStatus(post.status)}</span>
                          </div>
                        </div>

                        {/* Post Image */}
                        {post.image && (
                          <div className="mb-4 sm:mb-6">
                            <img src={post.image} alt={t("posts.postImage")} className="w-full sm:max-w-md h-32 sm:h-48 object-cover rounded-lg border border-gray-200" />
                          </div>
                        )}

                        {/* Post Content */}
                        <div className="mb-4 sm:mb-6">
                          <div className="prose prose-sm max-w-none text-gray-700 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                          {/* Preview Button */}
                          <button onClick={() => handlePreview(post)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t("actions.preview")}</span>
                          </button>

                          {post.status === "PENDING" && (
                            <>
                              <button onClick={() => handleApprove(post.id)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                <span className="hidden sm:inline">{t("actions.approve")}</span>
                              </button>
                              <button onClick={() => handleReject(post.id)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-amber-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                                <span className="hidden sm:inline">{t("actions.reject")}</span>
                              </button>
                            </>
                          )}

                          {post.status === "REJECTED" && (
                            <button onClick={() => handleApprove(post.id)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">{t("actions.approve")}</span>
                            </button>
                          )}

                          {post.status === "APPROVED" && (
                            <button onClick={() => handleReject(post.id)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-amber-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                              <span className="hidden sm:inline">{t("actions.reject")}</span>
                            </button>
                          )}

                          {/* Delete Button */}
                          <button onClick={() => handleDelete(post.id)} className="inline-flex items-center px-3 py-2 sm:px-4 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors sm:ml-auto">
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                            <span className="hidden sm:inline">{t("actions.delete")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <>
            {/* Comments Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t("comments.title")}</h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <select value={commentFilter} onChange={(e) => setCommentFilter(e.target.value as "ALL" | "PENDING" | "APPROVED" | "REJECTED")} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-auto">
                  <option value="ALL">
                    {t("filters.allComments")} ({comments.length})
                  </option>
                  <option value="PENDING">
                    {t("filters.pending")} ({comments.filter((c) => c.status === "PENDING").length})
                  </option>
                  <option value="APPROVED">
                    {t("filters.approved")} ({comments.filter((c) => c.status === "APPROVED").length})
                  </option>
                  <option value="REJECTED">
                    {t("filters.rejected")} ({comments.filter((c) => c.status === "REJECTED").length})
                  </option>
                </select>
              </div>
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{t("comments.noCommentsFound")}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t("comments.noCommentsDescription")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => {
                  const statusConfig = getStatusConfig(comment.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div key={comment.id} className={`bg-white rounded-xl shadow-sm border-2 ${statusConfig.bg} overflow-hidden transition-all hover:shadow-md`}>
                      <div className="p-4 sm:p-6">
                        {/* Comment Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                              <h3 className="text-sm font-medium text-gray-900">
                                {t("comments.commentOn")} <span className="text-primary break-words">{comment.blogPost.title}</span>
                              </h3>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3 self-start">
                            <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusConfig.iconColor}`} />
                            <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold ${statusConfig.badge}`}>{getTranslatedStatus(comment.status)}</span>
                          </div>
                        </div>

                        {/* Comment Content */}
                        <div className="mb-4">
                          <p className="text-gray-700 text-sm leading-relaxed break-words">{comment.content}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                          {comment.status === "PENDING" && (
                            <>
                              <button onClick={() => handleCommentApprove(comment.id)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">
                                <CheckCircle className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">{t("actions.approve")}</span>
                              </button>
                              <button onClick={() => handleCommentReject(comment.id)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors">
                                <XCircle className="h-3 w-3 sm:mr-1" />
                                <span className="hidden sm:inline">{t("actions.reject")}</span>
                              </button>
                            </>
                          )}

                          {comment.status === "REJECTED" && (
                            <button onClick={() => handleCommentApprove(comment.id)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors">
                              <CheckCircle className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">{t("actions.approve")}</span>
                            </button>
                          )}

                          {comment.status === "APPROVED" && (
                            <button onClick={() => handleCommentReject(comment.id)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors">
                              <XCircle className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">{t("actions.reject")}</span>
                            </button>
                          )}

                          {/* View Post Button */}
                          <a href={`/blog/${comment.blogPost.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                            <Eye className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">{t("actions.viewPost")}</span>
                          </a>

                          {/* Delete Button */}
                          <button onClick={() => handleCommentDelete(comment.id)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors sm:ml-auto">
                            <Trash2 className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">{t("actions.delete")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Newsletter Tab */}
        {activeTab === "newsletter" && (
          <>
            {/* Newsletter Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Newsletter Subscriptions</h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <select value={newsletterFilter} onChange={(e) => setNewsletterFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-auto">
                  <option value="ALL">All Subscribers ({newsletters.length})</option>
                  <option value="ACTIVE">Active ({newsletters.filter((n) => n.isActive).length})</option>
                  <option value="INACTIVE">Inactive ({newsletters.filter((n) => !n.isActive).length})</option>
                </select>
              </div>
            </div>

            {/* Newsletter Content */}
            {newslettersLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {(() => {
                  const filteredNewsletters = newsletters.filter((newsletter) => {
                    if (newsletterFilter === "ALL") return true;
                    if (newsletterFilter === "ACTIVE") return newsletter.isActive;
                    if (newsletterFilter === "INACTIVE") return !newsletter.isActive;
                    return true;
                  });

                  if (filteredNewsletters.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <Mail className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No subscribers</h3>
                        <p className="mt-1 text-sm text-gray-500">No newsletter subscriptions found.</p>
                      </div>
                    );
                  }

                  return filteredNewsletters.map((newsletter) => (
                    <div key={newsletter.id} className="p-4 sm:p-6 border-b border-gray-200 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">{newsletter.email}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newsletter.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{newsletter.isActive ? "Active" : "Inactive"}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span>Subscribed: {new Date(newsletter.subscribedAt).toLocaleDateString()}</span>
                            {newsletter.unsubscribedAt && <span className="ml-4">Unsubscribed: {new Date(newsletter.unsubscribedAt).toLocaleDateString()}</span>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {/* Delete Button */}
                          <button onClick={() => handleNewsletterDelete(newsletter.email)} className="inline-flex items-center px-2 py-1.5 sm:px-3 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                            <Trash2 className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </>
        )}
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-xs sm:max-w-3xl lg:max-w-5xl max-h-[90vh] bg-white p-4 sm:p-6 lg:p-10 rounded-lg shadow-lg overflow-hidden flex flex-col mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">{t("preview.title")}</DialogTitle>
          </DialogHeader>

          {/* Modal Content - Styled exactly like the real blog post page */}
          <div className="flex-1 overflow-auto">
            {previewPost && (
              <div className="max-w-full lg:max-w-[1100px] mx-auto my-[10px] sm:my-[20px] p-[10px] sm:p-[20px]">
                {/* Article header */}
                <header className="mb-[20px] sm:mb-[40px]">
                  <h1 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.2] mt-0 mr-0 mb-[15px] sm:mb-[20px] ml-0 text-[#333] text-center font-bold break-words">{previewPost.title}</h1>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-[5px] text-[#666] text-[0.85rem] sm:text-[0.95rem] mb-[20px] sm:mb-[30px]">
                    <span>
                      {t("preview.by")}
                      <span className="font-bold"> {previewPost.authorName}</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <time>
                      {new Date(previewPost.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      {Math.ceil(previewPost.content.split(" ").length / 200)} {t("preview.minRead")}
                    </span>
                  </div>

                  {previewPost.image && (
                    <div className="mb-[20px] sm:mb-[30px] w-full flex justify-center">
                      <img src={previewPost.image} alt={previewPost.title} className="w-full sm:w-[90%] h-[200px] sm:h-[300px] lg:h-[400px] object-cover rounded-[8px] border border-[#ddd]" />
                    </div>
                  )}
                </header>

                {/* Article content */}
                <article className="text-[1rem] sm:text-[1.1rem] leading-[1.6] sm:leading-[1.8] text-[#333] mb-[30px] sm:mb-[50px] prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewPost.content) }} />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              {previewPost && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-semibold ${getStatusConfig(previewPost.status).badge}`}>{getTranslatedStatus(previewPost.status)}</span>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    {t("actions.close")}
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
