"use client";
import { useState } from "react";
import Image from "next/image";
import bgImage from "@/public/Rectangle 21.png";
import { useTranslations } from "next-intl";

function StayInTouch() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const t = useTranslations("Contact");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setMessage(data.message || "Successfully subscribed!");
        setIsError(false);
        setEmail("");

        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
          setMessage("");
        }, 5000);
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage("Network error. Please check your connection and try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[750px] flex items-center justify-center overflow-hidden py-16 md:py-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src={bgImage || "/placeholder.svg"} alt="Contact Background" fill priority className="object-cover" sizes="100vw" />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.1)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] mx-auto px-4 sm:px-6 text-center">
        {/* Backdrop Blur Card */}
        <div style={{ backgroundColor: "#11182780" }} className="backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-4xl p-6 sm:p-8 md:p-12 lg:py-16 xl:py-25 border border-white/10">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">{t("title")}</h2>

          {/* Subtitle */}
          <p className="text-white text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">{t("description")}</p>

          {/* Email Form */}
          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSubmit()} placeholder={t("emailPlaceholder")} disabled={isLoading} className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-md sm:rounded-l-md sm:rounded-r-none bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-300 disabled:opacity-50" />
              <div className="sm:rounded-r-md sm:bg-white/95 sm:p-2">
                <button onClick={handleSubmit} disabled={isLoading || isSubscribed} className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-primary-foreground cursor-pointer hover:bg-primary text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-white/50 focus:outline-none disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed">
                  {isLoading ? "Subscribing..." : isSubscribed ? t("subscribed") : t("subscribe")}
                </button>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-3 rounded-md text-center ${isError ? "bg-red-500/20 border border-red-500/30 text-red-100" : "bg-green-500/20 border border-green-500/30 text-green-100"}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <p className="text-white/80 text-xs sm:text-sm font-semibold italic px-4">{t("privacyNotice")}</p>
        </div>
      </div>

      {/* Decorative Elements - Responsive Positioning */}
      <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/3 right-5 sm:right-10 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500" />
    </section>
  );
}

export default StayInTouch;
