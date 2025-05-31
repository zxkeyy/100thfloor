import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import logoIcon from "../assets/100thlogo.png";
import logoText from "../assets/100thlogotext.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      // Update active section based on scroll position
      const sections = ["home", "about", "services", "portfolio", "contact"];
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`flex justify-center fixed top-0 left-0 right-0 z-50 h-25 transition-all duration-300 ${isScrolled ? "bg-secondary/80 backdrop-blur-sm" : "bg-transparent"}`}>
      <div className="flex items-center justify-between py-6 max-w-[1400px] w-full">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
          <img src={logoIcon} alt="100th Floor" className="h-14 w-auto" />
          <img src={logoText} alt="100th Floor" className="h-12 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex text-xl items-center space-x-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
            className={`transition-colors font-medium ${activeSection === "home" ? "text-white" : "text-white/70 hover:text-cyan-400"}`}
          >
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
            className={`transition-colors font-medium ${activeSection === "about" ? "text-white" : "text-white/70 hover:text-cyan-400"}`}
          >
            About
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("services");
            }}
            className={`transition-colors font-medium ${activeSection === "services" ? "text-white" : "text-white/70 hover:text-cyan-400"}`}
          >
            Services
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("portfolio");
            }}
            className={`transition-colors font-medium ${activeSection === "portfolio" ? "text-white" : "text-white/70 hover:text-cyan-400"}`}
          >
            Portfolio
          </a>
          <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors font-medium">
            Blog
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <span className="text-white/70 font-medium">En</span>
          <Settings className="w-5 h-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
}
