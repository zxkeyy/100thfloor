/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
        <article className="text-[1.1rem] leading-[1.8] text-[#333] mb-[50px]">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-[20px]">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </>
  );
}
