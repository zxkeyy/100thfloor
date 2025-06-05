/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import fallbackImage from "@/public/fallback-image.png";
import { Plus } from "lucide-react";
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
  image?: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayedPosts, setDisplayedPosts] = useState(19);
  const t = useTranslations("Blog");
  const locale = useLocale();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError(t("failedToFetch"));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMorePosts = () => {
    setDisplayedPosts((prev) => prev + 6);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (locale === "ar") {
      return date.toLocaleDateString("ar-SA", {
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

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center mt-25">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="w-full h-25" />
        <div className="max-w-6xl mx-auto my-12 p-5 text-center">
          <h1>{t("error")}</h1>
          <p className="text-red-500">{error}</p>
          <button onClick={fetchPosts} className="bg-blue-600 text-white py-2.5 px-5 border-none rounded cursor-pointer">
            {t("tryAgain")}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-25" />
      {posts.length > 0 && (
        <>
          <Link href="/blog/submit" className="mx-auto bg-gradient-to-r from-secondary-foreground to-secondary hover:from-primary-foreground hover:to-primary text-white px-8 py-6 rounded-lg flex items-center justify-between shadow-lg max-w-7xl w-full transition-all duration-100 hover:shadow-xl transform hover:scale-[1.01] active:scale-[1]">
            <h2 className="text-2xl font-bold">{t("createPost")}</h2>
            <div className="bg-white rounded-full p-2 flex items-center justify-center transition-transform duration-200 group-hover:rotate-90">
              <Plus className="w-5 h-5 text-teal-800" />
            </div>
          </Link>
        </>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 px-5 max-w-6xl mx-auto my-12">
          <h3 className="text-gray-600 mb-5">{t("noPosts")}</h3>
          <p className="text-gray-400 mb-8">{t("noPostsDescription")}</p>
          <Link href="/blog/submit" className="bg-blue-600 text-white py-3 px-6 no-underline rounded font-bold">
            {t("submitFirstPost")}
          </Link>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto my-12">
            {posts.length > 0 && (
              <div className="grid grid-cols-2 grid-rows-3 h-[700px] gap-18">
                {posts.slice(0, 1).map((post) => (
                  <div key={post.id} className="row-span-3">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[400px] object-cover rounded mb-2.5" />
                      <h3 className="text-5xl text-black leading-tight font-semibold mb-2.5">{post.title}</h3>
                      <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm">
                        <span>
                          {t("by")}
                          <span className="font-bold"> {post.authorName}</span>
                        </span>
                        <span>•</span>
                        <time>{formatDate(post.createdAt)}</time>
                        <span>•</span>
                        <span>
                          {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
                {posts.slice(1, 4).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-4/5 h-full object-cover rounded mb-2.5" />
                      <div className="py-2 pl-2 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-2.5 w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm mb-8">
                          <span>
                            {t("by")}
                            <span className="font-bold"> {post.authorName}</span>
                          </span>
                          <span>•</span>
                          <time>{formatDate(post.createdAt)}</time>
                          <span>•</span>
                          <span>
                            {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {posts.length > 4 && (
            <div className="mt-12 p-2.5 flex justify-center">
              <div className="w-full bg-gray-100 py-5 flex justify-center">
                <div className="w-full max-w-7xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                    {posts.slice(4, 6).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[450px] object-cover rounded mb-2.5" />
                          <h3 className="text-5xl text-black leading-tight font-semibold mb-2.5">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm mb-8">
                            <span>
                              {t("by")}
                              <span className="font-bold"> {post.authorName}</span>
                            </span>
                            <span>•</span>
                            <time>{formatDate(post.createdAt)}</time>
                            <span>•</span>
                            <span>
                              {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {posts.length > 6 && (
            <div className="max-w-7xl flex flex-col items-center mx-auto mt-18">
              <div className="grid grid-cols-2 grid-rows-3 grid-flow-col h-[700px] gap-18">
                {posts.slice(6, 9).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-4/5 h-full object-cover rounded mb-2.5" />
                      <div className="py-2 pl-2 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-2.5 w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm mb-8">
                          <span>
                            {t("by")}
                            <span className="font-bold"> {post.authorName}</span>
                          </span>
                          <span>•</span>
                          <time>{formatDate(post.createdAt)}</time>
                          <span>•</span>
                          <span>
                            {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {posts.slice(9, 10).map((post) => (
                  <div key={post.id} className="row-span-3">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[400px] object-cover rounded mb-2.5" />
                      <h3 className="text-5xl text-black leading-tight font-semibold mb-2.5">{post.title}</h3>
                      <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm">
                        <span>
                          {t("by")}
                          <span className="font-bold"> {post.authorName}</span>
                        </span>
                        <span>•</span>
                        <time>{formatDate(post.createdAt)}</time>
                        <span>•</span>
                        <span>
                          {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {posts.length > 10 && (
            <div className="mt-12 p-2.5 flex justify-center">
              <div className="w-full bg-gray-100 py-8 flex justify-center">
                <div className="w-full max-w-7xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {posts.slice(10, 13).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-[250px] object-cover rounded mb-2.5" />
                          <h3 className="text-2xl text-black leading-8 font-semibold mb-2.5">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm mb-8">
                            <span>
                              {t("by")}
                              <span className="font-bold"> {post.authorName}</span>
                            </span>
                            <span>•</span>
                            <time>{formatDate(post.createdAt)}</time>
                            <span>•</span>
                            <span>
                              {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {posts.length > 13 && (
            <div className="max-w-7xl flex flex-col items-center mx-auto mb-18 mt-18">
              <div className="grid grid-cols-2 gap-18">
                {posts.slice(13, displayedPosts).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex h-full w-full">
                      <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-[270px] h-full object-cover rounded mb-2.5" />
                      <div className="py-2 pl-2 w-full overflow-hidden text-ellipsis">
                        <h3 className="text-xl text-black leading-8 font-semibold mb-2.5 w-full overflow-hidden text-ellipsis">{post.title}</h3>
                        <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex items-center justify-start gap-1.5 text-gray-600 text-sm mb-8">
                          <span>
                            {t("by")}
                            <span className="font-bold"> {post.authorName}</span>
                          </span>
                          <span>•</span>
                          <time>{formatDate(post.createdAt)}</time>
                          <span>•</span>
                          <span>
                            {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {displayedPosts < posts.length && (
                <button onClick={loadMorePosts} className="my-10 border-3 rounded-full py-5 px-20 cursor-pointer border-primary-foreground text-primary-foreground font-bold hover:bg-primary-foreground hover:text-white transition-colors">
                  {t("viewMorePosts")}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
