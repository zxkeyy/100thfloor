"use client";
import { useState, useEffect, useMemo } from "react";
import { Settings } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logoIcon from "@/public/100thlogo.png";
import logoText from "@/public/100thlogotext.png";

// Define page variants - add more pages as needed
const PAGE_VARIANTS = {
  // Light variant (dark text) for pages with white/light backgrounds
  light: ["/blog", "/blog/submit", "/admin/login", "/admin/dashboard"],
  // Dark variant (white text) for pages with dark backgrounds
  dark: [
    "/", // home page
    // Add other pages that need white text
  ],
} as const;

type Variant = keyof typeof PAGE_VARIANTS;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  // Determine variant based on current pathname
  const getVariant = (): Variant => {
    // Check for exact matches first
    for (const [variant, pages] of Object.entries(PAGE_VARIANTS) as [Variant, readonly string[]][]) {
      if (pages.includes(pathname)) {
        return variant as Variant;
      }
    }

    // Check for dynamic routes (like /blog/[slug])
    if (pathname.startsWith("/blog/") && pathname !== "/blog" && pathname !== "/blog/submit") {
      return "light"; // blog posts use light variant
    }

    // Default to dark for unknown pages
    return "dark";
  };

  const variant = getVariant();

  // Memoize colors to prevent recreation and ensure synchronous updates
  const colors = useMemo(() => {
    if (isScrolled) {
      return {
        primary: "text-white",
        secondary: "text-white/70",
        hover: "hover:text-cyan-400",
        active: "text-white",
        settings: "text-white/70 hover:text-white",
      };
    }

    return variant === "light"
      ? {
          primary: "text-primary",
          secondary: "text-secondary-foreground",
          hover: "hover:text-primary",
          active: "text-secondary-foreground",
          settings: "text-secondary-foreground hover:text-primary",
        }
      : {
          primary: "text-white",
          secondary: "text-white/70",
          hover: "hover:text-cyan-400",
          active: "text-white",
          settings: "text-white/70 hover:text-white",
        };
  }, [isScrolled, variant]);

  useEffect(() => {
    // Set active section based on URL first
    if (pathname.startsWith("/blog")) {
      setActiveSection("blog");

      // For blog pages, handle scroll for backdrop effect
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
      };

      // Initial scroll check
      handleScroll();

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else if (pathname === "/") {
      // Only use scroll-based detection on home page
      setActiveSection("home"); // Default to home

      // Check if we have a hash in the URL (from navigation)
      const hash = window.location.hash.slice(1);
      if (hash && hash !== "home") {
        setActiveSection(hash);
        // If navigating to a section via hash, we'll likely be scrolled
        setIsScrolled(true);
      }

      const handleScroll = () => {
        const scrollY = window.scrollY;
        setIsScrolled(scrollY > 0);

        // Update active section based on scroll position only on home page
        const sections = ["home", "about", "services", "portfolio"];
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      };

      // Initial scroll check
      handleScroll();

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      // For other pages, just handle scroll for backdrop effect
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 0);
      };

      // Initial scroll check
      handleScroll();

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // If we're on the home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBlogClick = () => {
    window.location.href = "/blog";
  };

  return (
    <header className={`flex justify-center fixed top-0 left-0 right-0 z-50 h-25 transition-all duration-300 ${isScrolled ? "bg-secondary/80 backdrop-blur-sm" : "bg-transparent"}`}>
      <div className="relative flex items-center justify-between py-6 max-w-[1400px] w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
          <Image src={logoIcon} alt="100th Floor" width={56} height={56} className="h-14 w-auto" />
          <Image src={logoText} alt="100th Floor" width={150} height={48} className="h-12 w-auto" />
        </div>

        {/* Navigation - Absolutely centered */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex text-xl items-center space-x-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className={`transition-colors ${activeSection === "home" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
          >
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
            className={`transition-colors ${activeSection === "about" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
          >
            About
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("services");
            }}
            className={`transition-colors ${activeSection === "services" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
          >
            Services
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("portfolio");
            }}
            className={`transition-colors ${activeSection === "portfolio" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
          >
            Portfolio
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBlogClick();
            }}
            className={`transition-colors ${activeSection === "blog" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
          >
            Blog
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <span className={`font-medium ${colors.secondary}`}>En</span>
          <Settings className={`w-5 h-5 cursor-pointer transition-colors ${colors.settings}`} />
        </div>
      </div>
    </header>
  );
}
