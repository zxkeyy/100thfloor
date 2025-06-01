/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DOMPurify from "dompurify";

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

const comments = [
  {
    id: 1,
    text: "I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!",
    timeAgo: "5 min ago",
  },
  {
    id: 2,
    text: "I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!",
    timeAgo: "5 min ago",
  },
  {
    id: 3,
    text: "I really appreciate the insights and perspective shared in this article. It's definitely given me something to think about and has helped me see things from a different angle. Thank you for writing and sharing!",
    timeAgo: "5 min ago",
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchPost = async (slug: string) => {
    setLoading(true); // Reset loading state on retry
    setError(""); // Reset error state on retry
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

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto my-[50px] p-[20px] text-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <>
        {/* NavBar Spacer */}
        <div className="w-full h-25" />
        <div className="max-w-[800px] mx-auto my-[50px] p-[20px] text-center">
          <h1>Error</h1>
          <p className="text-red-500 mb-[20px]">{error}</p>
          <div className="flex gap-[15px] justify-center">
            <button onClick={() => fetchPost(params.slug as string)} className="bg-[#007bff] text-white py-[10px] px-[20px] border-none rounded-[4px] cursor-pointer">
              Try Again
            </button>
            <Link href="/blog" className="bg-[#6c757d] text-white py-[10px] px-[20px] no-underline rounded-[4px]">
              Back to Blog
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
  console.log("Post data:", post);
  console.log("Related posts:", relatedPosts);

  return (
    <>
      {/* NavBar Spacer */}
      <div className="w-full h-25" />
      <div className="max-w-[1100px] mx-auto my-[50px] p-[20px]">
        {/* Back to blog link */}
        <div className="mb-[30px]">
          <Link href="/blog" className="text-primary no-underline text-[0.9rem] hover:underline">
            ← Back to Blog
          </Link>
        </div>

        {/* Article header */}
        <header className="mb-[40px]">
          <h1 className="text-[2.5rem] leading-[1.2] mt-0 mr-0 mb-[20px] ml-0 text-[#333] text-center font-bold">{post.title}</h1>

          <div className="flex items-center justify-end gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
            <span>
              By<span className="font-bold"> {post.authorName}</span>
            </span>
            <span>•</span>
            <time>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{Math.ceil(post.content.split(" ").length / 200)} min read</span>
          </div>

          {post.image && (
            <div className="mb-[30px] w-full flex justify-center">
              <img src={post.image} alt={post.title} className="w-[90%] h-[400px] object-cover rounded-[8px] border border-[#ddd]" />
            </div>
          )}
        </header>

        {/* Article content */}
        <article className="text-[1.1rem] leading-[1.8] text-[#333] mb-[50px]" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />

        {/* Comments section */}
        <div className="mx-auto bg-black/1 p-12 rounded-lg border border-gray-100 border-2">
          {/* Comments List */}
          <div className="space-y-6 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{comment.text}</p>
                  <p className="text-gray-400 text-xs">{comment.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input Section */}
          <div className="mt-4">
            <div className="flex gap-3">
              {/* Input Area */}
              <div className="flex-1 min-w-0 ">
                <div className="border border-gray-200 rounded-lg shadow-xl bg-white overflow-hidden">
                  <div className="flex px-3">
                    <div
                      contentEditable
                      className="flex-1 min-w-0 p-3 outline-none text-sm text-gray-700 min-h-20 resize-none"
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "clip",
                        wordBreak: "break-word",
                      }}
                      suppressContentEditableWarning={true}
                      data-placeholder="Write a comment..."
                    />
                    {/* Comment Button */}
                    <div className="flex items-center p-2">
                      <button className="px-4 py-3 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors whitespace-nowrap">Comment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
