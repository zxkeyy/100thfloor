"use client";
import { useState } from "react";
import Image from "next/image";
import bgImage from "@/public/Rectangle 21.png";

function StayInTouch() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = () => {
    console.log("Email submitted:", email);
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
    console.log("Email submitted:", isSubscribed);
  };
  return (
    <section className="relative min-h-[750px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src={bgImage} alt="Contact Background" fill priority className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.1)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[70%] mx-auto px-6 text-center">
        {/* Backdrop Blur Card */}
        <div style={{ backgroundColor: "#11182780" }} className=" backdrop-blur-sm rounded-4xl p-8 md:py-25 border border-white/10">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Let&apos;s Stay In Touch</h2>

          {/* Subtitle */}
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

          {/* Email Form */}
          <div className="w-[70%] mx-auto mb-6">
            <div className="flex flex-col sm:flex-row">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-l-md bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-300" />
              <div className="rounded-r-md bg-white/95 p-2">
                <button onClick={handleSubmit} disabled={isSubscribed} className="px-8 py-3 bg-primary-foreground cursor-pointer hover:bg-primary text-white font-semibold rounded-md transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-white/50 focus:outline-none disabled:opacity-50 disabled:transform-none">
                  {isSubscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-white/80 text-sm font-semibold italic">We will never spam you. We respect your privacy.</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-500" />
    </section>
  );
}
export default StayInTouch;
