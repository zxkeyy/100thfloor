"use client";
import { useState, useEffect, useMemo } from "react";
import { Globe, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
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
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");

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
    if (isScrolled || mobileMenuOpen) {
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
  }, [isScrolled, variant, mobileMenuOpen]);

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

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    // If we're on the home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile menu after navigation
    setMobileMenuOpen(false);
  };

  const handleBlogClick = () => {
    router.push("/blog");
    setMobileMenuOpen(false);
  };

  const handleLanguageSwitch = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
    setShowLanguageMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`flex justify-center fixed top-0 left-0 right-0 z-51 transition-all duration-300 ${isScrolled || mobileMenuOpen ? "bg-secondary/90 backdrop-blur-sm" : "bg-transparent"}`}>
        <div className="relative flex items-center justify-between py-4 md:py-6 px-4 md:px-6 max-w-[1400px] w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer z-20" onClick={() => scrollToSection("home")}>
            <Image src={logoIcon || "/placeholder.svg"} alt="100th Floor" width={56} height={56} className="h-10 w-auto md:h-14" priority />
            <Image src={logoText || "/placeholder.svg"} alt="100th Floor" width={150} height={48} className="h-8 w-auto md:h-12" priority />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden z-20 p-2 text-2xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
            {mobileMenuOpen ? <X className={`w-6 h-6 ${colors.primary}`} /> : <Menu className={`w-6 h-6 ${colors.primary}`} />}
          </button>

          {/* Desktop Navigation - Absolutely centered */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex text-lg lg:text-xl items-center space-x-4 lg:space-x-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("home");
              }}
              className={`transition-colors ${activeSection === "home" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
            >
              {t("home")}
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
              className={`transition-colors ${activeSection === "about" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
            >
              {t("about")}
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("services");
              }}
              className={`transition-colors ${activeSection === "services" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
            >
              {t("services")}
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("portfolio");
              }}
              className={`transition-colors ${activeSection === "portfolio" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
            >
              {t("portfolio")}
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBlogClick();
              }}
              className={`transition-colors ${activeSection === "blog" ? `${colors.active} font-bold underline underline-offset-6 decoration-2` : `${colors.secondary} ${colors.hover}`}`}
            >
              {t("blog")}
            </a>
          </nav>

          {/* Right side - Language Selector */}
          <div className="hidden md:flex items-center space-x-4 z-20">
            <div className="relative">
              <button onClick={() => setShowLanguageMenu(!showLanguageMenu)} className={`flex items-center gap-2 font-medium transition-colors ${colors.secondary} ${colors.hover}`}>
                <Globe className="w-4 h-4" />
                {t("language")}
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button onClick={() => handleLanguageSwitch("en")} className={`block w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${locale === "en" ? "bg-gray-50 font-medium" : ""}`}>
                    English
                  </button>
                  <button onClick={() => handleLanguageSwitch("ar")} className={`block w-full text-left px-4 py-2 text-sm rounded-md hover:bg-gray-100 ${locale === "ar" ? "bg-gray-50 font-medium" : ""}`}>
                    العربية
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-secondary/90 backdrop-blur-sm flex flex-col justify-center items-center transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}>
        <nav className="flex flex-col items-center space-y-6 text-xl">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className={`transition-colors ${activeSection === "home" ? "text-white font-bold" : "text-white/70 hover:text-cyan-400"}`}
          >
            {t("home")}
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
            className={`transition-colors ${activeSection === "about" ? "text-white font-bold" : "text-white/70 hover:text-cyan-400"}`}
          >
            {t("about")}
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("services");
            }}
            className={`transition-colors ${activeSection === "services" ? "text-white font-bold" : "text-white/70 hover:text-cyan-400"}`}
          >
            {t("services")}
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("portfolio");
            }}
            className={`transition-colors ${activeSection === "portfolio" ? "text-white font-bold" : "text-white/70 hover:text-cyan-400"}`}
          >
            {t("portfolio")}
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleBlogClick();
            }}
            className={`transition-colors ${activeSection === "blog" ? "text-white font-bold" : "text-white/70 hover:text-cyan-400"}`}
          >
            {t("blog")}
          </a>

          {/* Language Switcher in Mobile Menu */}
          <div className="mt-6 pt-6 border-t border-white/20 flex flex-col items-center">
            <p className="text-white/70 mb-4 text-sm">{t("language")}</p>
            <div className="flex gap-4">
              <button onClick={() => handleLanguageSwitch("en")} className={`px-4 py-2 rounded-md text-sm ${locale === "en" ? "bg-white text-secondary font-medium" : "bg-white/10 text-white hover:bg-white/20"}`}>
                English
              </button>
              <button onClick={() => handleLanguageSwitch("ar")} className={`px-4 py-2 rounded-md text-sm ${locale === "ar" ? "bg-white text-secondary font-medium" : "bg-white/10 text-white hover:bg-white/20"}`}>
                العربية
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
