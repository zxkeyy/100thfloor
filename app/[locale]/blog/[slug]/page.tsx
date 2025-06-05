/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";
import fallbackImage from "@/public/fallback-image.png";
import { useTranslations, useLocale } from "next-intl";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  slug: string;
  image?: string;
}

interface ApiResponse {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

interface Comment {
  id: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const t = useTranslations("BlogPost");
  const bt = useTranslations("Blog");
  const locale = useLocale();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  useEffect(() => {
    if (data?.post) {
      fetchComments(data.post.id);
    }
  }, [data?.post]);

  const fetchPost = async (slug: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else if (response.status === 404) {
        setError("Post not found");
      } else {
        setError("Failed to fetch post");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("An error occurred while fetching the post");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/comments/${postId}`);
      if (response.ok) {
        const comments = await response.json();
        setComments(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !data?.post) return;

    setSubmittingComment(true);
    setCommentError("");
    setCommentMessage("");

    try {
      const response = await fetch(`/api/comments/${data.post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCommentMessage(result.message);
        setNewComment("");
        // Don't refresh comments since pending comments won't show
      } else {
        const errorData = await response.json();
        setCommentError(errorData.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError("An error occurred while submitting your comment");
    } finally {
      setSubmittingComment(false);
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

  const getReadingTime = (content: string) => {
    const words = content.split(" ").length;
    const readingTime = Math.ceil(words / 200);
    return `${readingTime} ${t("minRead")}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t("justNow");
    if (diffInMinutes < 60) return `${diffInMinutes} ${t("minAgo")}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${t("hourAgo")}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ${t("dayAgo")}`;

    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        {/* NavBar Spacer */}
        <div className="w-full h-20" />
        <div className="max-w-4xl mx-auto my-8 md:my-12 p-4 md:p-5 text-center">
          <h1 className="text-xl md:text-2xl mb-4">{bt("error")}</h1>
          <p className="text-red-500 mb-6 text-sm md:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button onClick={() => fetchPost(params.slug as string)} className="bg-blue-600 text-white py-2.5 px-5 border-none rounded cursor-pointer text-sm md:text-base hover:bg-blue-700 transition-colors">
              {bt("tryAgain")}
            </button>
            <Link href="/blog" className="bg-gray-600 text-white py-2.5 px-5 no-underline rounded text-sm md:text-base hover:bg-gray-700 transition-colors inline-block">
              {t("backToBlog")}
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return null;
  }

  const { post, relatedPosts } = data;

  return (
    <>
      {/* NavBar Spacer */}
      <div className="w-full h-20" />

      <div className="max-w-[1200px] mx-auto my-8 md:my-12 px-4 md:px-6 lg:px-8">
        {/* Back to blog link */}
        <div className="mb-6 md:mb-8">
          <Link href="/blog" className="text-primary no-underline text-sm md:text-base hover:underline transition-colors">
            {t("backToBlog")}
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight mb-6 md:mb-8 text-gray-900 text-center font-bold">{post.title}</h1>

          <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 text-gray-600 text-sm md:text-base mb-6 md:mb-8">
            <span>
              {t("by")}
              <span className="font-bold"> {post.authorName}</span>
            </span>
            <span>•</span>
            <time>{formatDate(post.createdAt)}</time>
            <span>•</span>
            <span>{getReadingTime(post.content)}</span>
          </div>

          {post.image && (
            <div className="mb-6 md:mb-8 w-full">
              <div className="w-full aspect-[2] max-w-4xl mx-auto">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm" />
              </div>
            </div>
          )}
        </header>

        {/* Article content */}
        <article
          className="prose prose-sm md:prose-base lg:prose-lg max-w-none mb-12 md:mb-16"
          style={{
            fontSize: "1rem",
            lineHeight: "1.7",
            color: "#333",
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Comments section */}
        <div className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-lg border border-gray-200">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
            {t("comments")} ({comments.length})
          </h3>

          {/* Comments List */}
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>{t("noComments")}</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 md:gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2">{comment.content}</p>
                    <p className="text-gray-400 text-xs md:text-sm">{getTimeAgo(comment.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input Section */}
          <div className="border-t border-gray-200 pt-6">
            {commentMessage && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">{commentMessage}</div>}

            {commentError && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-200">{commentError}</div>}

            <form onSubmit={handleCommentSubmit}>
              <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">
                  <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 p-3 md:p-4 outline-none text-sm md:text-base text-gray-700 min-h-20 md:min-h-24 resize-none border-none" placeholder={t("writeComment")} maxLength={1000} disabled={submittingComment} />
                  {/* Comment Button */}
                  <div className="flex items-center justify-end p-3 md:p-4 border-t md:border-t-0 md:border-l border-gray-200">
                    <button type="submit" disabled={submittingComment || !newComment.trim()} className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-primary text-white text-sm md:text-base rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {submittingComment ? t("submitting") : t("comment")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-right">
                <small className="text-gray-500">
                  {newComment.length}/1000 {t("characters")}
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* You May Like This Section */}
      <div className="mt-12 md:mt-16 px-4 md:px-0 flex justify-center">
        <div className="w-full bg-gray-100 py-8 md:py-12 lg:py-16 flex justify-center">
          <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8">
            <h2 dir={locale === "ar" ? "rtl" : "ltr"} className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-gray-900">
              {t("youMayLike")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="group">
                  <Link href={`/blog/${relatedPost.slug}`} className="no-underline text-gray-900 block">
                    <div className="w-full aspect-[1.55] mb-3 md:mb-4">
                      <img src={relatedPost.image || fallbackImage.src} alt={relatedPost.title} className="w-full h-full object-cover rounded-lg group-hover:shadow-md transition-shadow duration-200" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 line-clamp-2 group-hover:text-primary transition-colors">{relatedPost.title}</h3>
                    <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1.5 text-gray-600 text-xs md:text-sm">
                      <span>
                        {t("by")}
                        <span className="font-bold"> {relatedPost.authorName}</span>
                      </span>
                      <span>•</span>
                      <time>{formatDate(relatedPost.createdAt)}</time>
                      <span>•</span>
                      <span>{getReadingTime(relatedPost.content)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
