/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import fallbackImage from "@/public/fallback-image.png";

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
  const [displayedPosts, setDisplayedPosts] = useState(19); // Start after featured sections (first 12 posts)

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

  const loadMorePosts = () => {
    setDisplayedPosts((prev) => prev + 6);
  };

  if (loading) {
    return (
      <>
        {/* NavBar Spacer */}
        <div className="w-full h-25" />
        <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
          <h1>Loading...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* NavBar Spacer */}
        <div className="w-full h-25" />
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
      </>
    );
  }

  return (
    <>
      {/* NavBar Spacer */}
      <div className="w-full h-25" />

      {posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "1000px", margin: "50px auto" }}>
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
        <>
          {/* Section 1 - Hero Section: Posts 1-4 */}
          <div style={{ maxWidth: "1400px", margin: "50px auto" }}>
            {posts.length > 0 && (
              <div className="grid grid-cols-2 grid-rows-3 h-[700px] gap-18">
                {/* First post gets prominent display */}
                {posts.slice(0, 1).map((post) => (
                  <div key={post.id} className="row-span-3">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-[#333]">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[400px] object-cover rounded-[4px] mb-[10px]" />
                      <h3 className="text-5xl text-black leading-16 font-semibold mb-[10px]">{post.title}</h3>
                      <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem]">
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
                    </Link>
                  </div>
                ))}
                {/* Posts 2-4 */}
                {posts.slice(1, 4).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-[#333] flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-[80%] h-full object-cover rounded-[4px] mb-[10px]" />
                      <div className="py-8 pl-8 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-[10px] w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
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
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2 - Featured Posts: Posts 5-6 */}
          {posts.length > 4 && (
            <div className="mt-[50px] p-10 flex justify-center">
              <div className="w-full bg-gray-100 py-20 flex justify-center">
                <div className="w-full max-w-[1400px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-20">
                    {posts.slice(4, 6).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-[#333]">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[450px] object-cover rounded-[4px] mb-[10px]" />
                          <h3 className="text-5xl text-black leading-16 font-semibold mb-[10px]">{post.title}</h3>
                          <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
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
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3 - Grid Posts: Posts 7-10 */}
          {posts.length > 6 && (
            <div style={{ maxWidth: "1400px" }} className="flex flex-col items-center mx-auto mt-18">
              <div className="grid grid-cols-2 grid-rows-3 grid-flow-col h-[700px] gap-18">
                {/* Posts 7-9 in smaller format */}
                {posts.slice(6, 9).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-[#333] flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-[80%] h-full object-cover rounded-[4px] mb-[10px]" />
                      <div className="py-8 pl-8 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-[10px] w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
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
                      </div>
                    </Link>
                  </div>
                ))}
                {/* Post 10 gets prominent display */}
                {posts.slice(9, 10).map((post) => (
                  <div key={post.id} className="row-span-3">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-[#333]">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[400px] object-cover rounded-[4px] mb-[10px]" />
                      <h3 className="text-5xl text-black leading-16 font-semibold mb-[10px]">{post.title}</h3>
                      <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem]">
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
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4 - Three Column Posts: Posts 11-13 */}
          {posts.length > 10 && (
            <div className="mt-[50px] p-10 flex justify-center">
              <div className="w-full bg-gray-100 py-30 flex justify-center">
                <div className="w-full max-w-[1400px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
                    {posts.slice(10, 13).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-[#333]">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[250px] object-cover rounded-[4px] mb-[10px]" />
                          <h3 className="text-2xl text-black leading-8 font-semibold mb-[10px]">{post.title}</h3>
                          <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
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
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5 - All Remaining Posts Grid: Posts 13+ */}
          {posts.length > 13 && (
            <div style={{ maxWidth: "1400px" }} className="flex flex-col items-center mx-auto mt-18">
              <div className="grid grid-cols-2 gap-18">
                {posts.slice(13, displayedPosts).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-[#333] flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-[80%] h-full object-cover rounded-[4px] mb-[10px]" />
                      <div className="py-8 pl-8 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-[10px] w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div className="flex items-center justify-start gap-[5px] text-[#666] text-[0.95rem] mb-[30px]">
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
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedPosts < posts.length && (
                <button onClick={loadMorePosts} className="my-10 border-3 rounded-full py-5 px-20 cursor-pointer border-primary-foreground text-primary-foreground font-bold hover:bg-primary-foreground hover:text-white transition-colors">
                  VIEW MORE POSTS
                </button>
              )}
            </div>
          )}

          {/* Call to Action Section */}
          {posts.length > 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "50px",
                padding: "30px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                maxWidth: "1400px",
                margin: "50px auto",
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
        </>
      )}
    </>
  );
}
