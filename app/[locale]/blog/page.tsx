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
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="w-full h-20" />
        <div className="max-w-6xl mx-auto my-8 md:my-12 p-4 md:p-5 text-center">
          <h1 className="text-xl md:text-2xl mb-4">{t("error")}</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchPosts} className="bg-blue-600 text-white py-2 px-4 md:py-2.5 md:px-5 border-none rounded cursor-pointer text-sm md:text-base">
            {t("tryAgain")}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="mt-25 md:px-10">
      {/* Create Post Button */}
      {posts.length > 0 && (
        <div className="px-4 md:px-0">
          <Link href="/blog/submit" className="mx-auto bg-gradient-to-r from-secondary-foreground to-secondary hover:from-primary-foreground hover:to-primary text-white px-4 md:px-8 py-4 md:py-6 rounded-lg flex items-center justify-between shadow-lg max-w-7xl w-full transition-all duration-100 hover:shadow-xl transform hover:scale-[1.01] active:scale-[1] no-underline">
            <h2 className="text-lg md:text-2xl font-bold">{t("createPost")}</h2>
            <div className="bg-white rounded-full p-1.5 md:p-2 flex items-center justify-center transition-transform duration-200 group-hover:rotate-90">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-teal-800" />
            </div>
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 md:py-16 px-4 md:px-5 max-w-6xl mx-auto my-8 md:my-12">
          <h3 className="text-gray-600 mb-4 md:mb-5 text-lg md:text-xl">{t("noPosts")}</h3>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">{t("noPostsDescription")}</p>
          <Link href="/blog/submit" className="bg-blue-600 text-white py-2.5 md:py-3 px-5 md:px-6 no-underline rounded font-bold text-sm md:text-base inline-block">
            {t("submitFirstPost")}
          </Link>
        </div>
      ) : (
        <>
          {/* Hero Section - First 4 posts */}
          <div className="max-w-7xl mx-auto my-8 md:my-12 px-4 md:px-0">
            {posts.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                {/* Featured Post */}
                {posts.slice(0, 1).map((post) => (
                  <div key={post.id} className="lg:row-span-3">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 block">
                      <div className="w-full aspect-[1.55] mb-3 md:mb-4">
                        <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black leading-tight font-semibold mb-3 md:mb-4">{post.title}</h3>
                      <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1.5 text-gray-600 text-xs md:text-sm">
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

                {/* Side Posts */}
                <div className="space-y-4 md:space-y-6">
                  {posts.slice(1, 4).map((post) => (
                    <div key={post.id} className="w-full">
                      <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex gap-3 md:gap-4 h-full">
                        <div className="w-24 h-[62px] md:w-32 md:h-[82px] lg:w-40 lg:h-[103px] xl:w-48 xl:h-[124px] flex-shrink-0">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base lg:text-lg xl:text-xl text-black leading-tight font-semibold mb-2 line-clamp-2">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1 md:gap-1.5 text-gray-600 text-xs">
                            <span className="truncate">
                              {t("by")}
                              <span className="font-bold"> {post.authorName}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <time className="hidden sm:inline">{formatDate(post.createdAt)}</time>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">
                              {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Two Column Featured Section */}
          {posts.length > 4 && (
            <div className="mt-8 md:mt-12 px-4 md:px-0 flex justify-center">
              <div className="w-full bg-gray-100 md:px-10 py-12 md:py-20 flex justify-center">
                <div className="w-full max-w-7xl px-4 md:px-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {posts.slice(4, 6).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 block">
                          <div className="w-full aspect-[1.55] mb-3 md:mb-4">
                            <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                          </div>
                          <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-black leading-tight font-semibold mb-3 md:mb-4">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1.5 text-gray-600 text-xs md:text-sm">
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

          {/* Mixed Layout Section */}
          {posts.length > 6 && (
            <div className="max-w-7xl mx-auto mt-8 md:mt-12 lg:mt-18 px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                {/* Side Posts */}
                <div className="space-y-4 md:space-y-6 lg:order-1">
                  {posts.slice(6, 9).map((post) => (
                    <div key={post.id} className="w-full">
                      <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex gap-3 md:gap-4 h-full">
                        <div className="w-24 h-[62px] md:w-32 md:h-[82px] lg:w-40 lg:h-[103px] xl:w-48 xl:h-[124px] flex-shrink-0">
                          <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base lg:text-lg xl:text-xl text-black leading-tight font-semibold mb-2 line-clamp-2">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1 md:gap-1.5 text-gray-600 text-xs">
                            <span className="truncate">
                              {t("by")}
                              <span className="font-bold"> {post.authorName}</span>
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <time className="hidden sm:inline">{formatDate(post.createdAt)}</time>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">
                              {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Featured Post */}
                {posts.slice(9, 10).map((post) => (
                  <div key={post.id} className="lg:order-2">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 block">
                      <div className="w-full aspect-[1.55] mb-3 md:mb-4">
                        <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                      </div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-black leading-tight font-semibold mb-3 md:mb-4">{post.title}</h3>
                      <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1.5 text-gray-600 text-xs md:text-sm">
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

          {/* Three Column Grid */}
          {posts.length > 10 && (
            <div className="mt-8 md:mt-12 px-4 md:px-0 flex justify-center">
              <div className="w-full bg-gray-100 md:px-10 py-12 md:py-20 flex justify-center">
                <div className="w-full max-w-7xl px-4 md:px-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                    {posts.slice(10, 13).map((post) => (
                      <div key={post.id}>
                        <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 block">
                          <div className="w-full aspect-[1.55] mb-3 md:mb-4">
                            <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                          </div>
                          <h3 className="text-lg md:text-xl lg:text-2xl text-black leading-tight font-semibold mb-3 md:mb-4">{post.title}</h3>
                          <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1.5 text-gray-600 text-xs md:text-sm">
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

          {/* Remaining Posts Grid */}
          {posts.length > 13 && (
            <div className="max-w-7xl mx-auto mb-8 md:mb-12 lg:mb-18 mt-8 md:mt-12 lg:mt-18 px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {posts.slice(13, displayedPosts).map((post) => (
                  <div key={post.id} className="w-full">
                    <Link href={`/blog/${post.slug}`} className="no-underline text-gray-800 flex gap-3 md:gap-4 h-full">
                      <div className="w-24 h-[62px] md:w-32 md:h-[82px] lg:w-40 lg:h-[103px] flex-shrink-0">
                        <img src={post.image ? post.image : fallbackImage.src} alt={post.title} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base lg:text-lg xl:text-xl text-black leading-tight font-semibold mb-2 line-clamp-2">{post.title}</h3>
                        <div dir={locale == "ar" ? "rtl" : "ltr"} className="flex flex-wrap items-center gap-1 md:gap-1.5 text-gray-600 text-xs">
                          <span className="truncate">
                            {t("by")}
                            <span className="font-bold"> {post.authorName}</span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <time className="hidden sm:inline">{formatDate(post.createdAt)}</time>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            {Math.ceil(post.content.split(" ").length / 200)} {t("minRead")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {displayedPosts < posts.length && (
                <div className="flex justify-center mt-8 md:mt-10">
                  <button onClick={loadMorePosts} className="border-2 md:border-3 rounded-full py-3 md:py-4 lg:py-5 px-8 md:px-12 lg:px-20 cursor-pointer border-primary-foreground text-primary-foreground font-bold hover:bg-primary-foreground hover:text-white transition-colors text-sm md:text-base">
                    {t("viewMorePosts")}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
